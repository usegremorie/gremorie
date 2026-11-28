import {
  converter,
  formatHex,
  formatHex8,
  inGamut,
  modeHsl,
  modeHwb,
  modeLab,
  modeLch,
  modeLrgb,
  modeP3,
  modeOklab,
  modeOklch,
  modeRgb,
  parse,
  toGamut as culoriToGamut,
  useMode as registerMode,
  wcagContrast,
  type Oklch,
} from 'culori/fn';

// Register only the modes the picker needs, so bundles stay small.
registerMode(modeRgb);
registerMode(modeHsl);
// Browsers print computed colours in these spaces, so the picker reads them.
registerMode(modeHwb);
registerMode(modeLab);
registerMode(modeLch);
registerMode(modeP3);
registerMode(modeLrgb);
registerMode(modeOklab);
registerMode(modeOklch);

/** A colour in OKLCH: lightness 0..1, chroma 0..~0.4, hue 0..360, alpha 0..1. */
export interface Color {
  l: number;
  c: number;
  h: number;
  alpha: number;
}

/** The text formats a picker can read and print. */
export type ColorFormat = 'oklch' | 'hex' | 'rgb' | 'hsl';

const toOklch = converter('oklch');
const toRgb = converter('rgb');
const toHsl = converter('hsl');
const srgb = inGamut('rgb');
const mapToSrgb = culoriToGamut('rgb', 'oklch');

const round = (value: number, digits: number) => {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
};

/**
 * Reads any CSS colour (hex, rgb, hsl, oklch, named) into OKLCH. Returns null
 * when the text is not a colour. An achromatic colour has no hue of its own,
 * so it takes `fallbackHue`, which lets a picker keep its hue at chroma 0.
 */
export function parseColor(input: string, fallbackHue = 0): Color | null {
  const parsed = input.trim() ? parse(input.trim()) : undefined;
  if (!parsed) return null;
  const o = toOklch(parsed);
  const c = o.c ?? 0;
  const hue = o.h;
  return {
    l: round(o.l, 6),
    c: round(c, 6),
    h: hue === undefined || Number.isNaN(hue) || c < 1e-4 ? fallbackHue : round(hue, 4),
    alpha: o.alpha ?? 1,
  };
}

const asCulori = (color: Color): Oklch => ({
  mode: 'oklch',
  l: color.l,
  c: color.c,
  h: color.h,
  alpha: color.alpha,
});

/** True when the colour can be shown on an sRGB screen as is. */
export function isInGamut(color: Color): boolean {
  if (srgb(asCulori(color))) return true;
  // Mapping round-trips through floats; allow a hair outside the cube.
  const { r, g, b } = toRgb(asCulori(color));
  const eps = 1e-5;
  return [r, g, b].every((v) => v >= -eps && v <= 1 + eps);
}

/**
 * The most chroma sRGB can show at this lightness and hue (to 1e-4), for
 * keeping a colour displayable while its hue or lightness change.
 */
export function maxChroma(l: number, h: number): number {
  let lo = 0;
  let hi = 0.4;
  if (isInGamut({ l, c: hi, h, alpha: 1 })) return hi;
  while (hi - lo > 1e-4) {
    const mid = (lo + hi) / 2;
    if (isInGamut({ l, c: mid, h, alpha: 1 })) lo = mid;
    else hi = mid;
  }
  return lo;
}

/** The closest sRGB colour, keeping lightness and hue as far as possible. */
export function toGamut(color: Color): Color {
  if (isInGamut(color)) return color;
  const mapped = toOklch(mapToSrgb(asCulori(color)));
  const c = mapped.c ?? 0;
  return {
    l: mapped.l,
    c,
    h: mapped.h === undefined || Number.isNaN(mapped.h) || c < 1e-4 ? color.h : mapped.h,
    alpha: color.alpha,
  };
}

const alphaSuffix = (alpha: number) =>
  alpha < 1 ? ` / ${round(alpha, 3)}` : '';

/**
 * Prints a colour. OKLCH keeps the chosen value; hex, rgb and hsl print the
 * sRGB-mapped colour. Alpha is only written when the colour is translucent.
 */
export function formatColor(color: Color, format: ColorFormat): string {
  if (format === 'oklch') {
    return `oklch(${round(color.l, 4)} ${round(color.c, 4)} ${round(color.h, 2)}${alphaSuffix(color.alpha)})`;
  }
  const mapped = isInGamut(color)
    ? asCulori(color)
    : { ...mapToSrgb(asCulori(color)), alpha: color.alpha };
  if (format === 'hex') {
    return color.alpha < 1 ? formatHex8(mapped) : formatHex(mapped);
  }
  if (format === 'rgb') {
    const { r, g, b } = toRgb(mapped);
    const ch = (v: number) => Math.round(Math.min(1, Math.max(0, v)) * 255);
    return `rgb(${ch(r)} ${ch(g)} ${ch(b)}${alphaSuffix(color.alpha)})`;
  }
  const hsl = toHsl(mapped);
  const h = Math.round(hsl.h ?? 0) % 360;
  const s = Math.round((hsl.s ?? 0) * 100);
  const l = Math.round(hsl.l * 100);
  return `hsl(${h} ${s}% ${l}%${alphaSuffix(color.alpha)})`;
}

/** WCAG 2 contrast ratio between two colours, as shown on an sRGB screen. */
export function contrastRatio(a: Color, b: Color): number {
  const srgb = (c: Color) => ({ ...mapToSrgb(asCulori(c)), alpha: 1 });
  return wcagContrast(srgb(a), srgb(b));
}

/** CSS for painting the colour (the OKLCH string). */
export const toCss = (color: Color): string => formatColor(color, 'oklch');

/** Two colours print the same in sRGB with alpha (used to dedupe). */
export const sameColor = (a: Color, b: Color): boolean =>
  formatColor({ ...a, alpha: 1 }, 'hex') ===
    formatColor({ ...b, alpha: 1 }, 'hex') && round(a.alpha, 3) === round(b.alpha, 3);
