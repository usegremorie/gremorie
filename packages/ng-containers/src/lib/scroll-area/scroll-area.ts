import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { cn } from '@gremorie/ng-core';

/**
 * ScrollArea — themeable overlay scroll container. Mirrors React `ScrollArea`
 * from `@gremorie/rx-containers` (Radix ScrollArea).
 *
 * Renders an overlay scrollbar (the bar floats over the content and does not
 * take layout space, exactly like the React edition) by delegating the heavy
 * lifting — cross-browser overlay scrollbar, smooth scrolling — to
 * `ngx-scrollbar`, the idiomatic Angular equivalent (also what spartan-ng uses).
 * Gremorie owns only the visual tokens (thin, rounded, `--border`-colored thumb)
 * through ngx-scrollbar's own CSS custom properties.
 *
 * Constrain it with a fixed height/width via the host `class` so its content can
 * overflow. Anatomy parity with React: host `data-slot="scroll-area"`, and the
 * inner scrollable wrapper carries `data-slot="scroll-area-viewport"`.
 *
 * @example
 * ```html
 * <gr-scroll-area class="h-64 w-56 rounded-md border">
 *   <div class="p-4">…long content…</div>
 * </gr-scroll-area>
 * ```
 */
@Component({
  selector: 'gr-scroll-area',
  standalone: true,
  imports: [NgScrollbarModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-scrollbar
    class="block h-full w-full rounded-[inherit]"
    [style.--scrollbar-border-radius]="'100px'"
    [style.--scrollbar-offset]="3"
    [style.--scrollbar-thumb-color]="'var(--border)'"
    [style.--scrollbar-thumb-hover-color]="'var(--border)'"
    [style.--scrollbar-thickness]="7"
  >
    <ng-content />
  </ng-scrollbar>`,
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

  constructor() {
    // React parity: the RX edition stamps `data-slot="scroll-area-viewport"` on
    // the Radix Viewport — the element that directly wraps the scrollable
    // children. ngx-scrollbar renders a single inner `<ng-scroll-content>`
    // wrapper around the projected children, so that wrapper is the structural
    // equivalent and carries the slot. Stamped after first render because
    // NgScrollbar creates it in its own template.
    const host = inject(ElementRef).nativeElement as HTMLElement;
    afterNextRender(() => {
      host
        .querySelector('ng-scroll-content')
        ?.setAttribute('data-slot', 'scroll-area-viewport');
    });
  }
}
