import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
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

  /** viewBox dimensions (px) — the styled tooltip card maps these to DOM px. */
  readonly width = computed(() => this.ctx.width());
  readonly height = computed(() => this.ctx.height());

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

/**
 * Boundary-aware placement for the floating tooltip card. Apply it to the
 * absolutely-positioned card `<div>` (a sibling of the `<svg>`, inside the
 * `position: relative` wrapper) and pass the `chartTooltip` instance:
 *
 * ```html
 * <div class="absolute …" [chartTooltipCard]="tip"> … </div>
 * ```
 *
 * It mirrors the React (recharts) behavior: the card follows the pointer but is
 * kept inside the chart — it flips to the left of the cursor near the right edge
 * and is clamped on both axes — so it never overflows the artifact (no stray
 * scrollbar, never hidden behind the border). Angular-native: the headless
 * directive computes the pointer/viewBox; this one measures the rendered card +
 * its offset parent and positions imperatively via an `effect`.
 */
@Directive({
  selector: '[chartTooltipCard]',
})
export class ChartTooltipCard {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  /** The `chartTooltip` instance (pass `[chartTooltipCard]="tip"`). */
  readonly tip = input.required<ChartTooltip>({ alias: 'chartTooltipCard' });

  /** Gap from the cursor and minimum inset from the wrapper edges (DOM px). */
  private readonly GAP = 12;
  private readonly PAD = 8;

  constructor() {
    effect(() => {
      const tip = this.tip();
      const p = tip.pointer();
      if (tip.activeIndex() === null) return;

      const card = this.el.nativeElement;
      const parent = card.offsetParent as HTMLElement | null;
      if (!parent) return;

      const pw = parent.clientWidth || 1;
      const ph = parent.clientHeight || 1;
      // Pointer is in viewBox px; map it into the wrapper's DOM px so the card
      // lines up with the rendered (scaled) chart.
      const domX = (p.x / (tip.width() || 1)) * pw;
      const domY = (p.y / (tip.height() || 1)) * ph;
      const cw = card.offsetWidth;
      const ch = card.offsetHeight;

      // Prefer the right of the cursor; flip left when it would overflow.
      let left = domX + this.GAP;
      if (left + cw > pw - this.PAD) left = domX - this.GAP - cw;
      left = Math.max(this.PAD, Math.min(left, pw - cw - this.PAD));

      // Vertically center on the cursor, clamped inside the wrapper.
      let top = domY - ch / 2;
      top = Math.max(this.PAD, Math.min(top, ph - ch - this.PAD));

      card.style.left = `${left}px`;
      card.style.top = `${top}px`;
      card.style.transform = 'none';
    });
  }
}
