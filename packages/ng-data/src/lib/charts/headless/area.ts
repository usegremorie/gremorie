import {
  computed,
  Directive,
  inject,
  input,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import { ChartContext } from './chart-context';
import { areaBandPath, areaPath, type XYPoint } from './shape';
import type { CurveType, Datum } from './types';

/** Pure: project data through the scales into an area `d` string. */
export function computeAreaPath(
  data: readonly Datum[],
  xKey: string,
  yKey: string,
  xScale: (v: string) => number,
  yScale: (v: number) => number,
  baseline: number,
  curve: CurveType = 'linear',
): string {
  if (data.length === 0) return '';
  const points = data.map((d) => ({
    x: xScale(String(d[xKey])),
    y: yScale(Number(d[yKey])),
  }));
  return areaPath(points, baseline, curve);
}

/**
 * Renders a filled area for one series on a `<path>` inside a `[chartFrame]` SVG.
 * Self-registers its values so the frame's shared Y domain includes this series.
 * Honours the frame's `stacked` mode (each area sits on the cumulative sum of the
 * series below it) and exposes `points()` for tooltip markers.
 *
 * @example `<svg:path [area]="'sales'" color="var(--chart-1)" curve="natural"></svg:path>`
 */
@Directive({
  selector: 'path[area]',
  exportAs: 'area',
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
  readonly curve = input<CurveType>('linear');

  readonly d = computed(() => {
    const data = this.ctx.data();
    if (data.length === 0) return '';
    const xKey = this.ctx.xKey();
    const key = this.dataKey();
    const xScale = this.ctx.xScale();
    const yScale = this.ctx.yScale();

    if (this.ctx.stacked()) {
      const base = this.ctx.stackBaseFor(key);
      return areaBandPath(
        data.map((d, i) => {
          const lo = base[i] ?? 0;
          const hi = lo + Number(d[key] ?? 0);
          return {
            x: xScale(String(d[xKey])),
            y0: yScale(lo),
            y1: yScale(hi),
          };
        }),
        this.curve(),
      );
    }

    return computeAreaPath(
      data,
      xKey,
      key,
      (v) => xScale(v),
      (v) => yScale(v),
      yScale(0),
      this.curve(),
    );
  });

  /** Top-edge pixel points (cumulative when stacked) — for tooltip markers. */
  readonly points = computed<XYPoint[]>(() => {
    const data = this.ctx.data();
    const xKey = this.ctx.xKey();
    const key = this.dataKey();
    const xScale = this.ctx.xScale();
    const yScale = this.ctx.yScale();
    const base = this.ctx.stacked()
      ? this.ctx.stackBaseFor(key)
      : data.map(() => 0);
    return data.map((d, i) => ({
      x: xScale(String(d[xKey])),
      y: yScale((base[i] ?? 0) + Number(d[key] ?? 0)),
    }));
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
