import type { Type } from '@angular/core';

/**
 * One row of chart data: keys are field names, values are numbers or category
 * labels. The optional `fill` sets a per-row color (per-bar / per-slice), used
 * by the categorical single-series charts — parity with the React `ChartDatum`.
 */
export type ChartDatum = Record<string, string | number> & { fill?: string };

/** @deprecated Back-compat alias. Prefer {@link ChartDatum}. */
export type Datum = ChartDatum;

/** Inner padding between the SVG edge and the plotting area. */
export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Per-series visual config. Both `label` and `color` are **optional** — parity
 * with the React `ChartConfig` primitive. When omitted, charts fall back to a
 * title-cased key (label) and the cycling palette `--chart-1..5` (color).
 */
export interface ChartSeriesConfig {
  /** Legend / tooltip label. Defaults to a title-cased key. */
  label?: string;
  /** CSS color or token, e.g. `'var(--chart-1)'`. Defaults to the palette. */
  color?: string;
  /**
   * Formatter preset, e.g. `'currency:BRL' | 'percent' | 'compact'`. A plain
   * string, never a function, so the config stays JSON-serializable.
   */
  format?: string;
  /**
   * Component drawn in the legend in place of the colour swatch. Mirrors
   * React's `ChartConfig.icon`. The series colour reaches it through
   * `currentColor`, so a plain SVG icon needs no extra wiring.
   */
  icon?: Type<unknown>;
}

/** @deprecated Back-compat alias. Prefer {@link ChartSeriesConfig}. */
export type SeriesConfigEntry = ChartSeriesConfig;

/** Maps a data field name to its series config. JSON-serializable (generative-UI ready). */
export type ChartConfig = Record<string, ChartSeriesConfig>;

/** Curve interpolation for area / line series (parity with recharts `type`). */
export type CurveType = 'natural' | 'monotone' | 'linear' | 'step';

/** Polar grid shape for the radar chart. */
export type GridType = 'polygon' | 'circle';

/**
 * Radar polygon fill. `auto` fills a lone series and outlines two or more:
 * stacked translucent fills turn muddy fast, so past one series the outline
 * carries the shape. `on` / `off` force it either way.
 */
export type RadarFill = 'auto' | 'on' | 'off';

export const DEFAULT_MARGIN: Margin = {
  top: 8,
  right: 8,
  bottom: 24,
  left: 40,
};

/** Title-case a field key for a default label, e.g. `unique_users` → `Unique Users`. */
export function titleCaseKey(key: string): string {
  return key.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** The cycling categorical palette token for index `i`. */
/**
 * The categorical slot for series `i`. Five hues, assigned in fixed order and
 * **never cycled**: a sixth series that reused `--chart-1` would paint two
 * different series the same colour, and the reader has no way back from that.
 * Past the fifth, series fall back to a muted neutral — the chart stops
 * claiming they are individually identifiable, which is the honest signal that
 * the data needs folding into an "Other" bucket, small multiples, or a
 * different form.
 */
export function paletteColor(i: number): string {
  return i < 5 ? `var(--chart-${i + 1})` : 'var(--muted-foreground)';
}
