import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';

import { Button } from '@gremorie/ng-core';
import {
  AttachmentInfo,
  AttachmentItem,
  AttachmentList,
  AttachmentPreview,
  AttachmentRemove,
  type AttachmentData,
  PromptInput,
  PromptInputActionMenu,
  PromptInputAttachmentError,
  PromptInputModelOption,
  PromptInputModelSelect,
  PromptInputState,
  PromptInputSubmit,
  PromptInputSubmitEvent,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@gremorie/ng-ai';

const MODELS: readonly PromptInputModelOption[] = [
  {
    id: 'claude-opus-4-7',
    label: 'Claude Opus 4.7',
    description: 'Highest quality, slower',
    badge: 'flagship',
  },
  {
    id: 'claude-sonnet-4-6',
    label: 'Claude Sonnet 4.6',
    description: 'Balanced',
  },
  {
    id: 'claude-haiku-4-5',
    label: 'Claude Haiku 4.5',
    description: 'Fastest, cheapest',
  },
  {
    id: 'gpt-5',
    label: 'GPT-5',
    description: 'Coming soon',
    disabled: true,
  },
];

const ACCEPT = ['image/*', 'application/pdf', 'text/*'] as const;

@Component({
  selector: 'app-prompt-input-demo',
  imports: [
    PromptInput,
    PromptInputTextarea,
    PromptInputToolbar,
    PromptInputTools,
    Button,
    PromptInputActionMenu,
    PromptInputModelSelect,
    AttachmentList,
    AttachmentItem,
    AttachmentPreview,
    AttachmentInfo,
    AttachmentRemove,
    PromptInputSubmit,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="flex flex-col gap-3 rounded-lg border border-border bg-card p-5"
    >
      <header class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-foreground">{{ label() }}</h2>
          <p class="text-sm text-muted-foreground">{{ description() }}</p>
        </div>
        <span
          class="rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground"
        >
          state = "{{ stateLabel() }}"
        </span>
      </header>

      <prompt-input
        [(value)]="value"
        [(attachments)]="attachments"
        [state]="initialState()"
        [acceptAttachments]="accept"
        [maxAttachments]="5"
        (submitted)="onSubmit($event)"
        (canceled)="onCancel()"
        (retried)="onRetry()"
        (attachmentError)="onAttachmentError($event)"
      >
        @if (attachments().length > 0) {
          <attachment-list variant="inline">
            @for (item of attachments(); track item.id) {
              <attachment-item
                [data]="item"
                (removed)="onAttachmentRemoved($event)"
              >
                <attachment-preview />
                <attachment-info [showSize]="false" />
                <attachment-remove />
              </attachment-item>
            }
          </attachment-list>
        }

        <prompt-input-textarea
          placeholder="Ask anything — or drop a file here…"
        />

        <prompt-input-toolbar>
          <prompt-input-tools>
            <prompt-input-action-menu ariaLabel="More actions">
              <button
                type="button"
                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                (click)="onMenuPick('photo')"
              >
                Take a photo
              </button>
              <button
                type="button"
                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                (click)="onMenuPick('voice')"
              >
                Record voice
              </button>
              <button
                type="button"
                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                (click)="onMenuPick('connect')"
              >
                Connect tool…
              </button>
            </prompt-input-action-menu>

            <ai-button
              variant="ghost"
              size="icon"
              ariaLabel="Attach file"
              title="Attach file"
              (pressedChange)="onTool('attach')"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path
                  d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 17.93 8.8l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
                />
              </svg>
            </ai-button>

            <prompt-input-model-select
              [options]="models"
              [(value)]="selectedModel"
            />
          </prompt-input-tools>

          <prompt-input-submit />
        </prompt-input-toolbar>
      </prompt-input>

      <p class="text-xs text-muted-foreground">
        @if (events().length > 0) {
          Last event:
          <code class="font-mono">{{ events()[events().length - 1] }}</code>
        } @else {
          No events yet — try drag-and-drop, paste an image, or open the menu.
        }
      </p>
    </section>
  `,
})
export class PromptInputDemo {
  readonly label = input.required<string>();
  readonly description = input<string>('');
  readonly initialState = input<PromptInputState>('ready');

  protected readonly value = signal('');
  protected readonly attachments = signal<readonly AttachmentData[]>([]);
  protected readonly selectedModel = signal<string | null>('claude-sonnet-4-6');
  protected readonly events = signal<string[]>([]);
  protected readonly models = MODELS;
  protected readonly accept = ACCEPT;

  protected readonly stateLabel = computed(() => this.initialState());

  protected onSubmit(event: PromptInputSubmitEvent): void {
    const attachmentSummary = event.attachments.length
      ? ` + ${event.attachments.length} file(s)`
      : '';
    this.pushEvent(
      `submitted: "${event.value}"${attachmentSummary} (model: ${this.selectedModel()})`,
    );
  }

  protected onCancel(): void {
    this.pushEvent('canceled');
  }

  protected onRetry(): void {
    this.pushEvent('retried');
  }

  protected onTool(name: string): void {
    this.pushEvent(`tool clicked: ${name}`);
  }

  protected onMenuPick(name: string): void {
    this.pushEvent(`menu item: ${name}`);
  }

  protected onAttachmentError(error: PromptInputAttachmentError): void {
    this.pushEvent(`attachment error (${error.reason}): ${error.message}`);
  }

  protected onAttachmentRemoved(item: AttachmentData): void {
    this.attachments.update((prev) => prev.filter((it) => it.id !== item.id));
    this.pushEvent(`attachment removed: ${item.filename}`);
  }

  private pushEvent(message: string): void {
    this.events.update((prev) => [...prev, message]);
  }
}
