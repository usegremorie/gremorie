import { describe, expect, it } from 'vitest';
import {
  formatColor,
  maxChroma,
  contrastRatio,
  isInGamut,
  parseColor,
  toCss,
  toGamut,
  type Color,
} from './color';

const close = (a: number, b: number, digits = 2) =>
  expect(a).toBeCloseTo(b, digits);

describe('parseColor', () => {
  it('reads hex into oklch', () => {
    const c = parseColor('#ff0000')!;
    close(c.l, 0.628);
    close(c.c, 0.258);
    close(c.h, 29.23, 1);
    expect(c.alpha).toBe(1);
  });

  it('reads rgb, hsl, oklch, percentages and names', () => {
    expect(parseColor('rgb(255 0 0 / 0.5)')!.alpha).toBe(0.5);
    close(parseColor('hsl(120 100% 50%)')!.h, 142.5, 0);
    expect(parseColor('oklch(0.7 0.1 200)')).toEqual({
      l: 0.7,
      c: 0.1,
      h: 200,
      alpha: 1,
    });
    close(parseColor('oklch(70% 0.1 200)')!.l, 0.7);
    expect(parseColor('rebeccapurple')).not.toBeNull();
  });

  it('reads lab, lch, hwb and display-p3, as browsers print computed colours', () => {
    close(parseColor('lab(70.5521% -66.5147 45.8073)')!.h, 150, -1);
    expect(parseColor('lch(50% 60 270)')).not.toBeNull();
    expect(parseColor('hwb(120 10% 20%)')).not.toBeNull();
    expect(parseColor('color(display-p3 0.2 0.6 0.3)')).not.toBeNull();
  });

  it('returns null for anything that is not a colour', () => {
    expect(parseColor('nope')).toBeNull();
    expect(parseColor('')).toBeNull();
    expect(parseColor('#12')).toBeNull();
  });

  it('keeps the given hue for an achromatic colour', () => {
    const gray = parseColor('#808080', 250)!;
    close(gray.c, 0, 3);
    expect(gray.h).toBe(250);
    expect(parseColor('#808080')!.h).toBe(0);
  });
});

describe('formatColor', () => {
  const teal: Color = { l: 0.7, c: 0.1, h: 200, alpha: 1 };

  it('prints oklch, with alpha only when translucent', () => {
    expect(formatColor(teal, 'oklch')).toBe('oklch(0.7 0.1 200)');
    expect(formatColor({ ...teal, alpha: 0.5 }, 'oklch')).toBe(
      'oklch(0.7 0.1 200 / 0.5)',
    );
    expect(toCss(teal)).toBe('oklch(0.7 0.1 200)');
  });

  it('round-trips hex, rgb and hsl', () => {
    const blue = parseColor('#3366cc')!;
    expect(formatColor(blue, 'hex')).toBe('#3366cc');
    expect(formatColor(blue, 'rgb')).toBe('rgb(51 102 204)');
    expect(formatColor(blue, 'hsl')).toBe('hsl(220 60% 50%)');
  });

  it('adds alpha to hex, rgb and hsl when translucent', () => {
    const blue = { ...parseColor('#3366cc')!, alpha: 0.5 };
    expect(formatColor(blue, 'hex')).toBe('#3366cc80');
    expect(formatColor(blue, 'rgb')).toBe('rgb(51 102 204 / 0.5)');
    expect(formatColor(blue, 'hsl')).toBe('hsl(220 60% 50% / 0.5)');
  });
});

describe('gamut', () => {
  const wild: Color = { l: 0.7, c: 0.4, h: 150, alpha: 1 };

  it('knows when a colour is outside sRGB', () => {
    expect(isInGamut(wild)).toBe(false);
    expect(isInGamut({ l: 0.7, c: 0.05, h: 150, alpha: 1 })).toBe(true);
  });

  it('maps to sRGB keeping lightness and hue close', () => {
    const mapped = toGamut(wild);
    expect(isInGamut(mapped)).toBe(true);
    close(mapped.l, 0.7, 1);
    close(mapped.h, 150, -1);
    expect(mapped.c).toBeLessThan(0.4);
  });

  it('prints sRGB formats from the mapped colour, oklch from the chosen one', () => {
    expect(formatColor(wild, 'hex')).toMatch(/^#[0-9a-f]{6}$/);
    expect(formatColor(wild, 'hex')).toBe(formatColor(toGamut(wild), 'hex'));
    expect(formatColor(wild, 'oklch')).toBe('oklch(0.7 0.4 150)');
  });
});

describe('maxChroma', () => {
  it('finds the most chroma sRGB can show at a lightness and hue', () => {
    const c = maxChroma(0.56, 145);
    expect(isInGamut({ l: 0.56, c, h: 145, alpha: 1 })).toBe(true);
    expect(isInGamut({ l: 0.56, c: c + 0.005, h: 145, alpha: 1 })).toBe(false);
    expect(maxChroma(1, 145)).toBeLessThan(0.001);
    expect(maxChroma(0.6, 264)).toBeGreaterThan(maxChroma(0.6, 145));
  });
});

describe('contrastRatio', () => {
  it('measures WCAG contrast between two colours', () => {
    const white = parseColor('#ffffff')!;
    const black = parseColor('#000000')!;
    expect(contrastRatio(white, black)).toBeCloseTo(21, 1);
    expect(contrastRatio(white, white)).toBeCloseTo(1, 5);
    expect(contrastRatio(parseColor('#767676')!, white)).toBeCloseTo(4.54, 2);
  });
});
