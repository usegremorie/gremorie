import Color from 'colorjs.io';
import type { DtcgColor } from './model.ts';

export interface Srgb8 {
  r: number;
  g: number;
  b: number;
  a: number;
}

export const toColorJs = (c: DtcgColor): Color =>
  new Color('oklch', [...c.components], c.alpha ?? 1);

/**
 * 8-bit sRGB, gamut mapped by the CSS Color 4 algorithm (chroma reduction
 * at constant lightness and hue), so a wide-gamut primitive keeps its hue.
 */
export function toSrgb8(c: DtcgColor): Srgb8 {
  const mapped = toColorJs(c).to('srgb').toGamut({ method: 'css' });
  const channel = (v: number) =>
    Math.round(Math.min(1, Math.max(0, Number.isNaN(v) ? 0 : v)) * 255);
  const [r = 0, g = 0, b = 0] = mapped.coords;
  return {
    r: channel(r),
    g: channel(g),
    b: channel(b),
    a: Math.round((c.alpha ?? 1) * 255),
  };
}

const byte = (n: number) => n.toString(16).padStart(2, '0');

export function toHex(c: DtcgColor): string {
  const s = toSrgb8(c);
  return `#${byte(s.r)}${byte(s.g)}${byte(s.b)}${s.a === 255 ? '' : byte(s.a)}`;
}

/** Composites a colour over an opaque one, as the browser paints it. */
export function over(top: Srgb8, bottom: Srgb8): Srgb8 {
  const a = top.a / 255;
  const mix = (x: number, y: number) => Math.round(x * a + y * (1 - a));
  return {
    r: mix(top.r, bottom.r),
    g: mix(top.g, bottom.g),
    b: mix(top.b, bottom.b),
    a: 255,
  };
}

/** Relative luminance, WCAG 2.x. */
export function luminance(s: Srgb8): number {
  const linear = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(s.r) + 0.7152 * linear(s.g) + 0.0722 * linear(s.b);
}

/**
 * WCAG 2.x contrast of a foreground on a background. A translucent
 * background is first composited over `page` (the theme's --background).
 */
export function contrastRatio(
  foreground: DtcgColor,
  background: DtcgColor,
  page?: DtcgColor,
): number {
  let bg = toSrgb8(background);
  if (bg.a < 255) {
    if (!page) {
      throw new Error(
        'A translucent background needs the page colour under it',
      );
    }
    bg = over(bg, toSrgb8(page));
  }
  const fg = over(toSrgb8(foreground), bg);
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x) as [
    number,
    number,
  ];
  return (hi + 0.05) / (lo + 0.05);
}

/** Perceptual distance in OKLab between a token colour and a reference. */
export const deltaEOK = (a: DtcgColor, b: Color): number =>
  toColorJs(a).deltaE(b, 'OK');
