/** A single row of chart data: keys are field names, values are numbers or category labels. */
export type Datum = Record<string, string | number>;

/** Inner padding between the SVG edge and the plotting area. */
export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** Per-series visual config. `color` is a CSS color or token, e.g. 'var(--chart-1)'. */
export interface SeriesConfigEntry {
  label: string;
  color: string;
  /** Formatter preset name, e.g. 'currency:BRL' | 'percent' | 'compact'. */
  format?: string;
}

/** Maps a data field name to its series config. JSON-serializable (generative-UI ready). */
export type ChartConfig = Record<string, SeriesConfigEntry>;

export const DEFAULT_MARGIN: Margin = { top: 8, right: 8, bottom: 24, left: 40 };
