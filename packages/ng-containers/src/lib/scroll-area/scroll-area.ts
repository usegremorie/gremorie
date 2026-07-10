import { afterNextRender, Directive, ElementRef, inject } from '@angular/core';

/**
 * Gremorie NG ScrollArea — a thin design-system styling layer over ngx-scrollbar's
 * `<ng-scrollbar>`. It applies the Gremorie NG scrollbar look (thin, rounded,
 * `--border`-colored thumb) through ngx-scrollbar's own CSS custom properties,
 * so the heavy lifting (cross-browser overlay scrollbar, smooth scrolling) is
 * delegated to ngx-scrollbar while Gremorie NG owns the visual tokens.
 *
 * Override any token per-instance with a plain `style` binding, e.g.
 * `[style.--scrollbar-thickness]="10"`.
 *
 * @example
 * ```html
 * <ng-scrollbar gremorie class="h-72 rounded-md border border-border">
 *   <div class="p-4">…long content…</div>
 * </ng-scrollbar>
 * ```
 */
@Directive({
  selector: 'ng-scrollbar[gremorie], ng-scrollbar[gremorieScrollbar]',
  host: {
    'data-slot': 'scroll-area',
    class: 'block',
    '[style.--scrollbar-border-radius]': '"100px"',
    '[style.--scrollbar-offset]': '3',
    '[style.--scrollbar-thumb-color]': '"var(--border)"',
    '[style.--scrollbar-thumb-hover-color]': '"var(--border)"',
    '[style.--scrollbar-thickness]': '7',
  },
})
export class ScrollArea {
  constructor() {
    // React parity: the RX edition stamps `data-slot="scroll-area-viewport"`
    // on the Radix Viewport — the element that directly wraps the scrollable
    // children inside the root. ngx-scrollbar collapses Radix's root/viewport
    // pair into the host (the host element itself scrolls) and renders a
    // single inner `<ng-scroll-content>` wrapper around the projected
    // children, so that wrapper is the structural equivalent and carries the
    // slot. Stamped after first render because NgScrollbar creates it in its
    // own template.
    const host = inject(ElementRef).nativeElement as HTMLElement;
    afterNextRender(() => {
      host
        .querySelector(':scope > ng-scroll-content')
        ?.setAttribute('data-slot', 'scroll-area-viewport');
    });
  }
}
