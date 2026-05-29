import { computed, Directive, inject, input } from '@angular/core';
import { arc as d3Arc } from 'd3-shape';
import { ChartContext } from './chart-context';
import { polarLayout } from './polar';

export interface RadialArc {
  /** Value arc (sweep proportional to the value). */
  d: string;
  /** Full-circle track behind the value arc. */
  track: string;
  index: number;
  name: string;
  value: number;
}

interface ArcInput {
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
}

/**
 * Computes concentric radial bars on a `<g>` inside a `[chartFrame]` SVG — one
 * ring per data row, sweep proportional to its `[radialBar]` value (relative to
 * the largest value). Apply the directive's `transform` to center the `<g>`.
 *
 * @example
 * ```html
 * <svg:g [radialBar]="'visitors'" #r="radialBar" [attr.transform]="r.transform()">
 *   @for (a of r.arcs(); track a.name) { <svg:path [attr.d]="a.d" ... /> }
 * </svg:g>
 * ```
 */
@Directive({
  selector: 'g[radialBar]',
  host: { 'data-slot': 'radial-bar' },
  exportAs: 'radialBar',
})
export class RadialBar {
  private readonly ctx = inject(ChartContext);

  readonly valueKey = input.required<string>({ alias: 'radialBar' });

  private readonly layout = computed(() => polarLayout(this.ctx.width(), this.ctx.height(), 8));

  readonly transform = computed(() => `translate(${this.layout().cx},${this.layout().cy})`);

  readonly arcs = computed<RadialArc[]>(() => {
    const data = this.ctx.data();
    const n = data.length;
    if (n === 0) return [];
    const valueKey = this.valueKey();
    const nameKey = this.ctx.xKey();
    const values = data.map((d) => Number(d[valueKey]));
    const max = Math.max(...values, 1);
    const { radius } = this.layout();
    const band = radius / (n + 0.5);
    const gen = d3Arc<ArcInput>().cornerRadius(band * 0.35);

    return data.map((row, i) => {
      const outer = radius - band * i;
      const inner = outer - band * 0.7;
      const endAngle = (values[i] / max) * 2 * Math.PI;
      const base = { innerRadius: inner, outerRadius: outer, startAngle: 0 };
      return {
        d: gen({ ...base, endAngle }) ?? '',
        track: gen({ ...base, endAngle: 2 * Math.PI }) ?? '',
        index: i,
        name: String(row[nameKey]),
        value: values[i],
      };
    });
  });
}
