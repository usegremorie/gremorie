import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '../conversation';
import { Message, MessageContent } from '../message';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '../reasoning';
import { PromptInput } from '../prompt-input/prompt-input';
import { PromptInputTextarea } from '../prompt-input/prompt-input-textarea';
import { PromptInputToolbar } from '../prompt-input/prompt-input-toolbar';
import { PromptInputTools } from '../prompt-input/prompt-input-tools';
import { PromptInputSubmit } from '../prompt-input/prompt-input-submit';
import type {
  PromptInputState,
  PromptInputSubmitEvent,
} from '../prompt-input/prompt-input.types';

/**
 * Assistant — the flagship composed AI chat surface, at parity with the React
 * `chat-surface` block (`apps/docs/content/blocks/chat-surface.mdx`).
 *
 * It composes the existing `@gremorie/ng-ai` primitives into one self-contained
 * surface: a stick-to-bottom {@link Conversation} log with a canned user turn,
 * an assistant turn carrying a collapsible {@link Reasoning} step, and a
 * {@link PromptInput} composer pinned to the bottom.
 *
 * The same canned conversation as the React block ships here so the two read
 * identically.
 *
 * Anatomy (see `docs/anatomy/assistant.md`):
 * ```
 * <ai-assistant>                         h-[560px] rounded border bg-card column
 * ├─ <conversation>                      stick-to-bottom scroll region
 * │  └─ <conversation-content>
 * │     ├─ <message from="user">
 * │     └─ <message from="assistant">
 * │        ├─ <reasoning>
 * │        │  ├─ <reasoning-trigger>
 * │        │  └─ <reasoning-content>
 * │        └─ <message-content>
 * │     └─ <conversation-scroll-button>
 * └─ composer (border-t bg-background)
 *    └─ <prompt-input (submitted)>
 *       ├─ <prompt-input-textarea placeholder="Ask anything...">
 *       └─ <prompt-input-toolbar>          (sibling of the textarea — never nested)
 *          ├─ <prompt-input-tools>
 *          └─ <prompt-input-submit>
 * ```
 *
 * @example
 * ```html
 * <ai-assistant (submitted)="onSubmit($event)" />
 * <ai-assistant [state]="'streaming'" [isStreaming]="true" />
 * ```
 */
@Component({
  selector: 'ai-assistant',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Conversation,
    ConversationContent,
    ConversationScrollButton,
    Message,
    MessageContent,
    Reasoning,
    ReasoningTrigger,
    ReasoningContent,
    PromptInput,
    PromptInputTextarea,
    PromptInputToolbar,
    PromptInputTools,
    PromptInputSubmit,
  ],
  host: {
    'data-slot': 'assistant',
    class:
      'flex h-[560px] w-full flex-col overflow-hidden rounded-lg border bg-card',
  },
  template: `
    <conversation>
      <conversation-content class="px-4 py-6">
        <message from="user">
          <message-content>{{ userQuestion }}</message-content>
        </message>
        <message from="assistant">
          <reasoning [isStreaming]="isStreaming()" [duration]="reasoningDuration()">
            <reasoning-trigger />
            <reasoning-content [text]="reasoningText" />
          </reasoning>
          <message-content>
            <div class="whitespace-pre-wrap">{{ assistantAnswer }}</div>
          </message-content>
        </message>
      </conversation-content>
      <conversation-scroll-button />
    </conversation>

    <div class="border-t bg-background p-3">
      <prompt-input
        [state]="state()"
        [disabled]="disabled()"
        (submitted)="submitted.emit($event)"
        (canceled)="canceled.emit()"
      >
        <prompt-input-textarea placeholder="Ask anything..." />
        <prompt-input-toolbar>
          <prompt-input-tools />
          <prompt-input-submit />
        </prompt-input-toolbar>
      </prompt-input>
    </div>
  `,
})
export class Assistant {
  /**
   * PromptInput state machine value. Drives the submit button affordance
   * (`ready` → send, `streaming` → stop, `error` → retry).
   */
  readonly state = input<PromptInputState>('ready');

  /** Disable the composer (textarea + submit). */
  readonly disabled = input<boolean>(false);

  /**
   * Whether the reasoning step is still streaming. While `true` the reasoning
   * panel stays open and shows the shimmered "Thinking…" label; it auto-collapses
   * to "Thought for N seconds" once streaming completes.
   */
  readonly isStreaming = input<boolean>(false);

  /** Canned reasoning duration (seconds) used by the demo trigger label. */
  readonly reasoningDuration = input<number | undefined>(2);

  /** Emits the composed prompt (value + attachments) when the user submits. */
  readonly submitted = output<PromptInputSubmitEvent>();

  /** Emits when the user cancels an in-flight (streaming) response. */
  readonly canceled = output<void>();

  // Canned conversation — kept identical to the React chat-surface block so the
  // two surfaces read the same.
  protected readonly userQuestion = 'What did the team ship this week?';

  protected readonly reasoningText =
    "The user wants a quick weekly status summary. I'll group the work into 3 buckets: shipped, in-flight, and blockers.";

  protected readonly assistantAnswer = `Here is a quick weekly recap:

**Shipped**
- Auth flow with GitHub provider
- Dashboard analytics widget

**In flight**
- Settings form (3 sections)
- Empty state pattern`;
}
