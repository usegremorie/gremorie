import { scaleBand, scaleLinear, scalePoint } from 'd3-scale';

/** Continuous numeric scale (thin wrapper over d3-scale). */
export function linearScale(
  domain: readonly [number, number],
  range: readonly [number, number],
): (value: number) => number {
  return scaleLinear()
    .domain([...domain])
    .range([...range]);
}

/** Categorical position scale; categories land at discrete points across the range. */
export function pointScale(
  categories: readonly string[],
  range: readonly [number, number],
): (value: string) => number {
  const scale = scalePoint<string>()
    .domain([...categories])
    .range([...range])
    .padding(0);
  return (value: string) => scale(value) ?? 0;
}

/** A band scale: maps a category to its slot start, plus the slot geometry. */
export interface BandScale {
  (value: string): number;
  /** Width of each category's band (where bars are drawn). */
  bandwidth: number;
  /** Distance between adjacent band starts (bandwidth + padding). */
  step: number;
}

/** Categorical band scale for bars — each category gets a slot of `bandwidth`. */
export function bandScale(
  categories: readonly string[],
  range: readonly [number, number],
  padding = 0.2,
): BandScale {
  const scale = scaleBand<string>()
    .domain([...categories])
    .range([...range])
    .padding(padding);
  const fn = ((value: string) => scale(value) ?? 0) as BandScale;
  fn.bandwidth = scale.bandwidth();
  fn.step = scale.step();
  return fn;
}

/**
 * Round a raw maximum up to the same axis bound recharts (the React edition)
 * picks, so both editions render identical Y axes for the same data. Port of
 * recharts' `getAdaptiveStep` for the [0, max] case: the rough step's
 * mantissa is rounded up in 0.05 increments (0.1 for single-digit steps) and
 * the bound rebuilt from that step. E.g. 305 over 4 intervals -> rough step
 * 76.25 -> step 80 -> bound 320 (recharts renders 0/80/160/240/320); a round
 * max like 100 stays 100 (step 25).
 */
export function niceMax(rawMax: number, intervals = 4): number {
  if (rawMax <= 0) return 1;
  const roughStep = rawMax / intervals;
  const digitCount = Math.floor(Math.log10(Math.abs(roughStep))) + 1;
  const digitCountValue = Math.pow(10, digitCount);
  const ratio = roughStep / digitCountValue;
  const ratioScale = digitCount !== 1 ? 0.05 : 0.1;
  const step =
    Math.ceil(ratio / ratioScale - 1e-9) * ratioScale * digitCountValue;
  // Guard float drift (e.g. 0.30000000000000004) before rebuilding the bound.
  const rounded = Math.round(step * 1e9) / 1e9;
  return Math.round(rounded * intervals * 1e9) / 1e9;
}
