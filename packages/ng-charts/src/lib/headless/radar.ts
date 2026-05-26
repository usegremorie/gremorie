import {
  computed,
  Directive,
  inject,
  input,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import { ChartContext } from './chart-context';
import { polarLayout, polarPoint, polygonPath } from './polar';

export interface RadarAxis {
  x2: number;
  y2: number;
  label: string;
  lx: number;
  ly: number;
}

/**
 * Computes a closed radar polygon for one series on a `<g>` inside a
 * `[chartFrame]` SVG. Categories radiate as spokes (one per data row, by the
 * frame's `xKey`); the value maps to distance along each spoke. Self-registers
 * values so all series share the same radial max. Exposes `axes()`/`rings()`
 * (the same for every series) — render them once (e.g. for the first series).
 *
 * @example `<svg:g [radar]="'desktop'" #r="radar"><svg:path [attr.d]="r.d()"/></svg:g>`
 */
@Directive({
  selector: 'g[radar]',
  host: { 'data-slot': 'radar' },
  exportAs: 'radar',
})
export class Radar implements OnInit, OnDestroy {
  private readonly ctx = inject(ChartContext);

  readonly dataKey = input.required<string>({ alias: 'radar' });
  readonly color = input<string>('currentColor');

  private readonly layout = computed(() =>
    polarLayout(this.ctx.width(), this.ctx.height(), 28),
  );

  readonly center = computed(() => this.layout());

  readonly d = computed(() => {
    const data = this.ctx.data();
    const n = data.length;
    if (n === 0) return '';
    const [, max] = this.ctx.yDomain();
    const { cx, cy, radius } = this.layout();
    const points = data.map((row, i) => {
      const angle = (i / n) * 2 * Math.PI;
      const r = (Number(row[this.dataKey()]) / max) * radius;
      return polarPoint(cx, cy, r, angle);
    });
    return polygonPath(points);
  });

  /** Spoke endpoints + category labels (shared across series). */
  readonly axes = computed<RadarAxis[]>(() => {
    const data = this.ctx.data();
    const n = data.length;
    const { cx, cy, radius } = this.layout();
    return data.map((row, i) => {
      const angle = (i / n) * 2 * Math.PI;
      const end = polarPoint(cx, cy, radius, angle);
      const label = polarPoint(cx, cy, radius + 14, angle);
      return {
        x2: end.x,
        y2: end.y,
        label: String(row[this.ctx.xKey()]),
        lx: label.x,
        ly: label.y,
      };
    });
  });

  /** Concentric reference rings (shared across series). */
  readonly rings = computed<string[]>(() => {
    const data = this.ctx.data();
    const n = data.length;
    if (n === 0) return [];
    const { cx, cy, radius } = this.layout();
    return [0.25, 0.5, 0.75, 1].map((level) =>
      polygonPath(
        data.map((_, i) =>
          polarPoint(cx, cy, radius * level, (i / n) * 2 * Math.PI),
        ),
      ),
    );
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
