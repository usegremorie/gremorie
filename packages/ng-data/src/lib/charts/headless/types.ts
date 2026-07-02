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
  /** Angular-only extension: formatter preset, e.g. `'currency:BRL' | 'percent' | 'compact'`. */
  format?: string;
}

/** @deprecated Back-compat alias. Prefer {@link ChartSeriesConfig}. */
export type SeriesConfigEntry = ChartSeriesConfig;

/** Maps a data field name to its series config. JSON-serializable (generative-UI ready). */
export type ChartConfig = Record<string, ChartSeriesConfig>;

/** Curve interpolation for area / line series (parity with recharts `type`). */
export type CurveType = 'natural' | 'monotone' | 'linear' | 'step';

/** Polar grid shape for the radar chart. */
export type GridType = 'polygon' | 'circle';

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
export function paletteColor(i: number): string {
  return `var(--chart-${(i % 5) + 1})`;
}
