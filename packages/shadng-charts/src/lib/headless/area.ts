import { computed, Directive, inject, input, type OnDestroy, type OnInit } from '@angular/core';
import { ChartContext } from './chart-context';
import { areaPath } from './shape';
import type { Datum } from './types';

/** Pure: project data through the scales into an area `d` string. */
export function computeAreaPath(
  data: readonly Datum[],
  xKey: string,
  yKey: string,
  xScale: (v: string) => number,
  yScale: (v: number) => number,
  baseline: number,
): string {
  if (data.length === 0) return '';
  const points = data.map((d) => ({
    x: xScale(String(d[xKey])),
    y: yScale(Number(d[yKey])),
  }));
  return areaPath(points, baseline);
}

/**
 * Renders a filled area for one series on a `<path>` inside a `[chartFrame]` SVG.
 * Self-registers its values so the frame's shared Y domain includes this series.
 *
 * @example `<svg:path [area]="'sales'" color="var(--chart-1)"></svg:path>`
 */
@Directive({
  selector: 'path[area]',
  host: {
    'data-slot': 'area',
    '[attr.d]': 'd()',
    '[attr.fill]': 'color()',
    '[attr.fill-opacity]': 'fillOpacity()',
  },
})
export class Area implements OnInit, OnDestroy {
  private readonly ctx = inject(ChartContext);

  /** Data field this area represents (the directive's input value). */
  readonly dataKey = input.required<string>({ alias: 'area' });
  readonly color = input<string>('currentColor');
  readonly fillOpacity = input<number>(0.25);

  readonly d = computed(() =>
    computeAreaPath(
      this.ctx.data(),
      this.ctx.xKey(),
      this.dataKey(),
      (v) => this.ctx.xScale()(v),
      (v) => this.ctx.yScale()(v),
      // Baseline = pixel position of value 0 (bottom of the plot band).
      this.ctx.yScale()(0),
    ),
  );

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
