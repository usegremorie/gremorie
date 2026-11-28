import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';

/**
 * AspectRatio — reserves vertical space for media before content loads.
 * Mirrors React `AspectRatio` from `@gremorie/rx-containers` (which wraps
 * Radix AspectRatio).
 *
 * One-input primitive (`ratio`). Wrap every responsive image, iframe,
 * video embed, or skeleton placeholder so the layout does not jump when
 * the asset settles — it prevents cumulative layout shift (CLS).
 *
 * Implementation note: where Radix uses the legacy `padding-bottom`
 * percentage wrapper, the Angular port uses the native CSS `aspect-ratio`
 * property on a single host element. This keeps the anatomy a single box
 * — so `class` on `<gr-aspect-ratio>` lands on exactly the box Radix
 * forwards `className` to — and lets the projected child fill it with
 * `h-full w-full object-cover` just like the React reference. No
 * `@spartan-ng/brain` primitive exists for aspect ratio.
 *
 * @example
 * ```html
 * <gr-aspect-ratio [ratio]="16 / 9" class="overflow-hidden rounded-lg">
 *   <img src="…" alt="…" class="h-full w-full object-cover" />
 * </gr-aspect-ratio>
 * ```
 */
@Component({
  selector: 'gr-aspect-ratio',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'aspect-ratio',
    '[class]': 'hostClass()',
    '[style.aspect-ratio]': 'ratio()',
  },
})
export class AspectRatio {
  /** Extra classes merged over the defaults via `cn`. Mirrors React `className`. */
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('block w-full', this.class()),
  );

  /** Width / height ratio (e.g. `16 / 9`, `4 / 3`). Defaults to `1`. */
  readonly ratio = input<number>(1);
}
