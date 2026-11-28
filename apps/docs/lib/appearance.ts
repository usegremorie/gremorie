import {
  contrastRatio,
  formatColor,
  maxChroma,
  parseColor,
  type Color,
} from '@gremorie/color';

/**
 * The visitor's appearance choice for the site: accent colour (one of the DS
 * colours or a custom one), translucency and tonal, plus the colours they
 * saved. It lives in localStorage and shows as attributes on <html>
 * (data-accent, data-translucency, data-tonal) and, for a custom colour, the
 * --seed variable that the token layer reads. The default writes nothing.
 */

export const ACCENTS = [
  'neutral',
  'violet',
  'blue',
  'teal',
  'green',
  'orange',
  'rose',
  'red',
] as const;
export const TRANSLUCENCIES = ['solid', 'subtle', 'immersive'] as const;

export type Accent = (typeof ACCENTS)[number];
export type Translucency = (typeof TRANSLUCENCIES)[number];
export type Appearance = {
  /** A DS colour, or `custom` for the colour in `seed`. */
  accent: Accent | 'custom';
  /** The custom colour, `oklch(L C H)` without alpha; empty otherwise. */
  seed: string;
  translucency: Translucency;
  tonal: boolean;
  /** Colours the visitor saved in the picker, newest first. */
  saved: string[];
};

/**
 * A seed the token layer can take as is: plain `oklch(L C H)` numbers, no
 * alpha, nothing after it. Shared with the pre-paint script, which writes the
 * seed into a style property.
 */
export const SEED_PATTERN =
  /^oklch\((?:0|1|0?\.\d+) (?:0|0?\.\d+) \d{1,3}(?:\.\d+)?\)$/;
const MAX_SAVED = 16;

export const APPEARANCE_KEY = 'gr-appearance';
export const DEFAULT_APPEARANCE: Appearance = {
  accent: 'neutral',
  seed: '',
  translucency: 'subtle',
  tonal: false,
  saved: [],
};

/**
 * Lightness of the custom scale's primary steps: 600 in light, 500 in dark
 * (the CUSTOM table in packages/tokens/pipeline/appearance.ts). The button
 * text is white below 0.59 and black above, as the token layer decides.
 */
const PRIMARY_STEPS = [0.56, 0.64];
const TEXT_THRESHOLD = 0.59;
const WHITE: Color = { l: 1, c: 0, h: 0, alpha: 1 };
const BLACK: Color = { l: 0, c: 0, h: 0, alpha: 1 };

const readable = (c: number, h: number) =>
  PRIMARY_STEPS.every((l) => {
    const primary: Color = { l, c, h, alpha: 1 };
    const text = l < TEXT_THRESHOLD ? WHITE : BLACK;
    return contrastRatio(text, primary) >= 4.5;
  });

/**
 * The seed for a picked colour. The custom scale keeps its own lightness per
 * step and takes hue and chroma from the seed, so chroma is capped twice: to
 * what sRGB shows at the primary steps (past that the screen clips the colour)
 * and to what keeps the button text at 4.5:1 (strong greens and cyans read
 * lighter than their lightness says). Alpha is dropped: a translucent accent
 * would make every surface built on it translucent.
 */
export function seedFromColor(color: Color): string {
  const h = Math.round(color.h) % 360;
  let c = Math.min(color.c, ...PRIMARY_STEPS.map((l) => maxChroma(l, h)));
  c = Math.floor(c * 1000) / 1000;
  while (c > 0 && !readable(c, h)) c = Math.round((c - 0.001) * 1000) / 1000;
  return formatColor({ l: 0.64, c, h, alpha: 1 }, 'oklch');
}

const validSaved = (list: unknown): string[] =>
  Array.isArray(list)
    ? list
        .filter(
          (c): c is string =>
            typeof c === 'string' && c.length <= 64 && parseColor(c) !== null,
        )
        .slice(0, MAX_SAVED)
    : [];

function parse(raw: string | null): Appearance {
  if (!raw) return DEFAULT_APPEARANCE;
  try {
    const v = JSON.parse(raw) as Partial<Appearance> | null;
    const accent = v?.accent as Appearance['accent'];
    if (
      !v ||
      typeof v !== 'object' ||
      !(accent === 'custom' || ACCENTS.includes(accent)) ||
      !TRANSLUCENCIES.includes(v.translucency as Translucency)
    ) {
      return DEFAULT_APPEARANCE;
    }
    // A custom accent needs a safe seed; without one it falls back to neutral.
    const custom =
      accent === 'custom' &&
      typeof v.seed === 'string' &&
      SEED_PATTERN.test(v.seed);
    return {
      accent: accent === 'custom' && !custom ? 'neutral' : accent,
      seed: custom ? (v.seed as string) : '',
      translucency: v.translucency as Translucency,
      tonal: v.tonal === true,
      saved: validSaved(v.saved),
    };
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

export function readAppearance(storage?: Storage): Appearance {
  try {
    return parse((storage ?? window.localStorage).getItem(APPEARANCE_KEY));
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

export function writeAppearance(a: Appearance, storage?: Storage): void {
  try {
    (storage ?? window.localStorage).setItem(APPEARANCE_KEY, JSON.stringify(a));
  } catch {
    // Private mode or blocked storage: the choice lasts for this page only.
  }
}

export function applyAppearance(
  a: Appearance,
  root: HTMLElement = document.documentElement,
): void {
  const set = (name: string, value: string | null) =>
    value === null
      ? root.removeAttribute(name)
      : root.setAttribute(name, value);
  const custom = a.accent === 'custom' && SEED_PATTERN.test(a.seed);
  const accent = a.accent === 'custom' && !custom ? 'neutral' : a.accent;
  set('data-accent', accent === 'neutral' ? null : accent);
  if (custom) root.style.setProperty('--seed', a.seed);
  else root.style.removeProperty('--seed');
  set('data-translucency', a.translucency === 'subtle' ? null : a.translucency);
  set('data-tonal', a.tonal && accent !== 'neutral' ? 'on' : null);
}

/**
 * Inline <head> script: the same read + apply, with no imports, so the page
 * paints in the chosen colours instead of flashing the default first.
 */
export const APPEARANCE_SCRIPT = `try{var v=JSON.parse(localStorage.getItem(${JSON.stringify(
  APPEARANCE_KEY,
)})||'null');if(v&&${JSON.stringify([...ACCENTS, 'custom'])}.indexOf(v.accent)>=0&&${JSON.stringify(
  TRANSLUCENCIES,
)}.indexOf(v.translucency)>=0){var r=document.documentElement,a=v.accent;if(a==='custom'){if(typeof v.seed==='string'&&${SEED_PATTERN.toString()}.test(v.seed))r.style.setProperty('--seed',v.seed);else a='neutral';}if(a!=='neutral')r.setAttribute('data-accent',a);if(v.translucency!=='subtle')r.setAttribute('data-translucency',v.translucency);if(v.tonal===true&&a!=='neutral')r.setAttribute('data-tonal','on');}}catch(e){}`;
