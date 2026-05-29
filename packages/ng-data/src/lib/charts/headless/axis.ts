import { computed, Directive, inject } from '@angular/core';
import { ChartContext } from './chart-context';
import { formatValue } from './format';

/** Pure: `count` evenly spaced tick values from 0..max inclusive. */
export function computeTicks(max: number, count: number): number[] {
  if (max <= 0 || count <= 0) return [0];
  const step = max / count;
  return Array.from({ length: count + 1 }, (_, i) => Math.round(i * step * 1e6) / 1e6);
}

interface YTick {
  value: number;
  y: number;
  label: string;
}

interface XTick {
  label: string;
  x: number;
}

/** Y axis: tick values + pixel Y + formatted label, read from the context. */
@Directive({
  selector: 'g[yAxis]',
  host: { 'data-slot': 'y-axis' },
  exportAs: 'yAxis',
})
export class YAxis {
  private readonly ctx = inject(ChartContext);
  readonly count = 4;
  readonly format = '';

  /** X position for right-aligned tick labels, inside the left gutter. */
  readonly labelX = computed(() => Math.max(0, this.ctx.plotLeft() - 6));

  readonly ticks = computed<YTick[]>(() => {
    const [, max] = this.ctx.yDomain();
    const y = this.ctx.yScale();
    return computeTicks(max, this.count).map((value) => ({
      value,
      y: y(value),
      label: formatValue(value, this.format || 'number'),
    }));
  });
}

/** X axis: category labels + pixel X, read from the context. */
@Directive({
  selector: 'g[xAxis]',
  host: { 'data-slot': 'x-axis' },
  exportAs: 'xAxis',
})
export class XAxis {
  private readonly ctx = inject(ChartContext);

  /** Y baseline for tick labels, inside the bottom gutter. */
  readonly labelY = computed(() => this.ctx.plotBottom() + 16);

  readonly ticks = computed<XTick[]>(() => {
    const x = this.ctx.xScale();
    return this.ctx
      .data()
      .map((d) => String(d[this.ctx.xKey()]))
      .map((label) => ({ label, x: x(label) }));
  });
}
