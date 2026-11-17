import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  linkedSignal,
  OnDestroy,
  OnInit,
  output,
  signal,
  ViewEncapsulation,
  viewChild,
} from '@angular/core';
import { Button } from '@gremorie/ng-core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { MENU_BELOW_END, MENU_BELOW_START } from '../overlay-positions';
import {
  lucideAtSign,
  lucideChartColumnBig,
  lucideCornerDownLeft,
  lucideListChecks,
  lucideMessageCirclePlus,
  lucideMessageCircleQuestion,
  lucideSparkles,
  lucideTelescope,
} from '@ng-icons/lucide';
import { ChartArtifact } from '@gremorie/ng-artifacts';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/ng-overlays';
import { BrnHoverCardContent } from '@spartan-ng/brain/hover-card';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '../conversation';
import {
  Context,
  ContextCacheUsage,
  ContextContent,
  ContextContentBody,
  ContextContentFooter,
  ContextContentHeader,
  ContextInputUsage,
  ContextOutputUsage,
  ContextReasoningUsage,
  ContextTrigger,
  type ContextUsage,
} from '../context';
import {
  ClaudeIcon,
  GeminiIcon,
  MessageCircleIcon,
  OpenAiIcon,
} from '../icons/brand-icons';
import {
  Message,
  MessageAction,
  MessageActions,
  MessageBranch,
  MessageBranchContent,
  MessageBranchItem,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
  MessageToolbar,
} from '../message';
import { Reasoning, ReasoningContent, ReasoningTrigger } from '../reasoning';
import { PromptInput } from '../prompt-input/prompt-input';
import { PromptInputAttachButton } from '../prompt-input/prompt-input-attach-button';
import { PromptInputBody } from '../prompt-input/prompt-input-body';
import { PromptInputButton } from '../prompt-input/prompt-input-button';
import { PromptInputFooter } from '../prompt-input/prompt-input-footer';
import { PromptInputHeader } from '../prompt-input/prompt-input-header';
import {
  PromptInputMentions,
  type PromptInputMentionsItem,
} from '../prompt-input/prompt-input-mentions';
import {
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
} from '../prompt-input/prompt-input-select';
import { PromptInputSpeechButton } from '../prompt-input/prompt-input-speech-button';
import { PromptInputSubmit } from '../prompt-input/prompt-input-submit';
import { PromptInputTextarea } from '../prompt-input/prompt-input-textarea';
import {
  PromptInputTools,
  PromptInputToolsCollapsed,
  PromptInputToolsExpanded,
  type PromptInputToolsCollapse,
} from '../prompt-input/prompt-input-tools';
import {
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuCheckboxItem,
  PromptInputActionMenuContent,
  PromptInputActionMenuRadioGroup,
  PromptInputActionMenuRadioItem,
  PromptInputActionMenuSeparator,
  PromptInputActionMenuSub,
  PromptInputActionMenuSubContent,
  PromptInputActionMenuSubTrigger,
  PromptInputActionMenuSwitchItem,
  PromptInputActionMenuTrigger,
} from '../prompt-input/prompt-input-action-menu';
import type {
  PromptInputState,
  PromptInputSubmitEvent,
} from '../prompt-input/prompt-input.types';

/** Which surface the block shows: a live conversation, or the new-chat start. */
export type AssistantView = 'filled' | 'empty';

interface ComposerOption {
  id: string;
  label: string;
}

/**
 * Assistant — the flagship Gremorie composed AI chat surface, at FULL visual +
 * structural parity with the React `assistant` block
 * (`apps/docs/components/preview/blocks/assistant.tsx`).
 *
 * Anatomy (market-standard parts):
 *
 *   AssistantHeader   - thread/history switcher (left), primary actions + an
 *                       overflow menu of secondary actions (right)
 *   AssistantContent  - the conversation: messages with reasoning, an inline
 *                       generated chart artifact, sources, response branches +
 *                       actions
 *   AssistantComposer - the floating PromptInput (B2B: context, mode, model)
 *   AssistantDisclaimer
 *
 * Ships the same canned conversation + mock state machine (ready -> submitted ->
 * streaming -> ready) as the React block, so the two read identically. Wire
 * `(submitted)` to your AI SDK to make it real.
 */
// The Assistant is a size container (@container/assistant). Below 36rem of
// its OWN width (a card, a sidebar, a phone) it switches to compact: actions
// with a label become 32px icon buttons (the label stays for screen readers),
// select triggers show only their icon, and the new-chat composer docks to
// the bottom. Same classes as the React edition.
const COMPACT_ICON_BUTTON =
  '@max-xl/assistant:size-8 @max-xl/assistant:gap-0 @max-xl/assistant:p-0';
const COMPACT_LABEL = '@max-xl/assistant:sr-only';
const COMPACT_SELECT_TRIGGER =
  '@max-xl/assistant:size-8 @max-xl/assistant:justify-center @max-xl/assistant:px-0 @max-xl/assistant:[&_[data-slot=select-value-label]]:sr-only @max-xl/assistant:[&>svg:last-child]:hidden';

@Component({
  selector: 'ai-assistant',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideAtSign,
      lucideChartColumnBig,
      lucideCornerDownLeft,
      lucideListChecks,
      lucideMessageCirclePlus,
      lucideMessageCircleQuestion,
      lucideSparkles,
      lucideTelescope,
    }),
  ],
  imports: [
    NgTemplateOutlet,
    NgIcon,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    BrnHoverCardContent,
    Button,
    ChartArtifact,
    ClaudeIcon,
    GeminiIcon,
    OpenAiIcon,
    MessageCircleIcon,
    Conversation,
    ConversationContent,
    ConversationScrollButton,
    Context,
    ContextTrigger,
    ContextContent,
    ContextContentHeader,
    ContextContentBody,
    ContextContentFooter,
    ContextInputUsage,
    ContextOutputUsage,
    ContextReasoningUsage,
    ContextCacheUsage,
    Message,
    MessageContent,
    MessageToolbar,
    MessageActions,
    MessageAction,
    MessageBranch,
    MessageBranchContent,
    MessageBranchItem,
    MessageBranchSelector,
    MessageBranchPrevious,
    MessageBranchNext,
    MessageBranchPage,
    MessageResponse,
    Reasoning,
    ReasoningTrigger,
    ReasoningContent,
    PromptInput,
    PromptInputHeader,
    PromptInputBody,
    PromptInputFooter,
    PromptInputTextarea,
    PromptInputTools,
    PromptInputToolsExpanded,
    PromptInputToolsCollapsed,
    PromptInputActionMenu,
    PromptInputActionMenuTrigger,
    PromptInputActionMenuContent,
    PromptInputActionMenuSwitchItem,
    PromptInputActionAddAttachments,
    PromptInputActionMenuSub,
    PromptInputActionMenuSubTrigger,
    PromptInputActionMenuSubContent,
    PromptInputActionMenuRadioGroup,
    PromptInputActionMenuRadioItem,
    PromptInputActionMenuCheckboxItem,
    PromptInputActionMenuSeparator,
    PromptInputSubmit,
    PromptInputButton,
    PromptInputAttachButton,
    PromptInputSpeechButton,
    PromptInputMentions,
    PromptInputSelect,
    PromptInputSelectTrigger,
    PromptInputSelectValue,
    PromptInputSelectContent,
    PromptInputSelectItem,
  ],
  host: {
    'data-slot': 'assistant',
    class:
      '@container/assistant relative mx-auto flex h-[680px] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-card text-card-foreground shadow-md ring-1 ring-foreground/10',
  },
  template: `
    <!-- AssistantHeader -->
    <header class="flex items-center justify-between gap-2 px-3 py-2">
      <div
        class="relative inline-flex"
        cdkOverlayOrigin
        #threadOrigin="cdkOverlayOrigin"
      >
        <ai-button
          variant="ghost"
          size="sm"
          class="gap-2 font-medium"
          [attr.aria-expanded]="threadMenuOpen()"
          (pressedChange)="toggleThreadMenu()"
        >
          <ai-message-circle-icon class="size-4 text-muted-foreground" />
          <span class="max-w-[14rem] truncate">{{ threadTitle() }}</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            class="size-4 text-muted-foreground"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </ai-button>
        <ng-template
          cdkConnectedOverlay
          [cdkConnectedOverlayOrigin]="threadOrigin"
          [cdkConnectedOverlayOpen]="threadMenuOpen()"
          [cdkConnectedOverlayPositions]="menuBelowStart"
          [cdkConnectedOverlayViewportMargin]="8"
          (detach)="threadMenuOpen.set(false)"
        >
          <div
            role="menu"
            #threadPanel
            class="w-64 rounded-md border border-border bg-popover-surface p-1 text-popover-foreground shadow-md motion-safe:animate-[gremorie-pop-in_120ms_ease-out]"
          >
            <p class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Recent chats
            </p>
            @for (thread of threads; track thread) {
              <button
                type="button"
                role="menuitem"
                class="flex w-full items-center rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                (click)="openThread()"
              >
                {{ thread }}
              </button>
            }
            <div class="-mx-1 my-1 h-px bg-border"></div>
            <button
              type="button"
              role="menuitem"
              class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              (click)="newChat()"
            >
              <ng-icon
                name="lucideMessageCirclePlus"
                class="size-4"
                aria-hidden="true"
              />
              New chat
            </button>
          </div>
        </ng-template>
      </div>

      <!-- Header actions: ghost icon buttons, no gap between them. -->
      <div class="flex items-center">
        <gr-tooltip-provider>
          <gr-tooltip>
            <gr-tooltip-trigger>
              <ai-button variant="ghost" size="icon" ariaLabel="Sources">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  class="size-4"
                >
                  <path d="m16 6 4 14" />
                  <path d="M12 6v14" />
                  <path d="M8 8v12" />
                  <path d="M4 4v16" />
                </svg>
              </ai-button>
            </gr-tooltip-trigger>
            <gr-tooltip-content>Sources</gr-tooltip-content>
          </gr-tooltip>
        </gr-tooltip-provider>
        <gr-tooltip-provider>
          <gr-tooltip>
            <gr-tooltip-trigger>
              <ai-button variant="ghost" size="icon" ariaLabel="Share">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  class="size-4"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                  <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                </svg>
              </ai-button>
            </gr-tooltip-trigger>
            <gr-tooltip-content>Share</gr-tooltip-content>
          </gr-tooltip>
        </gr-tooltip-provider>
        <div
          class="relative inline-flex"
          cdkOverlayOrigin
          #overflowOrigin="cdkOverlayOrigin"
        >
          <gr-tooltip-provider>
            <gr-tooltip>
              <gr-tooltip-trigger>
                <ai-button
                  variant="ghost"
                  size="icon"
                  ariaLabel="More actions"
                  [attr.aria-expanded]="overflowMenuOpen()"
                  (pressedChange)="toggleOverflowMenu()"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                    class="size-4"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </ai-button>
              </gr-tooltip-trigger>
              <gr-tooltip-content>More actions</gr-tooltip-content>
            </gr-tooltip>
          </gr-tooltip-provider>
          <ng-template
            cdkConnectedOverlay
            [cdkConnectedOverlayOrigin]="overflowOrigin"
            [cdkConnectedOverlayOpen]="overflowMenuOpen()"
            [cdkConnectedOverlayPositions]="menuBelowEnd"
            [cdkConnectedOverlayViewportMargin]="8"
            (detach)="overflowMenuOpen.set(false)"
          >
            <div
              role="menu"
              #overflowPanel
              class="w-44 rounded-md border border-border bg-popover-surface p-1 text-popover-foreground shadow-md motion-safe:animate-[gremorie-pop-in_120ms_ease-out]"
            >
              <button
                type="button"
                role="menuitem"
                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                (click)="closeOverflowMenu()"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  class="size-4"
                >
                  <rect width="20" height="5" x="2" y="3" rx="1" />
                  <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
                  <path d="M10 12h4" />
                </svg>
                Archive
              </button>
              <button
                type="button"
                role="menuitem"
                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                (click)="closeOverflowMenu()"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  class="size-4"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path
                    d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
                  />
                </svg>
                Duplicate
              </button>
              <div class="-mx-1 my-1 h-px bg-border"></div>
              <button
                type="button"
                role="menuitem"
                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                (click)="closeOverflowMenu()"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  class="size-4"
                >
                  <path d="M3 6h18" />
                  <path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  />
                </svg>
                Delete
              </button>
            </div>
          </ng-template>
        </div>
      </div>
    </header>

    @if (view() === 'empty') {
      <!-- AssistantStart - the new-chat state -->
      <div
        class="flex flex-1 flex-col items-center justify-center gap-6 px-4 @max-xl/assistant:justify-end @max-xl/assistant:px-3 @max-xl/assistant:pb-3"
      >
        <h2
          class="text-center text-2xl font-semibold @max-xl/assistant:flex @max-xl/assistant:flex-1 @max-xl/assistant:items-center"
        >
          How can I help you today?
        </h2>
        <div class="w-full max-w-2xl">
          <ng-container
            [ngTemplateOutlet]="composer"
            [ngTemplateOutletContext]="{ newChat: true }"
          />
        </div>
      </div>
    } @else {
      <!-- AssistantContent - the conversation -->
      <div class="relative flex-1 overflow-hidden">
        <conversation class="h-full">
          <conversation-content class="gap-6 px-4 pt-6 pb-80">
            <message from="user">
              <message-content>{{ userQuestion }}</message-content>
              <message-toolbar
                class="mt-1 justify-end opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
              >
                <message-actions class="ml-auto">
                  <message-action tooltip="Copy" label="Copy">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                      class="size-4"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path
                        d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
                      />
                    </svg>
                  </message-action>
                  <message-action tooltip="Edit" label="Edit">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                      class="size-4"
                    >
                      <path d="M12 20h9" />
                      <path
                        d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"
                      />
                    </svg>
                  </message-action>
                </message-actions>
              </message-toolbar>
            </message>

            <message from="assistant">
              <message-branch [defaultBranch]="0">
                <message-branch-content>
                  <ng-template messageBranchItem>
                    <ng-container
                      [ngTemplateOutlet]="answer"
                      [ngTemplateOutletContext]="{ $implicit: answerFull }"
                    />
                  </ng-template>
                  <ng-template messageBranchItem>
                    <ng-container
                      [ngTemplateOutlet]="answer"
                      [ngTemplateOutletContext]="{ $implicit: answerConcise }"
                    />
                  </ng-template>
                </message-branch-content>
                <message-toolbar>
                  <message-actions>
                    <message-action
                      tooltip="Good response"
                      label="Good response"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        class="size-4"
                      >
                        <path d="M7 10v12" />
                        <path
                          d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"
                        />
                      </svg>
                    </message-action>
                    <message-action tooltip="Bad response" label="Bad response">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        class="size-4"
                      >
                        <path d="M17 14V2" />
                        <path
                          d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"
                        />
                      </svg>
                    </message-action>
                    <message-action tooltip="Copy" label="Copy">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        class="size-4"
                      >
                        <rect
                          width="14"
                          height="14"
                          x="8"
                          y="8"
                          rx="2"
                          ry="2"
                        />
                        <path
                          d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
                        />
                      </svg>
                    </message-action>
                    <message-action tooltip="Regenerate" label="Regenerate">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        class="size-4"
                      >
                        <path
                          d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
                        />
                        <path d="M21 3v5h-5" />
                        <path
                          d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
                        />
                        <path d="M8 16H3v5" />
                      </svg>
                    </message-action>
                    <message-action tooltip="Share" label="Share">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        class="size-4"
                      >
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                        <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                      </svg>
                    </message-action>
                  </message-actions>
                  <div class="flex items-center gap-1">
                    <ai-button
                      variant="ghost"
                      size="sm"
                      [class]="
                        'gap-1.5 text-muted-foreground ' + compactIconButton
                      "
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        class="size-4"
                      >
                        <path d="m16 6 4 14" />
                        <path d="M12 6v14" />
                        <path d="M8 8v12" />
                        <path d="M4 4v16" />
                      </svg>
                      <span [class]="compactLabel">Sources</span>
                    </ai-button>
                    <message-branch-selector from="assistant">
                      <message-branch-previous />
                      <message-branch-page />
                      <message-branch-next />
                    </message-branch-selector>
                  </div>
                </message-toolbar>
              </message-branch>
            </message>
          </conversation-content>
          <conversation-scroll-button />
        </conversation>
        <!-- Top fade: content dissolves into the header as it scrolls up. -->
        <div
          class="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-card to-transparent"
        ></div>
      </div>

      <!-- AssistantComposer - floats over the conversation -->
      <div class="pointer-events-none absolute inset-x-0 bottom-0 z-10">
        <div class="h-8 bg-gradient-to-t from-card to-transparent"></div>
        <div
          class="pointer-events-auto space-y-2 bg-card/80 px-3 pb-3 backdrop-blur-sm"
        >
          <ng-container [ngTemplateOutlet]="composer" />
          <p class="text-center text-xs text-muted-foreground">
            Gremorie can make mistakes. Check important info.
          </p>
        </div>
      </div>
    }

    <!-- The assistant answer template, reused as each branch body. -->
    <ng-template #answer let-text>
      <message-content>
        <reasoning [isStreaming]="false" [duration]="3">
          <reasoning-trigger />
          <reasoning-content [text]="reasoning" />
        </reasoning>
        <message-response [text]="text" />
        <chart-artifact
          class="mt-1"
          [title]="'Q3 revenue by region'"
          [description]="'Chart · generated just now'"
          [data]="revenueByRegion"
          [type]="'bar'"
          [categoryKey]="'region'"
          [valueKey]="'revenue'"
          [categoryLabel]="'Region'"
          [valueLabel]="'Revenue'"
          [numberFormat]="revenueNumberFormat"
          [fileName]="'q3-revenue-by-region'"
        />
      </message-content>
    </ng-template>

    <!-- The floating B2B composer (PromptInput). -->
    <!-- Context meter: in the header with mentions, beside the text without. -->
    <ng-template #contextMeterTpl>
      <context
        [class]="meterInBody() ? '' : 'ml-auto'"
        [maxTokens]="200000"
        [usedTokens]="62600"
        modelId="anthropic:claude-3-5-sonnet"
        [usage]="contextUsage"
      >
        <context-trigger [class]="meterInBody() ? '' : 'ml-auto'" />
        <ng-template brnHoverCardContent>
          <context-content>
            <context-content-header />
            <context-content-body>
              <div class="space-y-1">
                <context-input-usage />
                <context-output-usage />
                <context-reasoning-usage />
                <context-cache-usage />
              </div>
            </context-content-body>
            <context-content-footer />
          </context-content>
        </ng-template>
      </context>
    </ng-template>

    <ng-template #composer let-newChat="newChat">
      <prompt-input
        [layout]="composerLayout()"
        [state]="status()"
        (submitted)="handleSubmit($event)"
        (canceled)="handleCancel()"
      >
        <!-- The send button, shared by both layouts. Declared inside
             <prompt-input> so it injects the composer it submits. -->
        <ng-template #submitTpl let-newChat="newChat">
          @if (newChat) {
            <!-- New chat: "Chat" + the enter icon; compact keeps the arrow. -->
            <prompt-input-submit
              size="sm"
              label="Chat"
              tooltip="Chat"
              class="gap-2 pr-2.5 pl-3 @max-md/prompt-input:size-8 @max-md/prompt-input:gap-0 @max-md/prompt-input:px-0!"
            >
              <span class="@max-md/prompt-input:hidden">Chat</span>
              <span class="flex @max-md/prompt-input:hidden">
                <ng-icon
                  name="lucideCornerDownLeft"
                  class="size-4"
                  aria-hidden="true"
                />
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
                class="hidden size-4 @max-md/prompt-input:block"
              >
                <path d="m5 12 7-7 7 7" />
                <path d="M12 19V5" />
              </svg>
            </prompt-input-submit>
          } @else {
            <prompt-input-submit tooltip="Send">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
                class="size-4"
              >
                <path d="m5 12 7-7 7 7" />
                <path d="M12 19V5" />
              </svg>
            </prompt-input-submit>
          }
        </ng-template>

        @if (composerLayout() === 'inline') {
          <!-- One row: every composer control lives in the "+" menu (context,
               mode and model as submenus, web search as a switch, attachments);
               the text takes the middle; dictation and send stay at hand. -->
          <prompt-input-action-menu>
            <prompt-input-action-menu-trigger ariaLabel="Add" tooltip="Add" />
            <prompt-input-action-menu-content class="w-64">
              @if (mentions()) {
                <prompt-input-action-menu-sub>
                  <prompt-input-action-menu-sub-trigger
                    [value]="inlineContext().length || null"
                  >
                    <ng-icon
                      name="lucideAtSign"
                      class="size-4"
                      aria-hidden="true"
                    />
                    Add context
                  </prompt-input-action-menu-sub-trigger>
                  <prompt-input-action-menu-sub-content>
                    @for (item of contextItems; track item.id) {
                      <prompt-input-action-menu-checkbox-item
                        [checked]="inlineContext().includes(item.id)"
                        (checkedChange)="toggleInlineContext(item.id, $event)"
                      >
                        {{ item.label }}
                      </prompt-input-action-menu-checkbox-item>
                    }
                  </prompt-input-action-menu-sub-content>
                </prompt-input-action-menu-sub>
              }
              @if (modeSelect()) {
                <prompt-input-action-menu-sub>
                  <prompt-input-action-menu-sub-trigger
                    [value]="inlineModeLabel()"
                  >
                    <ng-icon
                      name="lucideTelescope"
                      class="size-4"
                      aria-hidden="true"
                    />
                    Mode
                  </prompt-input-action-menu-sub-trigger>
                  <prompt-input-action-menu-sub-content>
                    <prompt-input-action-menu-radio-group
                      [(value)]="inlineMode"
                    >
                      @for (mode of modes; track mode.id) {
                        <prompt-input-action-menu-radio-item [value]="mode.id">
                          <ng-icon
                            [name]="mode.icon"
                            class="size-4"
                            aria-hidden="true"
                          />
                          {{ mode.label }}
                        </prompt-input-action-menu-radio-item>
                      }
                    </prompt-input-action-menu-radio-group>
                  </prompt-input-action-menu-sub-content>
                </prompt-input-action-menu-sub>
              }
              @if (modelSelect()) {
                <prompt-input-action-menu-sub>
                  <prompt-input-action-menu-sub-trigger
                    [value]="inlineModelLabel()"
                  >
                    <ng-icon
                      name="lucideSparkles"
                      class="size-4"
                      aria-hidden="true"
                    />
                    Model
                  </prompt-input-action-menu-sub-trigger>
                  <prompt-input-action-menu-sub-content>
                    <prompt-input-action-menu-radio-group
                      [(value)]="inlineModel"
                    >
                      @for (model of models; track model.id) {
                        <prompt-input-action-menu-radio-item [value]="model.id">
                          @switch (model.icon) {
                            @case ('claude') {
                              <ai-claude-icon class="size-4" />
                            }
                            @case ('openai') {
                              <ai-openai-icon class="size-4" />
                            }
                            @case ('gemini') {
                              <ai-gemini-icon class="size-4" />
                            }
                          }
                          {{ model.label }}
                        </prompt-input-action-menu-radio-item>
                      }
                    </prompt-input-action-menu-radio-group>
                  </prompt-input-action-menu-sub-content>
                </prompt-input-action-menu-sub>
              }
              @if (mentions() || modeSelect() || modelSelect()) {
                <prompt-input-action-menu-separator />
              }
              <prompt-input-action-menu-switch-item
                [checked]="webSearch()"
                (checkedChange)="webSearch.set($event)"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  class="size-4"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                Search the web
              </prompt-input-action-menu-switch-item>
              <prompt-input-action-add-attachments label="Attach files" />
            </prompt-input-action-menu-content>
          </prompt-input-action-menu>
          <prompt-input-body>
            <prompt-input-textarea
              class="flex-1"
              [placeholder]="placeholder()"
            />
          </prompt-input-body>
          <prompt-input-speech-button tooltip="Voice input" />
          <ng-container
            [ngTemplateOutlet]="submitTpl"
            [ngTemplateOutletContext]="{ newChat: newChat }"
          />
        } @else {
          @if (showHeader()) {
            <prompt-input-header>
              @if (mentions()) {
                <prompt-input-mentions
                  [items]="contextItems"
                  variant="secondary"
                />
              }
              @if (contextMeter()) {
                <ng-container [ngTemplateOutlet]="contextMeterTpl" />
              }
            </prompt-input-header>
          }

          <prompt-input-body>
            @if (meterInBody()) {
              <!-- Mentions off: the meter sits beside the text, not alone above it. -->
              <div class="flex w-full items-start">
                <prompt-input-textarea
                  class="flex-1"
                  [placeholder]="placeholder()"
                />
                <div class="shrink-0 pt-1 pr-3">
                  <ng-container [ngTemplateOutlet]="contextMeterTpl" />
                </div>
              </div>
            } @else {
              <prompt-input-textarea [placeholder]="placeholder()" />
            }
          </prompt-input-body>

          <prompt-input-footer>
            <prompt-input-tools class="gap-2">
              @if (modeSelect()) {
                <prompt-input-select [value]="defaultMode()">
                  <prompt-input-select-trigger
                    ariaLabel="Select mode"
                    size="sm"
                    variant="secondary"
                    [class]="compactSelectTrigger"
                  >
                    <prompt-input-select-value placeholder="Mode" />
                  </prompt-input-select-trigger>
                  <prompt-input-select-content>
                    @for (mode of modes; track mode.id) {
                      <prompt-input-select-item
                        [value]="mode.id"
                        [label]="mode.label"
                      >
                        <ng-template>
                          <ng-icon
                            [name]="mode.icon"
                            class="size-4"
                            aria-hidden="true"
                          />
                        </ng-template>
                        {{ mode.label }}
                      </prompt-input-select-item>
                    }
                  </prompt-input-select-content>
                </prompt-input-select>
              }

              @if (modelSelect()) {
                <prompt-input-select [value]="defaultModel()">
                  <prompt-input-select-trigger
                    ariaLabel="Select model"
                    size="sm"
                    variant="secondary"
                    [class]="compactSelectTrigger"
                  >
                    <prompt-input-select-value placeholder="Model" />
                  </prompt-input-select-trigger>
                  <prompt-input-select-content>
                    @for (model of models; track model.id) {
                      <prompt-input-select-item
                        [value]="model.id"
                        [label]="model.label"
                      >
                        <ng-template>
                          @switch (model.icon) {
                            @case ('claude') {
                              <ai-claude-icon class="size-4" />
                            }
                            @case ('openai') {
                              <ai-openai-icon class="size-4" />
                            }
                            @case ('gemini') {
                              <ai-gemini-icon class="size-4" />
                            }
                          }
                        </ng-template>
                        {{ model.label }}
                      </prompt-input-select-item>
                    }
                  </prompt-input-select-content>
                </prompt-input-select>
              }
            </prompt-input-tools>

            <prompt-input-tools class="gap-2">
              <!-- Ghost icon group: no gap between the icons; the outer gap-2
                   separates the group from the send button. -->
              <prompt-input-tools class="gap-0" [collapse]="toolsCollapse()">
                <prompt-input-tools-expanded>
                  <prompt-input-button
                    ariaLabel="Search the web"
                    tooltip="Search the web"
                    [active]="webSearch()"
                    (pressed)="webSearch.set(!webSearch())"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                      class="size-4"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path
                        d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"
                      />
                      <path d="M2 12h20" />
                    </svg>
                  </prompt-input-button>
                  <prompt-input-attach-button tooltip="Attach files" />
                </prompt-input-tools-expanded>
                <!-- Collapsed: web search and attachments move to the overflow
                     menu; the mic, an input mode, stays at hand. -->
                <prompt-input-tools-collapsed>
                  <prompt-input-action-menu>
                    <prompt-input-action-menu-trigger
                      ariaLabel="More tools"
                      tooltip="More tools"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        class="size-4"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                      </svg>
                    </prompt-input-action-menu-trigger>
                    <prompt-input-action-menu-content>
                      <prompt-input-action-menu-switch-item
                        [checked]="webSearch()"
                        (checkedChange)="webSearch.set($event)"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                          class="size-4"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path
                            d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"
                          />
                          <path d="M2 12h20" />
                        </svg>
                        Search the web
                      </prompt-input-action-menu-switch-item>
                      <prompt-input-action-add-attachments
                        label="Attach files"
                      />
                    </prompt-input-action-menu-content>
                  </prompt-input-action-menu>
                </prompt-input-tools-collapsed>
                <prompt-input-speech-button tooltip="Voice input" />
              </prompt-input-tools>
              <ng-container
                [ngTemplateOutlet]="submitTpl"
                [ngTemplateOutletContext]="{ newChat: newChat }"
              />
            </prompt-input-tools>
          </prompt-input-footer>
        }
      </prompt-input>
    </ng-template>
  `,
})
export class Assistant implements OnInit, OnDestroy {
  protected readonly compactIconButton = COMPACT_ICON_BUTTON;
  protected readonly compactLabel = COMPACT_LABEL;
  protected readonly compactSelectTrigger = COMPACT_SELECT_TRIGGER;

  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  /** Start in a live conversation (`filled`) or the empty new-chat state. */
  readonly initialView = input<AssistantView>('filled');
  /** Composer textarea placeholder. */
  readonly placeholder = input<string>('Ask anything, or pick a mode...');
  /** Initially-selected composer mode (one of the MODES ids). */
  readonly defaultMode = input<string>('research');
  /** Initially-selected model (one of the MODELS ids). */
  readonly defaultModel = input<string>('claude-sonnet-4-6');

  /**
   * Composer parts, all on by default: the block ships complete and you strip
   * what your product does not have, rather than assembling it piece by piece.
   */
  /** Show the mode select in the composer footer. */
  readonly modeSelect = input(true);
  /** Show the model select in the composer footer. */
  readonly modelSelect = input(true);
  /** Show the @-mention trigger in the composer header. */
  readonly mentions = input(true);
  /** Show the context-window meter in the composer header. */
  readonly contextMeter = input(true);
  /**
   * Composer tools: `auto` (default) shows them inline and moves web search
   * and attachments to an overflow menu when the composer is narrow;
   * `never` keeps them inline; `always` keeps the menu. Mirrors React.
   */
  readonly toolsCollapse = input<PromptInputToolsCollapse>('auto');
  /**
   * Composer layout: `stacked` (default, rows) or `inline` (one row: a "+"
   * menu with every composer control, the text, mic and send). Mirrors React.
   */
  readonly composerLayout = input<'stacked' | 'inline'>('stacked');

  /**
   * The header exists only to carry the mentions trigger and the context
   * meter. With both off it would render as an empty strip above the textarea,
   * so it is dropped entirely rather than left hollow.
   */
  // The context meter sits in the header beside the mentions trigger; with
  // mentions off it moves beside the textarea, so no row holds it alone.
  readonly showHeader = computed(() => this.mentions());
  readonly meterInBody = computed(
    () => !this.mentions() && this.contextMeter(),
  );

  /** Emits the composed prompt (value + attachments) when the user submits. */
  readonly submitted = output<PromptInputSubmitEvent>();
  /** Emits when the user cancels an in-flight (streaming) response. */
  readonly canceled = output<void>();

  protected readonly view = signal<AssistantView>('filled');
  protected readonly status = signal<PromptInputState>('ready');
  protected readonly threadMenuOpen = signal(false);
  /** The composer's web-search toggle. */
  protected readonly webSearch = signal(false);
  // One-row composer state: mode/model start from the defaults; context is
  // the set of items checked in the "Add context" submenu.
  protected readonly inlineMode = linkedSignal(() => this.defaultMode());
  protected readonly inlineModel = linkedSignal(() => this.defaultModel());
  protected readonly inlineContext = signal<string[]>([]);
  protected readonly inlineModeLabel = computed(
    () => this.modes.find((m) => m.id === this.inlineMode())?.label ?? null,
  );
  protected readonly inlineModelLabel = computed(
    () => this.models.find((m) => m.id === this.inlineModel())?.label ?? null,
  );

  protected toggleInlineContext(id: string, on: boolean): void {
    this.inlineContext.update((c) =>
      on ? [...c, id] : c.filter((x) => x !== id),
    );
  }
  protected readonly menuBelowStart = MENU_BELOW_START;
  protected readonly menuBelowEnd = MENU_BELOW_END;
  private readonly threadPanel =
    viewChild<ElementRef<HTMLElement>>('threadPanel');
  private readonly overflowPanel =
    viewChild<ElementRef<HTMLElement>>('overflowPanel');
  protected readonly overflowMenuOpen = signal(false);

  private timer: ReturnType<typeof setTimeout> | null = null;
  private streamTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.view.set(this.initialView());
  }

  protected threadTitle = () =>
    this.view() === 'empty' ? 'New chat' : 'Q3 board review';

  // ── B2B composer presets (the Gremorie standard) ──────────────────────────
  // Same icons as the React edition's MODES: in compact mode the trigger
  // shows only the icon, so a mode without one would render an empty button.
  protected readonly modes: Array<ComposerOption & { icon: string }> = [
    { id: 'ask', label: 'Ask', icon: 'lucideMessageCircleQuestion' },
    { id: 'analyze', label: 'Analyze', icon: 'lucideChartColumnBig' },
    { id: 'research', label: 'Research', icon: 'lucideTelescope' },
    { id: 'plan', label: 'Plan', icon: 'lucideListChecks' },
  ];

  protected readonly models: Array<ComposerOption & { icon: string }> = [
    { id: 'claude-opus-4-8', label: 'Claude Opus 4.8', icon: 'claude' },
    { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6', icon: 'claude' },
    { id: 'gpt-5', label: 'GPT-5', icon: 'openai' },
    { id: 'gemini-2-5-pro', label: 'Gemini 2.5 Pro', icon: 'gemini' },
  ];

  protected readonly contextItems: PromptInputMentionsItem[] = [
    { id: 'q3-revenue', label: 'Q3 revenue.csv', group: 'Recent' },
    { id: 'board-deck', label: 'Board deck Q2', group: 'Recent' },
    { id: 'finance-db', label: 'Finance warehouse', group: 'Workspace' },
  ];

  protected readonly threads = [
    'Q3 board review',
    'Pricing model v2',
    'Onboarding email copy',
    'Churn analysis — enterprise',
  ];

  // Per-category token usage powering the Context hovercard breakdown + cost.
  protected readonly contextUsage: ContextUsage = {
    inputTokens: 52_600,
    outputTokens: 6_400,
    reasoningTokens: 2_200,
    cachedInputTokens: 14_000,
    totalTokens: 61_200,
  };

  // ── Mocked conversation content ───────────────────────────────────────────
  protected readonly userQuestion =
    'How did Q3 revenue break down by region? Give me a chart plus the underlying table I can drop straight into the board deck.';

  protected readonly reasoning =
    'Pulling Q3 revenue from the finance warehouse, comparing against Q2 and the forecast, then drafting a board-ready one-pager. Keeping it to headline, three KPIs, and one risk.';

  protected readonly answerFull = `**Q3 revenue landed at $4.2M, up 18% QoQ** and 6% ahead of forecast, driven by net expansion in the enterprise tier.

**By region**
- North America carried the quarter at $2.18M (52% of total)
- EMEA followed at $1.12M, with APAC and LATAM rounding out the mix

The regional breakdown is charted below. Toggle to the table view for the exact figures, or download the data and image straight from the artifact.`;

  protected readonly answerConcise = `**Q3 revenue: $4.2M, +18% QoQ**, 6% ahead of forecast. North America led at $2.18M, then EMEA at $1.12M. Full regional split is in the artifact below (chart or table).`;

  // Q3 revenue split by region — powers the inline ChartArtifact (chart + table).
  protected readonly revenueByRegion = [
    { region: 'North America', revenue: 2_180_000 },
    { region: 'EMEA', revenue: 1_120_000 },
    { region: 'APAC', revenue: 640_000 },
    { region: 'LATAM', revenue: 260_000 },
  ];

  protected readonly revenueNumberFormat: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  };

  // ── Header menu controls ──────────────────────────────────────────────────
  toggleThreadMenu(): void {
    this.threadMenuOpen.update((v) => !v);
    this.overflowMenuOpen.set(false);
  }

  toggleOverflowMenu(): void {
    this.overflowMenuOpen.update((v) => !v);
    this.threadMenuOpen.set(false);
  }

  closeOverflowMenu(): void {
    this.overflowMenuOpen.set(false);
  }

  openThread(): void {
    this.view.set('filled');
    this.threadMenuOpen.set(false);
  }

  newChat(): void {
    this.view.set('empty');
    this.threadMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node | null;
    if (
      target &&
      !this.elementRef.nativeElement.contains(target) &&
      !this.threadPanel()?.nativeElement.contains(target) &&
      !this.overflowPanel()?.nativeElement.contains(target)
    ) {
      this.threadMenuOpen.set(false);
      this.overflowMenuOpen.set(false);
    }
  }

  // ── Mock state machine: ready -> submitted -> streaming -> ready ───────────
  handleSubmit(event: PromptInputSubmitEvent): void {
    if (!event.value.trim() || this.status() !== 'ready') {
      return;
    }
    this.submitted.emit(event);
    // Sending from the new-chat state drops you into the conversation.
    this.view.set('filled');
    this.status.set('submitted');
    this.clearTimers();
    this.timer = setTimeout(() => {
      this.status.set('streaming');
      this.streamTimer = setTimeout(() => this.status.set('ready'), 900);
    }, 600);
  }

  handleCancel(): void {
    this.canceled.emit();
    this.clearTimers();
    this.status.set('ready');
  }

  private clearTimers(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.streamTimer) {
      clearTimeout(this.streamTimer);
      this.streamTimer = null;
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }
}
