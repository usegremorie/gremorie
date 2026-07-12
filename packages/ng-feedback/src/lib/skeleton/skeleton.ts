import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Skeleton — placeholder block for loading states. Mirrors React
 * `Skeleton` from `@gremorie/rx-feedback`.
 *
 * A pulsing rectangle that stands in for content that is still being
 * fetched. Shape it with utility classes (width / height / radius) to
 * match the geometry of the real content — that is the whole point:
 * skeletons reserve layout so there is no shift when the data arrives.
 *
 * The default animation is `animate-pulse`. Users with
 * `prefers-reduced-motion` see the static state — no extra config
 * needed. Use Skeleton as a presentation primitive only; pair with
 * `aria-busy="true"` and `aria-live="polite"` on the surrounding region
 * so screen readers announce the loading state.
 *
 * @example
 * ```html
 * <gr-skeleton class="h-4 w-32" />
 * <gr-skeleton class="size-12 rounded-full" />
 * ```
 */
@Component({
  selector: 'gr-skeleton',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    'data-slot': 'skeleton',
    class: 'block animate-pulse rounded-md bg-accent',
  },
})
export class Skeleton {}
