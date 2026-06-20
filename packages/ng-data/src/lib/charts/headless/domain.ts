/** A series registered with the chart context, contributing values to the shared Y domain. */
export interface SeriesReg {
  key: string;
  /** Live accessor — reads current data so the domain stays reactive. */
  values: () => readonly number[];
}

/** Shared Y domain [0, max] across all registered series. Falls back to [0, 1]. */
export function computeYDomain(
  registrations: readonly SeriesReg[],
): [number, number] {
  let max = 0;
  let seen = false;
  for (const reg of registrations) {
    for (const v of reg.values()) {
      seen = true;
      if (v > max) max = v;
    }
  }
  return [0, seen && max > 0 ? max : 1];
}

/**
 * Stacked Y domain [0, max] where `max` is the largest per-row SUM across every
 * registered series — so a stacked bar/area chart's axis covers the full stack,
 * not just the tallest single series. Falls back to [0, 1].
 */
export function computeStackedYDomain(
  registrations: readonly SeriesReg[],
): [number, number] {
  const columns = registrations.map((r) => r.values());
  const rows = columns.reduce((m, c) => Math.max(m, c.length), 0);
  let max = 0;
  for (let i = 0; i < rows; i++) {
    let sum = 0;
    for (const col of columns) sum += Number(col[i] ?? 0);
    if (sum > max) max = sum;
  }
  return [0, max > 0 ? max : 1];
}
