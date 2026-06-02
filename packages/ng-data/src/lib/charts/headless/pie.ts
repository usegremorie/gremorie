import { computed, Directive, inject, input } from '@angular/core';
import { arc as d3Arc, pie as d3Pie, type PieArcDatum } from 'd3-shape';
import { ChartContext } from './chart-context';
import { polarLayout } from './polar';

export interface PieSlice {
  d: string;
  index: number;
  name: string;
  value: number;
}

/**
 * Computes pie/donut slices on a `<g>` inside a `[chartFrame]` SVG. The slice
 * value is `[pie]` (a data field); the slice name is the frame's `xKey`. Set
 * `innerRadiusRatio` > 0 for a donut. Apply the directive's `transform` to the
 * `<g>` so the pie is centered.
 *
 * @example
 * ```html
 * <svg:g [pie]="'visitors'" #p="pie" [attr.transform]="p.transform()">
 *   @for (s of p.slices(); track s.name) { <svg:path [attr.d]="s.d" ... /> }
 * </svg:g>
 * ```
 */
@Directive({
  selector: 'g[pie]',
  host: { 'data-slot': 'pie' },
  exportAs: 'pie',
})
export class Pie {
  private readonly ctx = inject(ChartContext);

  readonly valueKey = input.required<string>({ alias: 'pie' });
  /** 0 = full pie; e.g. 0.6 = donut with a hole at 60% of the radius. */
  readonly innerRadiusRatio = input<number>(0);

  private readonly layout = computed(() =>
    polarLayout(this.ctx.width(), this.ctx.height(), 8),
  );

  /** Translate to apply to the host `<g>` so (0,0) is the pie center. */
  readonly transform = computed(
    () => `translate(${this.layout().cx},${this.layout().cy})`,
  );

  readonly slices = computed<PieSlice[]>(() => {
    const data = this.ctx.data();
    const nameKey = this.ctx.xKey();
    const valueKey = this.valueKey();
    const values = data.map((d) => Number(d[valueKey]));
    const arcs = d3Pie<number>().sort(null)(values);
    const radius = this.layout().radius;
    const gen = d3Arc<PieArcDatum<number>>()
      .innerRadius(radius * this.innerRadiusRatio())
      .outerRadius(radius);
    return arcs.map((a, i) => ({
      d: gen(a) ?? '',
      index: i,
      name: String(data[i]?.[nameKey] ?? ''),
      value: values[i],
    }));
  });
}
