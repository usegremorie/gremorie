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
