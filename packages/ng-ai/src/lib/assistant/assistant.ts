import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Button } from '@gremorie/ng-core';
import { ChartArtifact } from '@gremorie/ng-artifacts';
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
import { PromptInputTools } from '../prompt-input/prompt-input-tools';
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
@Component({
  selector: 'ai-assistant',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
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
      'relative mx-auto flex h-[680px] w-full max-w-3xl flex-col overflow-hidden rounded-[16px] border bg-card text-card-foreground shadow-sm',
  },
  template: `
    <!-- AssistantHeader -->
    <header class="flex items-center justify-between gap-2 px-3 py-2">
      <div class="relative inline-flex">
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
        @if (threadMenuOpen()) {
          <div
            role="menu"
            class="absolute left-0 top-10 z-50 w-64 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md motion-safe:animate-[gremorie-pop-in_120ms_ease-out]"
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
            <div class="my-1 h-px bg-border"></div>
            <button
              type="button"
              role="menuitem"
              class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              (click)="newChat()"
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
                <path d="M12 20h9" />
                <path
                  d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"
                />
              </svg>
              New chat
            </button>
          </div>
        }
      </div>

      <div class="flex items-center gap-1">
        <ai-button variant="ghost" size="sm" class="gap-2">
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
          Sources
        </ai-button>
        <ai-button variant="ghost" size="icon" ariaLabel="Share" class="size-9">
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
        <div class="relative inline-flex">
          <ai-button
            variant="ghost"
            size="icon"
            ariaLabel="More actions"
            class="size-9"
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
          @if (overflowMenuOpen()) {
            <div
              role="menu"
              class="absolute right-0 top-10 z-50 w-44 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md motion-safe:animate-[gremorie-pop-in_120ms_ease-out]"
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
              <div class="my-1 h-px bg-border"></div>
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
          }
        </div>
      </div>
    </header>

    @if (view() === 'empty') {
      <!-- AssistantStart - the new-chat state -->
      <div class="flex flex-1 flex-col items-center justify-center gap-6 px-4">
        <h2 class="text-center text-2xl font-semibold tracking-tight">
          How can I help you today?
        </h2>
        <div class="w-full max-w-2xl">
          <ng-container [ngTemplateOutlet]="composer" />
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
                      class="gap-1.5 text-muted-foreground"
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
                      Sources
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
    <ng-template #composer>
      <prompt-input
        class="rounded-xl shadow-lg"
        [state]="status()"
        (submitted)="handleSubmit($event)"
        (canceled)="handleCancel()"
      >
        <prompt-input-header>
          <prompt-input-mentions [items]="contextItems" />
          <context
            class="ml-auto"
            [maxTokens]="200000"
            [usedTokens]="62600"
            modelId="anthropic:claude-3-5-sonnet"
            [usage]="contextUsage"
          >
            <context-trigger class="ml-auto" />
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
        </prompt-input-header>

        <prompt-input-body>
          <prompt-input-textarea [placeholder]="placeholder()" />
        </prompt-input-body>

        <prompt-input-footer>
          <prompt-input-tools class="gap-2">
            <prompt-input-select [value]="defaultMode()">
              <prompt-input-select-trigger ariaLabel="Select mode" size="sm">
                <prompt-input-select-value placeholder="Mode" />
              </prompt-input-select-trigger>
              <prompt-input-select-content>
                @for (mode of modes; track mode.id) {
                  <prompt-input-select-item
                    [value]="mode.id"
                    [label]="mode.label"
                  >
                    {{ mode.label }}
                  </prompt-input-select-item>
                }
              </prompt-input-select-content>
            </prompt-input-select>

            <prompt-input-select [value]="defaultModel()">
              <prompt-input-select-trigger ariaLabel="Select model" size="sm">
                <prompt-input-select-value placeholder="Model" />
              </prompt-input-select-trigger>
              <prompt-input-select-content>
                @for (model of models; track model.id) {
                  <prompt-input-select-item
                    [value]="model.id"
                    [label]="model.label"
                  >
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
                  </prompt-input-select-item>
                }
              </prompt-input-select-content>
            </prompt-input-select>
          </prompt-input-tools>

          <prompt-input-tools class="gap-2">
            <prompt-input-tools>
              <prompt-input-button
                ariaLabel="Search the web"
                tooltip="Search the web"
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
              </prompt-input-button>
              <prompt-input-attach-button tooltip="Attach files" />
              <prompt-input-speech-button tooltip="Voice input" />
            </prompt-input-tools>
            <prompt-input-submit>
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
          </prompt-input-tools>
        </prompt-input-footer>
      </prompt-input>
    </ng-template>
  `,
})
export class Assistant implements OnInit, OnDestroy {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  /** Start in a live conversation (`filled`) or the empty new-chat state. */
  readonly initialView = input<AssistantView>('filled');
  /** Composer textarea placeholder. */
  readonly placeholder = input<string>('Ask anything, or pick a mode...');
  /** Initially-selected composer mode (one of the MODES ids). */
  readonly defaultMode = input<string>('research');
  /** Initially-selected model (one of the MODELS ids). */
  readonly defaultModel = input<string>('claude-sonnet-4-6');

  /** Emits the composed prompt (value + attachments) when the user submits. */
  readonly submitted = output<PromptInputSubmitEvent>();
  /** Emits when the user cancels an in-flight (streaming) response. */
  readonly canceled = output<void>();

  protected readonly view = signal<AssistantView>('filled');
  protected readonly status = signal<PromptInputState>('ready');
  protected readonly threadMenuOpen = signal(false);
  protected readonly overflowMenuOpen = signal(false);

  private timer: ReturnType<typeof setTimeout> | null = null;
  private streamTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.view.set(this.initialView());
  }

  protected threadTitle = () =>
    this.view() === 'empty' ? 'New chat' : 'Q3 board review';

  // ── B2B composer presets (the Gremorie standard) ──────────────────────────
  protected readonly modes: ComposerOption[] = [
    { id: 'ask', label: 'Ask' },
    { id: 'analyze', label: 'Analyze' },
    { id: 'research', label: 'Research' },
    { id: 'plan', label: 'Plan' },
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
    if (target && !this.elementRef.nativeElement.contains(target)) {
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
