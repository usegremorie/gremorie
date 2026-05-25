import {
  computed,
  Directive,
  inject,
  input,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import { ChartContext } from './chart-context';
import { linePath } from './shape';
import type { Datum } from './types';

/** Pure: project data through the scales into a line `d` string. */
export function computeLinePath(
  data: readonly Datum[],
  xKey: string,
  yKey: string,
  xScale: (v: string) => number,
  yScale: (v: number) => number,
): string {
  if (data.length === 0) return '';
  return linePath(
    data.map((d) => ({ x: xScale(String(d[xKey])), y: yScale(Number(d[yKey])) })),
  );
}

/**
 * Renders a stroked line for one series on a `<path>` inside a `[chartFrame]` SVG.
 * Self-registers its values so the frame's shared Y domain includes this series.
 *
 * @example `<svg:path [line]="'sales'" color="var(--chart-1)"></svg:path>`
 */
@Directive({
  selector: 'path[line]',
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

  readonly d = computed(() =>
    computeLinePath(
      this.ctx.data(),
      this.ctx.xKey(),
      this.dataKey(),
      (v) => this.ctx.xScale()(v),
      (v) => this.ctx.yScale()(v),
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
