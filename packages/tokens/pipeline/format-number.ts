/** Rounds to 6 decimals, the precision every token value is kept at. */
export function round6(n: number): number {
  return Number(n.toFixed(6));
}

/** Formats a number the way the generated CSS writes it: 6 decimals, no trailing zeros. */
export function fmt(n: number): string {
  const s = n.toFixed(6).replace(/\.?0+$/, '');
  return s === '-0' ? '0' : s;
}
