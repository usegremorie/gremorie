import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';

import {
  PromptInput,
  PromptInputButton,
  PromptInputState,
  PromptInputSubmit,
  PromptInputSubmitEvent,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@kalvner/shadng-prompt-input';

@Component({
  selector: 'app-prompt-input-demo',
  imports: [
    PromptInput,
    PromptInputTextarea,
    PromptInputToolbar,
    PromptInputTools,
    PromptInputButton,
    PromptInputSubmit,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
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
        [state]="initialState()"
        (submitted)="onSubmit($event)"
        (canceled)="onCancel()"
        (retried)="onRetry()"
      >
        <prompt-input-textarea placeholder="Ask anything…" />
        <prompt-input-toolbar>
          <prompt-input-tools>
            <prompt-input-button
              ariaLabel="Attach file"
              title="Attach file"
              (pressedChange)="onTool('attach')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 17.93 8.8l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </prompt-input-button>

            <prompt-input-button
              ariaLabel="Voice input"
              title="Voice input"
              (pressedChange)="onTool('voice')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="8" y1="22" x2="16" y2="22" />
              </svg>
            </prompt-input-button>
          </prompt-input-tools>

          <prompt-input-submit />
        </prompt-input-toolbar>
      </prompt-input>

      <p class="text-xs text-muted-foreground">
        @if (events().length > 0) {
          Last event:
          <code class="font-mono">{{ events()[events().length - 1] }}</code>
        } @else {
          No events yet.
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
  protected readonly events = signal<string[]>([]);

  protected readonly stateLabel = computed(() => this.initialState());

  protected onSubmit(event: PromptInputSubmitEvent): void {
    this.pushEvent(`submitted: "${event.value}"`);
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

  private pushEvent(message: string): void {
    this.events.update((prev) => [...prev, message]);
  }
}
