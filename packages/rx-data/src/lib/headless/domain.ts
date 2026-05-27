/** A series registered with the chart context, contributing values to the shared Y domain. */
export interface SeriesReg {
  key: string;
  /** Live accessor - reads current data so the domain stays reactive. */
  values: () => readonly number[];
}

/** Shared Y domain [0, max] across all registered series. Falls back to [0, 1]. */
export function computeYDomain(
  registrations: readonly SeriesReg[]
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
