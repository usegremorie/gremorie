import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';
import {
  BrnProgress,
  BrnProgressIndicator,
  injectBrnProgress,
} from '@spartan-ng/brain/progress';

/**
 * Progress — determinate progress indicator (0-100). Wraps Spartan-ng
 * `BrnProgress` with the Gremorie visual surface. Mirrors React `Progress`
 * from `@gremorie/rx-feedback`.
 *
 * Pass `value` (0-100) for determinate; pass `[value]="null"` for
 * indeterminate (Spartan brain reports `state="indeterminate"`). `max`
 * and `getValueLabel` are also forwarded from Spartan brain.
 *
 * Use Progress when **percent complete is known** — uploads, multi-step
 * forms, batch jobs. For unknown duration, use `Spinner` or `Skeleton`.
 * Always pair the bar with a numeric value or label; silent bars confuse
 * users about the actual state.
 *
 * @example
 * ```html
 * <gr-progress [value]="60" />
 * <gr-progress [value]="null" />
 * <gr-progress [value]="3" [max]="5" />
 * ```
 */
@Component({
  selector: 'gr-progress',
  standalone: true,
  hostDirectives: [
    {
      directive: BrnProgress,
      inputs: ['value', 'max', 'getValueLabel'],
    },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrnProgressIndicator],
  template: `
    <brn-progress-indicator
      data-slot="progress-indicator"
      class="block h-full w-full flex-1 bg-primary transition-all"
      [style.transform]="indicatorTransform()"
    />
  `,
  host: {
    'data-slot': 'progress',
    '[class]': 'hostClass()',
  },
})
export class Progress {
  /** Extra classes merged over the defaults via `cn`. Mirrors React `className`. */
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'relative block h-2 w-full overflow-hidden rounded-full bg-primary/20',
      this.class(),
    ),
  );

  private readonly brn = injectBrnProgress();

  protected readonly indicatorTransform = computed(() => {
    const v = this.brn.value();
    const max = this.brn.max();
    const pct = v == null ? 0 : Math.max(0, Math.min(100, (v / max) * 100));
    return `translateX(-${100 - pct}%)`;
  });
}
