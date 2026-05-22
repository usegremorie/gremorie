import { Directive } from '@angular/core';

/**
 * ShadNG ScrollArea — a thin design-system styling layer over ngx-scrollbar's
 * `<ng-scrollbar>`. It applies the ShadNG scrollbar look (thin, rounded,
 * `--border`-colored thumb) through ngx-scrollbar's own CSS custom properties,
 * so the heavy lifting (cross-browser overlay scrollbar, smooth scrolling) is
 * delegated to ngx-scrollbar while ShadNG owns the visual tokens.
 *
 * Override any token per-instance with a plain `style` binding, e.g.
 * `[style.--scrollbar-thickness]="10"`.
 *
 * @example
 * ```html
 * <ng-scrollbar shadng class="h-72 rounded-md border border-border">
 *   <div class="p-4">…long content…</div>
 * </ng-scrollbar>
 * ```
 */
@Directive({
  selector: 'ng-scrollbar[shadng], ng-scrollbar[shadngScrollbar]',
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
export class ScrollArea {}
