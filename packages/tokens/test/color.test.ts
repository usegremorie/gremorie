import { describe, expect, it } from 'vitest';
import { contrastRatio, over, toHex, toSrgb8 } from '../pipeline/color.ts';
import type { DtcgColor } from '../pipeline/model.ts';

const oklch = (l: number, c: number, h: number, alpha?: number): DtcgColor =>
  alpha === undefined
    ? { colorSpace: 'oklch', components: [l, c, h] }
    : { colorSpace: 'oklch', components: [l, c, h], alpha };

describe('sRGB conversion', () => {
  it('matches the hex comments of 0.8.0 for in-gamut colours', () => {
    expect(toHex(oklch(0.985, 0, 0))).toBe('#fafafa');
    expect(toHex(oklch(0.145, 0, 0))).toBe('#0a0a0a');
    expect(toHex(oklch(0.672, 0.131, 38.76))).toBe('#d97757');
  });

  it('keeps alpha as a fourth byte', () => {
    expect(toHex(oklch(1, 0, 0, 0.1))).toBe('#ffffff1a');
    expect(toSrgb8(oklch(1, 0, 0, 0.15)).a).toBe(38);
  });

  it('maps an out-of-gamut colour into 0..255 instead of failing', () => {
    const s = toSrgb8(oklch(0.637, 0.237, 25.331)); // red-500, wider than sRGB
    for (const v of [s.r, s.g, s.b]) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(255);
    }
  });
});

describe('contrast (WCAG 2.x)', () => {
  it('measures black on white at 21:1 and a colour on itself at 1:1', () => {
    expect(contrastRatio(oklch(0, 0, 0), oklch(1, 0, 0))).toBeCloseTo(21, 1);
    expect(contrastRatio(oklch(0.5, 0.1, 20), oklch(0.5, 0.1, 20))).toBe(1);
  });

  it('composites a translucent colour over what is under it', () => {
    expect(
      over({ r: 255, g: 255, b: 255, a: 26 }, { r: 0, g: 0, b: 0, a: 255 }),
    ).toEqual({
      r: 26,
      g: 26,
      b: 26,
      a: 255,
    });
    const onWhite = contrastRatio(oklch(0, 0, 0, 0.5), oklch(1, 0, 0));
    expect(onWhite).toBeGreaterThan(3);
    expect(onWhite).toBeLessThan(5);
    expect(() => contrastRatio(oklch(0, 0, 0), oklch(1, 0, 0, 0.1))).toThrow(
      /page/,
    );
  });

  it('refuses a translucent page colour', () => {
    expect(() =>
      contrastRatio(oklch(0, 0, 0), oklch(1, 0, 0, 0.1), oklch(0.5, 0, 0, 0.5)),
    ).toThrow(/page colour must be opaque/);
  });
});
