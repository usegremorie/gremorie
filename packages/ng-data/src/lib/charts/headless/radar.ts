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
  /** SVG text-anchor for the label, by which side of the circle it sits on. */
  anchor: 'start' | 'middle' | 'end';
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
  /** Ring positions as fractions of the radius, innermost first. */
  readonly levels = input<readonly number[]>([0.25, 0.5, 0.75, 1]);

  private readonly layout = computed(() =>
    polarLayout(this.ctx.width(), this.ctx.height(), 28),
  );

  readonly center = computed(() => this.layout());

  /** The domain actually in force — pinned or derived. */
  readonly domain = computed(() => this.ctx.yDomain());

  /**
   * This series' vertex per data row, in spoke order. Exposed so the styled
   * layer can mark the active one without recomputing the geometry.
   */
  readonly points = computed<{ x: number; y: number }[]>(() => {
    const data = this.ctx.data();
    const n = data.length;
    if (n === 0) return [];
    const [, max] = this.ctx.yDomain();
    const { cx, cy, radius } = this.layout();
    return data.map((row, i) => {
      const angle = (i / n) * 2 * Math.PI;
      /*
       * A row missing this series' key, or holding something that is not a
       * number, sits at the centre — recharts' `computeRadarPoints` does the
       * same (`isNullish(value) ? 0 : ...`) and keeps the vertex, so the
       * polygon stays closed and dips on that spoke. Skipping the coercion
       * lets `Number(undefined)` through as NaN, and a single NaN makes the
       * whole `d` an invalid path that the browser refuses to draw.
       */
      const value = Number(row[this.dataKey()]);
      const r = Number.isFinite(value) ? (value / max) * radius : 0;
      return polarPoint(cx, cy, r, angle);
    });
  });

  readonly d = computed(() => polygonPath(this.points()));

  /** Spoke endpoints + category labels (shared across series). */
  readonly axes = computed<RadarAxis[]>(() => {
    const data = this.ctx.data();
    const n = data.length;
    const { cx, cy, radius } = this.layout();
    return data.map((row, i) => {
      const angle = (i / n) * 2 * Math.PI;
      const end = polarPoint(cx, cy, radius, angle);
      const label = polarPoint(cx, cy, radius + 14, angle);
      /*
       * Anchor by side, not always centre: a centred label on a spoke at the
       * left or right reaches half its own width back across the plot. Spokes
       * within a hair of the vertical stay centred, which is where a centred
       * label is actually right.
       */
      const dx = label.x - cx;
      const anchor =
        Math.abs(dx) < radius * 0.05 ? 'middle' : dx > 0 ? 'start' : 'end';
      return {
        x2: end.x,
        y2: end.y,
        label: String(row[this.ctx.xKey()]),
        lx: label.x,
        ly: label.y,
        anchor,
      } as RadarAxis;
    });
  });

  /** Concentric reference rings (shared across series). */
  readonly rings = computed<string[]>(() => {
    const data = this.ctx.data();
    const n = data.length;
    if (n === 0) return [];
    const { cx, cy, radius } = this.layout();
    return this.levels().map((level) =>
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
