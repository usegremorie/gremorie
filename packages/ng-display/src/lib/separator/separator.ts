import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import {
  BrnSeparator,
  type SeparatorOrientation,
} from '@spartan-ng/brain/separator';
import { cn } from '@gremorie/ng-core';

export type { SeparatorOrientation };

/**
 * Separator — visual divider between groups of content. Mirrors React
 * `Separator` from `@gremorie/rx-display`, which wraps `@radix-ui/react-separator`.
 *
 * The behavior (the `decorative` flag deciding whether the separator is
 * exposed to AT as `role="separator"` with `aria-orientation`, or hidden as
 * presentational `role="none"`) is delegated to the spartan brain
 * `BrnSeparator` host directive — the Angular equivalent of Radix Separator.
 *
 * Visual is token-driven (`bg-border`) so the separator picks up the active
 * theme automatically. The default `decorative=true` is correct in the vast
 * majority of cases; set `decorative=false` only when the separator carries
 * semantic meaning.
 *
 * @example
 * ```html
 * <gr-separator />
 * <gr-separator orientation="vertical" />
 * <gr-separator [decorative]="false" />
 * ```
 */
@Component({
  selector: 'gr-separator',
  standalone: true,
  hostDirectives: [
    {
      directive: BrnSeparator,
      inputs: ['orientation', 'decorative'],
    },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    'data-slot': 'separator',
    '[attr.data-orientation]': 'orientation()',
    '[class]': 'computedClass()',
  },
})
export class Separator {
  readonly orientation = input<SeparatorOrientation>('horizontal');
  readonly decorative = input<boolean>(true);

  protected readonly computedClass = computed(() =>
    cn(
      'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
    ),
  );
}
