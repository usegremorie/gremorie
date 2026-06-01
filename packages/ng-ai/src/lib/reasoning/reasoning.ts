import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  InjectionToken,
  input,
  model,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { BrnCollapsible } from '@spartan-ng/brain/collapsible';
import { cn } from '@gremorie/ng-core';

/**
 * Reasoning — collapsible "thinking..." block. Mirrors React `Reasoning`.
 *
 * Behavior parity:
 * - Auto-opens when streaming starts (if `defaultOpen`).
 * - Auto-closes 1s after streaming ends (once only).
 * - Tracks duration in seconds from streaming start to end.
 * - `[(open)]` two-way binding (model signal) plus uncontrolled
 *   `defaultOpen`.
 *
 * Anti-pattern note (from rx-ai source): React useEffect deps array caused
 * "Maximum update depth exceeded" because useControllableState returned
 * fresh setters every render. Angular signals don't have that problem
 * because effect() tracks signal reads, not the identity of the setter.
 */
export interface ReasoningState {
  isStreaming: () => boolean;
  isOpen: () => boolean;
  duration: () => number | undefined;
}

export const REASONING = new InjectionToken<ReasoningState>('ReasoningState');

const AUTO_CLOSE_DELAY = 1000;
const MS_IN_S = 1000;

@Component({
  selector: 'reasoning',
  standalone: true,
  imports: [BrnCollapsible],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div brnCollapsible [(expanded)]="open">
      <ng-content />
    </div>
  `,
  host: {
    '[class]': 'hostClass()',
  },
  providers: [{ provide: REASONING, useExisting: forwardRef(() => Reasoning) }],
})
export class Reasoning implements ReasoningState {
  readonly isStreaming = input<boolean>(false);
  readonly defaultOpen = input<boolean>(true);
  readonly open = model<boolean>(true);
  // Aliased to `duration` on purpose: the public `duration()` method below
  // (required by ReasoningState) merges this binding with the auto-tracked
  // value, so the raw input takes the internal `durationInput` name.
  /* eslint-disable @angular-eslint/no-input-rename */
  readonly durationInput = input<number | undefined>(undefined, {
    alias: 'duration',
  });
  /* eslint-enable @angular-eslint/no-input-rename */

  readonly openChange = output<boolean>();

  private readonly _duration = signal<number | undefined>(undefined);
  private readonly _hasAutoClosed = signal(false);
  private readonly _startTime = signal<number | null>(null);
  private autoCloseTimer?: ReturnType<typeof setTimeout>;

  readonly duration = () => this.durationInput() ?? this._duration();
  readonly isOpen = () => this.open();

  protected readonly hostClass = computed(() => cn('not-prose mb-4 block'));

  constructor() {
    // Apply defaultOpen on init.
    effect(() => {
      this.open.set(this.defaultOpen());
    });

    // Emit openChange when open flips.
    effect(() => {
      this.openChange.emit(this.open());
    });

    // Track duration from streaming start to end.
    effect(() => {
      const streaming = this.isStreaming();
      if (streaming) {
        if (this._startTime() === null) {
          this._startTime.set(Date.now());
        }
      } else {
        const start = this._startTime();
        if (start !== null) {
          this._duration.set(Math.ceil((Date.now() - start) / MS_IN_S));
          this._startTime.set(null);
        }
      }
    });

    // Auto-close when streaming ends (once only).
    effect((onCleanup) => {
      const streaming = this.isStreaming();
      const open = this.open();
      const defaultO = this.defaultOpen();
      const auto = this._hasAutoClosed();
      if (defaultO && !streaming && open && !auto) {
        this.autoCloseTimer = setTimeout(() => {
          this.open.set(false);
          this._hasAutoClosed.set(true);
        }, AUTO_CLOSE_DELAY);
        onCleanup(() => {
          if (this.autoCloseTimer) clearTimeout(this.autoCloseTimer);
        });
      }
    });
  }
}
