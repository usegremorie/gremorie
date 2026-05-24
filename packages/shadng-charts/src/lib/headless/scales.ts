import { scaleLinear, scalePoint } from 'd3-scale';

/** Continuous numeric scale (thin wrapper over d3-scale). */
export function linearScale(
  domain: readonly [number, number],
  range: readonly [number, number],
): (value: number) => number {
  return scaleLinear().domain([...domain]).range([...range]);
}

/** Categorical position scale; categories land at discrete points across the range. */
export function pointScale(
  categories: readonly string[],
  range: readonly [number, number],
): (value: string) => number {
  const scale = scalePoint<string>().domain([...categories]).range([...range]).padding(0);
  return (value: string) => scale(value) ?? 0;
}

/** Round a raw maximum up to a readable axis bound (1-2-5 x 10^n). */
export function niceMax(rawMax: number): number {
  if (rawMax <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(rawMax)));
  const frac = rawMax / pow;
  const niceFrac = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10;
  return niceFrac * pow;
}
