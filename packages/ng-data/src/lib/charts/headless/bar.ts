import {
  computed,
  Directive,
  inject,
  input,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import { ChartContext } from './chart-context';
import { bandScale } from './scales';

export interface BarRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Computes grouped bar rects for one series on a `<g>` inside a `[chartFrame]`
 * SVG. Self-registers values for the shared domain and positions its sub-bars
 * by series index so multiple series sit side-by-side within each category band.
 *
 * @example
 * ```html
 * <svg:g [bar]="'sales'" #b="bar">
 *   @for (r of b.bars(); track $index) { <svg:rect ... /> }
 * </svg:g>
 * ```
 */
@Directive({
  selector: 'g[bar]',
  host: { 'data-slot': 'bar' },
  exportAs: 'bar',
})
export class Bar implements OnInit, OnDestroy {
  private readonly ctx = inject(ChartContext);

  readonly dataKey = input.required<string>({ alias: 'bar' });

  readonly bars = computed<BarRect[]>(() => {
    const data = this.ctx.data();
    const xKey = this.ctx.xKey();
    const categories = data.map((d) => String(d[xKey]));
    const band = bandScale(categories, [this.ctx.plotLeft(), this.ctx.plotRight()], 0.2);
    const keys = this.ctx.seriesKeys();
    const count = Math.max(1, keys.length);
    const index = Math.max(0, keys.indexOf(this.dataKey()));
    const subWidth = band.bandwidth / count;
    const baseline = this.ctx.yScale()(0);
    const yScale = this.ctx.yScale();

    return data.map((d) => {
      const value = yScale(Number(d[this.dataKey()]));
      return {
        x: band(String(d[xKey])) + subWidth * index,
        y: value,
        width: Math.max(0, subWidth - 1),
        height: Math.max(0, baseline - value),
      };
    });
  });

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
