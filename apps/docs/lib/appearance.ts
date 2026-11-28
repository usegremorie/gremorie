/**
 * The visitor's appearance choice for the site: accent colour, translucency
 * and tonal. It lives in localStorage and shows as three attributes on <html>
 * (data-accent, data-translucency, data-tonal) that the token layer reads.
 * The default writes no attribute at all.
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
  accent: Accent;
  translucency: Translucency;
  tonal: boolean;
};

export const APPEARANCE_KEY = 'gr-appearance';
export const DEFAULT_APPEARANCE: Appearance = {
  accent: 'neutral',
  translucency: 'subtle',
  tonal: false,
};

function parse(raw: string | null): Appearance {
  if (!raw) return DEFAULT_APPEARANCE;
  try {
    const v = JSON.parse(raw) as Partial<Appearance> | null;
    if (
      !v ||
      typeof v !== 'object' ||
      !ACCENTS.includes(v.accent as Accent) ||
      !TRANSLUCENCIES.includes(v.translucency as Translucency)
    ) {
      return DEFAULT_APPEARANCE;
    }
    return {
      accent: v.accent as Accent,
      translucency: v.translucency as Translucency,
      tonal: v.tonal === true,
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
    value === null ? root.removeAttribute(name) : root.setAttribute(name, value);
  set('data-accent', a.accent === 'neutral' ? null : a.accent);
  set('data-translucency', a.translucency === 'subtle' ? null : a.translucency);
  set('data-tonal', a.tonal && a.accent !== 'neutral' ? 'on' : null);
}

/**
 * Inline <head> script: the same read + apply, with no imports, so the page
 * paints in the chosen colours instead of flashing the default first.
 */
export const APPEARANCE_SCRIPT = `try{var v=JSON.parse(localStorage.getItem(${JSON.stringify(
  APPEARANCE_KEY,
)})||'null');if(v&&${JSON.stringify(ACCENTS)}.indexOf(v.accent)>=0&&${JSON.stringify(
  TRANSLUCENCIES,
)}.indexOf(v.translucency)>=0){var r=document.documentElement;if(v.accent!=='neutral')r.setAttribute('data-accent',v.accent);if(v.translucency!=='subtle')r.setAttribute('data-translucency',v.translucency);if(v.tonal===true&&v.accent!=='neutral')r.setAttribute('data-tonal','on');}}catch(e){}`;
