import {
  computed,
  Directive,
  inject,
  input,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import { ChartContext } from './chart-context';
import { linearScale } from './scales';

export interface ScatterPoint {
  cx: number;
  cy: number;
}

export interface ScatterXTick {
  x: number;
  label: string;
}

/**
 * Computes scatter points for one Y series against a numeric X field on a `<g>`
 * inside a `[chartFrame]` SVG. X uses a linear scale over the data's X extent;
 * Y uses the shared scale. Self-registers Y values for the shared domain.
 *
 * @example
 * ```html
 * <svg:g [scatter]="'score'" #s="scatter">
 *   @for (p of s.points(); track $index) { <svg:circle ... /> }
 * </svg:g>
 * ```
 */
@Directive({
  selector: 'g[scatter]',
  host: { 'data-slot': 'scatter' },
  exportAs: 'scatter',
})
export class Scatter implements OnInit, OnDestroy {
  private readonly ctx = inject(ChartContext);

  readonly dataKey = input.required<string>({ alias: 'scatter' });

  /** Linear X scale over the data's X extent, mapped into the plot width. */
  private readonly xScale = computed(() => {
    const xs = this.ctx.data().map((d) => Number(d[this.ctx.xKey()]));
    const lo = xs.length ? Math.min(...xs) : 0;
    const hi = xs.length ? Math.max(...xs) : 1;
    return linearScale(lo === hi ? [lo, lo + 1] : [lo, hi], [
      this.ctx.plotLeft(),
      this.ctx.plotRight(),
    ]);
  });

  readonly points = computed<ScatterPoint[]>(() => {
    const xKey = this.ctx.xKey();
    const xScale = this.xScale();
    const yScale = this.ctx.yScale();
    return this.ctx.data().map((d) => ({
      cx: xScale(Number(d[xKey])),
      cy: yScale(Number(d[this.dataKey()])),
    }));
  });

  /** Min / mid / max numeric labels for the X axis. */
  readonly xTicks = computed<ScatterXTick[]>(() => {
    const xs = this.ctx.data().map((d) => Number(d[this.ctx.xKey()]));
    if (xs.length === 0) return [];
    const lo = Math.min(...xs);
    const hi = Math.max(...xs);
    const xScale = this.xScale();
    const values = lo === hi ? [lo] : [lo, (lo + hi) / 2, hi];
    return values.map((v) => ({ x: xScale(v), label: String(Math.round(v)) }));
  });

  /** Y baseline for X tick labels, inside the bottom gutter. */
  readonly labelY = computed(() => this.ctx.plotBottom() + 16);

  ngOnInit(): void {
    const key = this.dataKey();
    this.ctx.register({
      key,
      values: () => this.ctx.data().map((row) => Number(row[key])),
    });
  }

  ngOnDestroy(): void {
    this.ctx.unregister(this.dataKey());
  }
}
