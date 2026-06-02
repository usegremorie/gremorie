/**
 * A single chart row. Field names map to numeric values or category labels;
 * an optional `fill` sets a per-row color (used by categorical bar/pie/radial).
 */
export type ChartDatum = Record<string, string | number> & { fill?: string };
