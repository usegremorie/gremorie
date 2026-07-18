import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { cn } from '@gremorie/ng-core';

/**
 * ScrollArea — themeable scroll container. Mirrors React `ScrollArea` from
 * `@gremorie/rx-containers`.
 *
 * A relative box wrapping a scrollable viewport. The visible bar comes from the
 * DS scrollbar baseline in `@gremorie/tokens` (thin, `--border` thumb), so this
 * is a thin structural wrapper — no third-party scrollbar lib. Constrain it with
 * a fixed height/width via the host `class` so its content can overflow.
 *
 * @example
 * ```html
 * <gr-scroll-area class="h-72 w-56 rounded-md border">
 *   <div class="p-4">…long content…</div>
 * </gr-scroll-area>
 * ```
 */
@Component({
  selector: 'gr-scroll-area',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div
    data-slot="scroll-area-viewport"
    class="size-full overflow-auto rounded-[inherit] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
  >
    <ng-content />
  </div>`,
  host: {
    'data-slot': 'scroll-area',
    '[class]': 'hostClass()',
  },
})
export class ScrollArea {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('relative block', this.class()),
  );
}
