import {
  computed,
  Directive,
  inject,
  input,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import { ChartContext } from './chart-context';
import { linePath, type XYPoint } from './shape';
import type { CurveType, Datum } from './types';

/** Pure: project data through the scales into a line `d` string. */
export function computeLinePath(
  data: readonly Datum[],
  xKey: string,
  yKey: string,
  xScale: (v: string) => number,
  yScale: (v: number) => number,
  curve: CurveType = 'linear',
): string {
  if (data.length === 0) return '';
  return linePath(
    data.map((d) => ({
      x: xScale(String(d[xKey])),
      y: yScale(Number(d[yKey])),
    })),
    curve,
  );
}

/**
 * Renders a stroked line for one series on a `<path>` inside a `[chartFrame]` SVG.
 * Self-registers its values so the frame's shared Y domain includes this series.
 * Exposes `points()` so the styled layer can draw dot markers.
 *
 * @example `<svg:path [line]="'sales'" color="var(--chart-1)" curve="natural"></svg:path>`
 */
@Directive({
  selector: 'path[line]',
  exportAs: 'line',
  host: {
    'data-slot': 'line',
    fill: 'none',
    '[attr.d]': 'd()',
    '[attr.stroke]': 'color()',
  },
})
export class Line implements OnInit, OnDestroy {
  private readonly ctx = inject(ChartContext);

  readonly dataKey = input.required<string>({ alias: 'line' });
  readonly color = input<string>('currentColor');
  readonly curve = input<CurveType>('linear');

  readonly d = computed(() =>
    computeLinePath(
      this.ctx.data(),
      this.ctx.xKey(),
      this.dataKey(),
      (v) => this.ctx.xScale()(v),
      (v) => this.ctx.yScale()(v),
      this.curve(),
    ),
  );

  /** Pixel position of each datum — for dot markers / tooltip snapping. */
  readonly points = computed<XYPoint[]>(() => {
    const xKey = this.ctx.xKey();
    const key = this.dataKey();
    const xScale = this.ctx.xScale();
    const yScale = this.ctx.yScale();
    return this.ctx
      .data()
      .map((d) => ({ x: xScale(String(d[xKey])), y: yScale(Number(d[key])) }));
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
