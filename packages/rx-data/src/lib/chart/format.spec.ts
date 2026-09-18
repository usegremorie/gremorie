import { describe, expect, it } from 'vitest';

import { formatValue } from './format';

/**
 * Kept byte-identical with
 * `packages/ng-data/src/lib/charts/headless/format.spec.ts`.
 * The two editions duplicate the twenty-line formatter rather than stand up a
 * shared runtime package; this shared suite is what stops them drifting.
 *
 * Expectations are written against `Intl` rather than literals, because the
 * output follows the reader's locale by design — a literal would pass in CI
 * and fail on a pt-BR machine.
 */
describe('formatValue', () => {
  it('formats plain numbers with the host locale', () => {
    expect(formatValue(1234.5)).toBe((1234.5).toLocaleString());
    expect(formatValue(3.76)).toBe((3.76).toLocaleString());
  });

  it('formats currency in the host locale, not a hardcoded one', () => {
    expect(formatValue(1234.5, 'currency:BRL')).toBe(
      new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'BRL',
      }).format(1234.5),
    );
  });

  it('defaults currency to USD when the ISO code is missing', () => {
    expect(formatValue(10, 'currency:')).toBe(
      new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
      }).format(10),
    );
  });

  it('formats percent from a ratio', () => {
    expect(formatValue(0.125, 'percent')).toBe(
      new Intl.NumberFormat(undefined, {
        style: 'percent',
        maximumFractionDigits: 1,
      }).format(0.125),
    );
  });

  it('formats compact abbreviations', () => {
    expect(formatValue(12000, 'compact')).toBe(
      new Intl.NumberFormat(undefined, {
        notation: 'compact',
        maximumFractionDigits: 2,
      }).format(12000),
    );
  });

  it('does not read a fraction as a mega prefix', () => {
    // d3-format's `.3~s` renders 0.125 as `125m` (SI milli) and the old
    // uppercase turned it into `125M`, which reads as mega. Whatever the
    // locale, the compact form of a value below one must not gain a
    // thousands-or-larger suffix.
    expect(formatValue(0.125, 'compact')).not.toMatch(/[KMGBT]/i);
    expect(formatValue(0.5, 'compact')).not.toMatch(/[KMGBT]/i);
  });

  it('falls back to the default when the preset is unknown', () => {
    expect(formatValue(42, 'nope')).toBe((42).toLocaleString());
  });
});
