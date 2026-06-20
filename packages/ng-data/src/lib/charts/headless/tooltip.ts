import {
  computed,
  Directive,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { ChartContext } from './chart-context';

/** Pixel point in the chart's viewBox (== rendered) coordinate space. */
export interface TooltipPoint {
  x: number;
  y: number;
}

/**
 * Pointer-tracking tooltip controller for the cartesian charts. Compose it on
 * the same `<svg>` as `[chartFrame]`; it snaps to the nearest category as the
 * pointer moves and exposes the active index, the cursor X, and the pointer
 * position so the styled layer can render a floating card, a cursor line, and
 * per-series markers. The headless layer stays visual-free — it only computes.
 *
 * @example
 * ```html
 * <svg chartFrame chartTooltip #tip="chartTooltip" [data]="data()" [xKey]="xKey()">…</svg>
 * @if (tip.activeIndex() !== null) { <div class="…" [style.left.px]="tip.activeX()">…</div> }
 * ```
 */
@Directive({
  selector: 'svg[chartTooltip]',
  exportAs: 'chartTooltip',
  host: {
    '(pointermove)': 'onMove($event)',
    '(pointerleave)': 'onLeave()',
  },
})
export class ChartTooltip {
  private readonly ctx = inject(ChartContext);
  private readonly el = inject<ElementRef<SVGSVGElement>>(ElementRef);

  /** Index of the category under the pointer, or `null` when not hovering. */
  readonly activeIndex = signal<number | null>(null);
  /** Raw pointer position in viewBox px (for positioning the floating card). */
  readonly pointer = signal<TooltipPoint>({ x: 0, y: 0 });

  private readonly categories = computed(() =>
    this.ctx.data().map((d) => String(d[this.ctx.xKey()])),
  );

  /** Cursor X (viewBox px) at the active category center. */
  readonly activeX = computed(() => {
    const i = this.activeIndex();
    const cats = this.categories();
    if (i === null || !cats.length) return 0;
    return this.ctx.xScale()(cats[i] ?? '');
  });

  /** The active data row, or `undefined`. */
  readonly activeRow = computed(() => {
    const i = this.activeIndex();
    return i === null ? undefined : this.ctx.data()[i];
  });

  /** Top / bottom of the plotting band (viewBox px) — for the cursor line. */
  readonly plotTop = computed(() => this.ctx.plotTop());
  readonly plotBottom = computed(() => this.ctx.plotBottom());

  /** Y (viewBox px) for `key`'s value at the active index — for series markers. */
  valueY(key: string): number {
    const row = this.activeRow();
    if (!row) return 0;
    return this.ctx.yScale()(Number(row[key] ?? 0));
  }

  onMove(event: PointerEvent): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const scaleX = this.ctx.width() / rect.width || 1;
    const scaleY = this.ctx.height() / rect.height || 1;
    const lx = (event.clientX - rect.left) * scaleX;
    const ly = (event.clientY - rect.top) * scaleY;
    const cats = this.categories();
    if (!cats.length) return;
    const xScale = this.ctx.xScale();
    let nearest = 0;
    let best = Infinity;
    for (let i = 0; i < cats.length; i++) {
      const dx = Math.abs(xScale(cats[i]) - lx);
      if (dx < best) {
        best = dx;
        nearest = i;
      }
    }
    this.activeIndex.set(nearest);
    this.pointer.set({ x: lx, y: ly });
  }

  onLeave(): void {
    this.activeIndex.set(null);
  }
}
