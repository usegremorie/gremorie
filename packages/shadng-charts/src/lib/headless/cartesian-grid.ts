import { computed, Directive, inject } from '@angular/core';
import { ChartContext } from './chart-context';
import { computeTicks } from './axis';

interface GridLine {
  y: number;
}

/**
 * Horizontal gridlines aligned to the Y ticks. Apply to a `<g>` inside a
 * `[chartFrame]` SVG. Exposes `lines()`; the styled layer draws them so the
 * headless layer stays visual-free.
 */
@Directive({
  selector: 'g[cartesianGrid]',
  host: { 'data-slot': 'cartesian-grid' },
  exportAs: 'cartesianGrid',
})
export class CartesianGrid {
  private readonly ctx = inject(ChartContext);

  readonly lines = computed<GridLine[]>(() => {
    const [, max] = this.ctx.yDomain();
    const y = this.ctx.yScale();
    return computeTicks(max, 4).map((value) => ({ y: y(value) }));
  });
}
