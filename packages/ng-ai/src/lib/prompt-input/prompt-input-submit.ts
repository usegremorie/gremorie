import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';
import { cva } from 'class-variance-authority';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/ng-overlays';

import { PromptInput } from './prompt-input';
import { PromptInputState } from './prompt-input.types';

const ICON_MAP: Record<PromptInputState, string> = {
  // lucide corner-down-left (enter), as React
  ready: 'M9 10 4 15l5 5M20 4v7a4 4 0 0 1-4 4H4',
  submitted: '', // spinner — rendered via SVG below
  streaming: 'M6 6h12v12H6z',
  // lucide x, as React
  error: 'M18 6 6 18M6 6l12 12',
};

const LABEL_MAP: Record<PromptInputState, string> = {
  ready: 'Send message',
  submitted: 'Submitting',
  streaming: 'Stop generating',
  error: 'Retry',
};

// Sizes mirror the React PromptInputSubmit `size` (InputGroupButton): `icon-sm`
// (default, 32px square) and `sm` (32px tall, for a labelled button).
const submitVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      state: {
        ready: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        submitted: 'bg-muted text-muted-foreground',
        streaming: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
        error:
          'bg-destructive text-destructive-foreground hover:bg-destructive-hover',
      },
      size: {
        'icon-sm': 'size-8',
        sm: 'h-8 gap-1.5 px-2.5',
      },
    },
    defaultVariants: {
      state: 'ready',
      size: 'icon-sm',
    },
  },
);

@Component({
  selector: 'prompt-input-submit',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  ],
  template: `
    @if (tooltip()) {
      <gr-tooltip-provider>
        <gr-tooltip>
          <gr-tooltip-trigger>
            <ng-container [ngTemplateOutlet]="btn" />
          </gr-tooltip-trigger>
          <gr-tooltip-content>{{ tooltip() }}</gr-tooltip-content>
        </gr-tooltip>
      </gr-tooltip-provider>
    } @else {
      <ng-container [ngTemplateOutlet]="btn" />
    }

    <ng-template #btn>
      <button
        type="button"
        [class]="buttonClass()"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-busy]="isBusy() ? 'true' : null"
        [attr.data-state]="state()"
        [disabled]="isDisabled()"
        (click)="handleClick()"
      >
        <ng-content>
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
            @if (labelled()) {
              <span>{{ label() }}</span>
            }
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
        </ng-content>
      </button>
    </ng-template>
  `,
})
export class PromptInputSubmit {
  protected readonly parent = inject(PromptInput);

  readonly disabled = input<boolean>(false);

  /**
   * Optional hover/focus tooltip. Mirrors React PromptInputSubmit `tooltip`:
   * when set, the button is wrapped in the styled gr-tooltip compound.
   */
  readonly tooltip = input<string | null | undefined>(null);

  /** Button size. Mirrors React PromptInputSubmit `size`. */
  readonly size = input<'icon-sm' | 'sm'>('icon-sm');

  /**
   * Visible label (e.g. "Chat"). When ready, the button reads the label with
   * the enter icon and the label is its accessible name; while submitting,
   * streaming or on error it falls back to the icon-only status button.
   * Mirrors React `label`.
   */
  readonly label = input<string | null>(null);

  protected readonly labelled = computed(
    () => !!this.label() && this.state() === 'ready',
  );

  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly state = computed<PromptInputState>(() =>
    this.parent.state(),
  );

  protected readonly isBusy = computed(
    () => this.state() === 'submitted' || this.state() === 'streaming',
  );

  // Parity with React PromptInputSubmit: the button is NOT auto-disabled by an
  // empty input or the submitted state (the host decides what a click does), so
  // the ready button stays solid (not faded). Only an explicit `disabled` (own
  // or parent) disables it.
  protected readonly isDisabled = computed(
    () => this.disabled() || this.parent.disabled(),
  );

  protected readonly ariaLabel = computed(() =>
    this.labelled() ? (this.label() as string) : LABEL_MAP[this.state()],
  );
  protected readonly iconPath = computed(() => ICON_MAP[this.state()]);

  protected readonly buttonClass = computed(() =>
    cn(
      submitVariants({
        state: this.state(),
        // A labelled button grows to `sm` unless a size was set explicitly.
        size: this.labelled() && this.size() === 'icon-sm' ? 'sm' : this.size(),
      }),
      this.labelled() && 'gap-2 pr-2.5 pl-3',
      this.class(),
    ),
  );

  handleClick(): void {
    this.parent.submit();
  }
}
