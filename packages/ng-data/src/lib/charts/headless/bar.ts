import {
  computed,
  Directive,
  inject,
  input,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import { computeTicks } from './axis';
import { ChartContext } from './chart-context';
import { formatValue } from './format';
import { bandScale, linearScale } from './scales';
import { roundedRectPath, type CornerRadii } from './shape';

/** A category tick: label plus its anchor pixel position. */
export interface BarCategoryTick {
  label: string;
  x: number;
  y: number;
}

/** A numeric value tick: value, label, and anchor pixel position. */
export interface BarValueTick {
  value: number;
  label: string;
  x: number;
  y: number;
}

/** A grid line in pixel coordinates. */
export interface BarGridLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface BarRect {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Rounded-corner path `d` (honours `radius` + stack position + orientation). */
  d: string;
  /** Per-row color override (the datum's `fill`), if any. */
  fill?: string;
  /** The category label and numeric value (for labels / tooltip). */
  name: string;
  value: number;
}

/**
 * Computes bar rects for one series on a `<g>` inside a `[chartFrame]` SVG.
 * Supports grouped (side-by-side) and stacked layouts, vertical and horizontal
 * orientation, rounded corners (`radius`), and per-row `fill`. Self-registers
 * values for the shared domain.
 *
 * @example
 * ```html
 * <svg:g [bar]="'sales'" [radius]="8" #b="bar">
 *   @for (r of b.bars(); track $index) { <svg:path [attr.d]="r.d" /> }
 * </svg:g>
 * ```
 */
@Directive({
  selector: 'g[bar]',
  host: { 'data-slot': 'bar' },
  exportAs: 'bar',
})
export class Bar implements OnInit, OnDestroy {
  private readonly ctx = inject(ChartContext);

  readonly dataKey = input.required<string>({ alias: 'bar' });
  /** Corner radius (px). Rounds the top (vertical) / right (horizontal) corners. */
  readonly radius = input<number>(0);
  /** Render horizontal bars (categories on Y, values on X). */
  readonly horizontal = input<boolean>(false);

  readonly bars = computed<BarRect[]>(() => {
    const data = this.ctx.data();
    const xKey = this.ctx.xKey();
    const key = this.dataKey();
    const categories = data.map((d) => String(d[xKey]));
    const keys = this.ctx.seriesKeys();
    const count = Math.max(1, keys.length);
    const index = Math.max(0, keys.indexOf(key));
    const stacked = this.ctx.stacked() && count > 1;
    const r = this.radius();
    const base = stacked ? this.ctx.stackBaseFor(key) : undefined;
    const [, max] = this.ctx.yDomain();

    if (this.horizontal()) {
      const band = bandScale(
        categories,
        [this.ctx.plotTop(), this.ctx.plotBottom()],
        0.2,
      );
      const vScale = linearScale(
        [0, max],
        [this.ctx.plotLeft(), this.ctx.plotRight()],
      );
      const zero = vScale(0);
      const subH = band.bandwidth / count;
      return data.map((d, i) => {
        const value = Number(d[key] ?? 0);
        let x: number, y: number, width: number, height: number;
        if (stacked) {
          const lo = base?.[i] ?? 0;
          y = band(categories[i]);
          height = band.bandwidth;
          x = vScale(lo);
          width = Math.max(0, vScale(lo + value) - x);
        } else {
          y = band(categories[i]) + subH * index;
          height = Math.max(0, subH - 1);
          x = zero;
          width = Math.max(0, vScale(value) - zero);
        }
        const radii = cornerRadii(r, true, stacked, index, count);
        return {
          x,
          y,
          width,
          height,
          d: roundedRectPath(x, y, width, height, radii),
          fill: d.fill,
          name: categories[i],
          value,
        };
      });
    }

    const band = bandScale(
      categories,
      [this.ctx.plotLeft(), this.ctx.plotRight()],
      0.2,
    );
    const yScale = this.ctx.yScale();
    const baseline = yScale(0);
    const subW = band.bandwidth / count;
    return data.map((d, i) => {
      const value = Number(d[key] ?? 0);
      let x: number, y: number, width: number, height: number;
      if (stacked) {
        const lo = base?.[i] ?? 0;
        x = band(categories[i]);
        width = band.bandwidth;
        y = yScale(lo + value);
        height = Math.max(0, yScale(lo) - y);
      } else {
        x = band(categories[i]) + subW * index;
        width = Math.max(0, subW - 1);
        y = yScale(value);
        height = Math.max(0, baseline - y);
      }
      const radii = cornerRadii(r, false, stacked, index, count);
      return {
        x,
        y,
        width,
        height,
        d: roundedRectPath(x, y, width, height, radii),
        fill: d.fill,
        name: categories[i],
        value,
      };
    });
  });

  /** Category-axis ticks (X labels when vertical, Y labels when horizontal). */
  readonly categoryTicks = computed<BarCategoryTick[]>(() => {
    const data = this.ctx.data();
    const xKey = this.ctx.xKey();
    const categories = data.map((d) => String(d[xKey]));
    if (this.horizontal()) {
      const band = bandScale(
        categories,
        [this.ctx.plotTop(), this.ctx.plotBottom()],
        0.2,
      );
      const x = Math.max(0, this.ctx.plotLeft() - 8);
      return categories.map((label) => ({
        label,
        x,
        y: band(label) + band.bandwidth / 2,
      }));
    }
    const band = bandScale(
      categories,
      [this.ctx.plotLeft(), this.ctx.plotRight()],
      0.2,
    );
    const y = this.ctx.plotBottom() + 16;
    return categories.map((label) => ({
      label,
      x: band(label) + band.bandwidth / 2,
      y,
    }));
  });

  /** Numeric value-axis ticks (Y when vertical, X when horizontal). */
  readonly valueTicks = computed<BarValueTick[]>(() => {
    const [, max] = this.ctx.yDomain();
    const ticks = computeTicks(max, 4);
    if (this.horizontal()) {
      const vScale = linearScale(
        [0, max],
        [this.ctx.plotLeft(), this.ctx.plotRight()],
      );
      const y = this.ctx.plotBottom() + 16;
      return ticks.map((value) => ({
        value,
        label: formatValue(value, 'number'),
        x: vScale(value),
        y,
      }));
    }
    const yScale = this.ctx.yScale();
    const x = Math.max(0, this.ctx.plotLeft() - 6);
    return ticks.map((value) => ({
      value,
      label: formatValue(value, 'number'),
      x,
      y: yScale(value),
    }));
  });

  /** Grid lines aligned to the value ticks (horizontal lines when vertical). */
  readonly gridLines = computed<BarGridLine[]>(() => {
    const [, max] = this.ctx.yDomain();
    const ticks = computeTicks(max, 4);
    if (this.horizontal()) {
      const vScale = linearScale(
        [0, max],
        [this.ctx.plotLeft(), this.ctx.plotRight()],
      );
      const y1 = this.ctx.plotTop();
      const y2 = this.ctx.plotBottom();
      return ticks.map((v) => ({ x1: vScale(v), x2: vScale(v), y1, y2 }));
    }
    const yScale = this.ctx.yScale();
    const x1 = this.ctx.plotLeft();
    const x2 = this.ctx.plotRight();
    return ticks.map((v) => ({ x1, x2, y1: yScale(v), y2: yScale(v) }));
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

/**
 * Per-corner radii for a bar segment, mirroring recharts. Non-stacked rounds the
 * top (vertical) or right (horizontal); stacked rounds only the outer segment.
 */
export function cornerRadii(
  r: number,
  horizontal: boolean,
  stacked: boolean,
  index: number,
  count: number,
): CornerRadii {
  if (r <= 0) return [0, 0, 0, 0];
  if (!stacked) return horizontal ? [0, r, r, 0] : [r, r, 0, 0];
  const last = count - 1;
  if (horizontal) {
    if (index === 0) return [r, 0, 0, r];
    if (index === last) return [0, r, r, 0];
    return [0, 0, 0, 0];
  }
  if (index === 0) return [0, 0, r, r];
  if (index === last) return [r, r, 0, 0];
  return [0, 0, 0, 0];
}
