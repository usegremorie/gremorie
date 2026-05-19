import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { PromptInput } from './prompt-input';
import { PromptInputState } from './prompt-input.types';
import { cn } from './utils';

const ICON_MAP: Record<PromptInputState, string> = {
  ready: 'M5 12h14M13 5l7 7-7 7',
  submitted: '', // spinner — rendered via SVG below
  streaming: 'M6 6h12v12H6z',
  error: 'M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
};

const LABEL_MAP: Record<PromptInputState, string> = {
  ready: 'Send message',
  submitted: 'Submitting',
  streaming: 'Stop generating',
  error: 'Retry',
};

@Component({
  selector: 'prompt-input-submit',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="buttonClass()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-busy]="isBusy() ? 'true' : null"
      [attr.data-state]="state()"
      [disabled]="isDisabled()"
      (click)="handleClick()"
    >
      @if (state() === 'submitted') {
        <svg
          class="size-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-dasharray="20 40"
          ></circle>
        </svg>
      } @else {
        <svg
          class="size-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path [attr.d]="iconPath()"></path>
        </svg>
      }
    </button>
  `,
})
export class PromptInputSubmit {
  protected readonly parent = inject(PromptInput);

  readonly disabled = input<boolean>(false);

  protected readonly state = computed<PromptInputState>(() => this.parent.state());

  protected readonly isBusy = computed(
    () => this.state() === 'submitted' || this.state() === 'streaming',
  );

  protected readonly isDisabled = computed(
    () =>
      this.disabled() ||
      this.parent.disabled() ||
      this.state() === 'submitted' ||
      (this.state() === 'ready' && this.parent.value().trim().length === 0),
  );

  protected readonly ariaLabel = computed(() => LABEL_MAP[this.state()]);
  protected readonly iconPath = computed(() => ICON_MAP[this.state()]);

  protected readonly buttonClass = computed(() => {
    const base = cn(
      'inline-flex size-9 shrink-0 items-center justify-center rounded-md',
      'transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
    );

    const stateMap: Record<PromptInputState, string> = {
      ready: 'bg-primary text-primary-foreground hover:bg-primary/90',
      submitted: 'bg-muted text-muted-foreground',
      streaming: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
      error: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    };

    return cn(base, stateMap[this.state()]);
  });

  handleClick(): void {
    this.parent.submit();
  }
}
