import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrnHoverCardContent } from '@spartan-ng/brain/hover-card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/ng-overlays';

import { AttachmentInfo } from '../attachments/attachment-info';
import { AttachmentItem } from '../attachments/attachment-item';
import { AttachmentList } from '../attachments/attachment-list';
import { AttachmentPreview } from '../attachments/attachment-preview';
import { AttachmentRemove } from '../attachments/attachment-remove';
import { type AttachmentData } from '../attachments/attachment.types';
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
import { ClaudeIcon, GeminiIcon, OpenAiIcon } from '../icons/brand-icons';
import { PromptInput } from './prompt-input';
import { PromptInputAttachButton } from './prompt-input-attach-button';
import { PromptInputBody } from './prompt-input-body';
import { PromptInputButton } from './prompt-input-button';
import { PromptInputFooter } from './prompt-input-footer';
import { PromptInputHeader } from './prompt-input-header';
import {
  PromptInputMentions,
  type PromptInputMentionsItem,
} from './prompt-input-mentions';
import {
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
} from './prompt-input-select';
import { PromptInputSpeechButton } from './prompt-input-speech-button';
import { PromptInputSubmit } from './prompt-input-submit';
import { PromptInputTextarea } from './prompt-input-textarea';
import { PromptInputToolbar } from './prompt-input-toolbar';
import { PromptInputTools } from './prompt-input-tools';

// ── B2B (Gremorie standard) datasets — byte-identical to the React
//    `B2BPromptInput` in rx-ai/prompt-input.stories.tsx ─────────────────────

const B2B_MODES: Array<{ id: string; label: string; icon: string }> = [
  { id: 'ask', label: 'Ask', icon: 'question' },
  { id: 'analyze', label: 'Analyze', icon: 'chart' },
  { id: 'research', label: 'Research', icon: 'telescope' },
  { id: 'plan', label: 'Plan', icon: 'list' },
];

const B2B_MODELS: Array<{ id: string; label: string; icon: string }> = [
  { id: 'claude-opus-4-8', label: 'Claude Opus 4.8', icon: 'claude' },
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6', icon: 'claude' },
  { id: 'gpt-5', label: 'GPT-5', icon: 'openai' },
  { id: 'gemini-2-5-pro', label: 'Gemini 2.5 Pro', icon: 'gemini' },
];

// Example context catalogue for the "@ Add context" command palette.
const B2B_CONTEXT: PromptInputMentionsItem[] = [
  { id: 'q3-revenue', label: 'Q3 revenue.csv', group: 'Recent' },
  { id: 'brand', label: 'Brand guidelines', group: 'Recent' },
  { id: 'onboarding-prd', label: 'Onboarding PRD', group: 'Recent' },
  { id: 'notion-roadmap', label: 'Notion: Roadmap', group: 'Workspace' },
  { id: 'linear-sprint', label: 'Linear: Sprint 24', group: 'Workspace' },
  { id: 'github-app', label: 'GitHub: gremorie/app', group: 'Workspace' },
];

// Per-category token usage powering the context hovercard breakdown + cost.
const B2B_USAGE: ContextUsage = {
  inputTokens: 52_600,
  outputTokens: 6_400,
  reasoningTokens: 2_200,
  cachedInputTokens: 14_000,
  totalTokens: 61_200,
};

// Sample attachment chips — byte-identical to the React Workbench story.
const B2B_ATTACHMENTS: Array<AttachmentData & { type: string }> = [
  {
    id: 'chart',
    type: 'file',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop',
    mediaType: 'image/jpeg',
    filename: 'q3-revenue-chart.png',
  },
  {
    id: 'pdf',
    type: 'file',
    url: '',
    mediaType: 'application/pdf',
    filename: 'q3-report.pdf',
  },
  {
    id: 'call',
    type: 'file',
    url: '',
    mediaType: 'audio/mpeg',
    filename: 'earnings-call.mp3',
  },
];

const meta: Meta<PromptInput> = {
  title: 'AI/Chatbot/PromptInput',
  component: PromptInput,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        PromptInputTextarea,
        PromptInputToolbar,
        PromptInputTools,
        PromptInputSubmit,
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'PromptInput is the container for AI prompt entry. It owns the state machine ' +
          '(ready → submitted → streaming → error), keyboard shortcuts, and attachment validation. ' +
          'Compose with PromptInputTextarea, PromptInputToolbar, PromptInputSubmit and others.',
      },
    },
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['ready', 'submitted', 'streaming', 'error'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'ghost', 'bordered'],
    },
    disabled: { control: 'boolean' },
    submitOnEnter: { control: 'boolean' },
  },
  args: {
    state: 'ready',
    size: 'md',
    variant: 'default',
    disabled: false,
    submitOnEnter: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <prompt-input [state]="state" [size]="size" [variant]="variant"
                    [disabled]="disabled" [submitOnEnter]="submitOnEnter"
                    style="max-width: 32rem;">
        <prompt-input-textarea placeholder="Ask anything…"></prompt-input-textarea>
        <prompt-input-toolbar>
          <prompt-input-tools></prompt-input-tools>
          <prompt-input-submit></prompt-input-submit>
        </prompt-input-toolbar>
      </prompt-input>
    `,
  }),
};

export default meta;

type Story = StoryObj<PromptInput>;

// Outlined trigger to match the Button "outline" variant — byte-identical to
// the React story's OUTLINE_TRIGGER. The fill stays transparent so the control
// sits flush on the card surface (--card, white) instead of showing
// --background (#fafafa), which reads as a faint grey pill on the white card.
const OUTLINE_TRIGGER =
  'border border-input border-solid bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent';

/**
 * Args-driven demo controls for the Workbench story. `state` drives the real
 * composer state; the booleans are composition toggles (story-level, NOT
 * component inputs) mirroring the contract's `demo` block and the Figma
 * boolean show/hide properties. Defaults match the contract demo defaults so
 * the no-args render is the same full composition as before.
 */
type WorkbenchArgs = {
  state: 'ready' | 'submitted' | 'streaming' | 'error';
  mentions: boolean;
  contextMeter: boolean;
  webSearch: boolean;
  attachments: boolean;
  voice: boolean;
  modeSelect: boolean;
  modelSelect: boolean;
};

/**
 * Workbench — responsive preview frame matching the catalog convention.
 * Renders the full B2B (Gremorie standard) composition — the same composer
 * the Assistant block ships (see `../assistant/assistant.ts`): @-context
 * mentions + context gauge header, textarea, and a footer with Mode/Model
 * selects plus web, attach, voice and submit actions. The composer fills the
 * available width and tracks the container as it resizes. Same dataset as
 * the React Workbench story.
 *
 * Driven by the workbench Properties panel via Storybook args: `state` binds
 * the composer state (the submit button follows it); each boolean toggles one
 * composition section (in real code you include or omit the subcomponent).
 */
export const Workbench: StoryObj<WorkbenchArgs> = {
  parameters: { layout: 'padded', controls: { disable: true } },
  args: {
    state: 'ready',
    mentions: true,
    contextMeter: true,
    webSearch: true,
    attachments: false,
    voice: true,
    modeSelect: true,
    modelSelect: true,
  },
  decorators: [
    moduleMetadata({
      imports: [
        BrnHoverCardContent,
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
        ClaudeIcon,
        GeminiIcon,
        OpenAiIcon,
        Tooltip,
        TooltipContent,
        TooltipProvider,
        TooltipTrigger,
        AttachmentList,
        AttachmentItem,
        AttachmentPreview,
        AttachmentInfo,
        AttachmentRemove,
        PromptInputHeader,
        PromptInputBody,
        PromptInputFooter,
        PromptInputMentions,
        PromptInputSelect,
        PromptInputSelectTrigger,
        PromptInputSelectValue,
        PromptInputSelectContent,
        PromptInputSelectItem,
        PromptInputButton,
        PromptInputAttachButton,
        PromptInputSpeechButton,
      ],
    }),
  ],
  render: (args) => ({
    props: {
      ...args,
      modes: B2B_MODES,
      models: B2B_MODELS,
      contextItems: B2B_CONTEXT,
      contextUsage: B2B_USAGE,
      attachmentItems: B2B_ATTACHMENTS,
      outlineTrigger: OUTLINE_TRIGGER,
    },
    template: `
        <prompt-input [state]="state">
          @if (mentions || contextMeter) {
            <prompt-input-header>
              @if (mentions) {
                <prompt-input-mentions [items]="contextItems" />
              }
              @if (contextMeter) {
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
              }
            </prompt-input-header>
          }

          <prompt-input-body>
            @if (attachments) {
              <attachment-list variant="inline" class="w-full px-3">
                @for (attachment of attachmentItems; track attachment.id) {
                  <attachment-item [data]="attachment" variant="inline">
                    <attachment-preview />
                    <attachment-info />
                    <attachment-remove />
                  </attachment-item>
                }
              </attachment-list>
            }
            <prompt-input-textarea placeholder="What would you like to know?" />
          </prompt-input-body>

          <prompt-input-footer>
            <prompt-input-tools class="gap-2">
              @if (modeSelect) {
              <prompt-input-select [value]="'research'">
                <gn-tooltip-provider>
                  <gn-tooltip>
                    <gn-tooltip-trigger>
                      <prompt-input-select-trigger
                        ariaLabel="Select mode"
                        size="sm"
                        [class]="outlineTrigger"
                      >
                        <prompt-input-select-value placeholder="Mode" />
                      </prompt-input-select-trigger>
                    </gn-tooltip-trigger>
                    <gn-tooltip-content>Response mode</gn-tooltip-content>
                  </gn-tooltip>
                </gn-tooltip-provider>
                <prompt-input-select-content>
                  @for (mode of modes; track mode.id) {
                    <prompt-input-select-item
                      [value]="mode.id"
                      [label]="mode.label"
                    >
                      <ng-template>
                        @switch (mode.icon) {
                          @case ('question') {
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
                                d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"
                              />
                              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                              <path d="M12 17h.01" />
                            </svg>
                          }
                          @case ('chart') {
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
                              <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                              <rect x="15" y="5" width="4" height="12" rx="1" />
                              <rect x="7" y="8" width="4" height="9" rx="1" />
                            </svg>
                          }
                          @case ('telescope') {
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
                                d="m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44"
                              />
                              <path d="m13.56 11.747 4.332-.924" />
                              <path d="m16 21-3.105-6.21" />
                              <path
                                d="M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z"
                              />
                              <path d="m6.158 8.633 1.114 4.456" />
                              <path d="m8 21 3.105-6.21" />
                              <circle cx="12" cy="13" r="2" />
                            </svg>
                          }
                          @case ('list') {
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
                              <path d="M13 5h8" />
                              <path d="M13 12h8" />
                              <path d="M13 19h8" />
                              <path d="m3 17 2 2 4-4" />
                              <path d="m3 7 2 2 4-4" />
                            </svg>
                          }
                        }
                      </ng-template>
                      {{ mode.label }}
                    </prompt-input-select-item>
                  }
                </prompt-input-select-content>
              </prompt-input-select>
              }

              @if (modelSelect) {
              <prompt-input-select [value]="'claude-sonnet-4-6'">
                <gn-tooltip-provider>
                  <gn-tooltip>
                    <gn-tooltip-trigger>
                      <prompt-input-select-trigger
                        ariaLabel="Select model"
                        size="sm"
                        [class]="outlineTrigger"
                      >
                        <prompt-input-select-value placeholder="Model" />
                      </prompt-input-select-trigger>
                    </gn-tooltip-trigger>
                    <gn-tooltip-content>Model</gn-tooltip-content>
                  </gn-tooltip>
                </gn-tooltip-provider>
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
              <prompt-input-tools>
                @if (webSearch) {
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
                }
                <prompt-input-attach-button tooltip="Attach files" />
                @if (voice) {
                <prompt-input-speech-button tooltip="Voice input" />
                }
              </prompt-input-tools>
              <!-- Custom send glyph only when ready; other states use the
                   component's built-in status icons (spinner / stop / retry),
                   mirroring the React children-fallback behavior. -->
              @if (state === 'ready') {
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
              } @else {
              <prompt-input-submit tooltip="Send" />
              }
            </prompt-input-tools>
          </prompt-input-footer>
        </prompt-input>
    `,
  }),
};

export const Ready: Story = { args: { state: 'ready' } };
export const Submitted: Story = { args: { state: 'submitted' } };
export const Streaming: Story = { args: { state: 'streaming' } };
export const Error: Story = { args: { state: 'error' } };

export const SizeSmall: Story = {
  name: 'Size · sm',
  args: { size: 'sm' },
};

export const SizeLarge: Story = {
  name: 'Size · lg',
  args: { size: 'lg' },
};

export const VariantGhost: Story = {
  name: 'Variant · ghost',
  args: { variant: 'ghost' },
};

export const Disabled: Story = { args: { disabled: true } };
