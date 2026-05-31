/**
 * Categorical chart palette — the `--chart-1…5` design tokens, cycled.
 * Used by bar (categorical mode), pie, radial, and the chart artifact so the
 * colors stay consistent and live in one place.
 */
export const CHART_PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

/** The categorical color at index `i` (cycles every 5). */
export const colorAt = (i: number): string =>
  CHART_PALETTE[((i % CHART_PALETTE.length) + CHART_PALETTE.length) % CHART_PALETTE.length];
