import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';

import {
  PromptInput,
  PromptInputState,
  PromptInputSubmit,
  PromptInputSubmitEvent,
  PromptInputTextarea,
} from '@kalvner/shadng-prompt-input';

@Component({
  selector: 'app-prompt-input-demo',
  imports: [PromptInput, PromptInputTextarea, PromptInputSubmit],
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
        <div class="flex items-center justify-end">
          <prompt-input-submit />
        </div>
      </prompt-input>

      <p class="text-xs text-muted-foreground">
        @if (events().length > 0) {
          Last event: <code class="font-mono">{{ events()[events().length - 1] }}</code>
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
    this.pushEvent(`submit: "${event.value}"`);
  }

  protected onCancel(): void {
    this.pushEvent('cancel');
  }

  protected onRetry(): void {
    this.pushEvent('retry');
  }

  private pushEvent(message: string): void {
    this.events.update((prev) => [...prev, message]);
  }
}
