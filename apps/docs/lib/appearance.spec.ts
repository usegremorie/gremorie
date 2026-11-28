import { converter, wcagContrast } from 'culori';
import { describe, expect, it } from 'vitest';
import { parseColor } from '@gremorie/color';
import {
  ACCENTS,
  APPEARANCE_KEY,
  APPEARANCE_SCRIPT,
  DEFAULT_APPEARANCE,
  applyAppearance,
  readAppearance,
  seedFromColor,
  writeAppearance,
  type Appearance,
} from './appearance';

function memoryStorage(initial?: string): Storage {
  const data = new Map<string, string>();
  if (initial !== undefined) data.set(APPEARANCE_KEY, initial);
  return {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
    clear: () => data.clear(),
    key: () => null,
    get length() {
      return data.size;
    },
  };
}

function fakeRoot() {
  const attrs = new Map<string, string>();
  const vars = new Map<string, string>();
  return {
    attrs,
    vars,
    setAttribute: (k: string, v: string) => void attrs.set(k, v),
    removeAttribute: (k: string) => void attrs.delete(k),
    style: {
      setProperty: (k: string, v: string) => void vars.set(k, v),
      removeProperty: (k: string) => void vars.delete(k),
    },
  } as unknown as HTMLElement & {
    attrs: Map<string, string>;
    vars: Map<string, string>;
  };
}

const VIOLET: Appearance = {
  accent: 'violet',
  seed: '',
  translucency: 'immersive',
  tonal: true,
  saved: [],
};

const CUSTOM: Appearance = {
  ...VIOLET,
  accent: 'custom',
  seed: 'oklch(0.64 0.15 145)',
  saved: ['oklch(0.64 0.15 145)', '#3366cc'],
};

describe('appearance state', () => {
  it('lists neutral first, then the seven colours', () => {
    expect(ACCENTS).toEqual([
      'neutral',
      'violet',
      'blue',
      'teal',
      'green',
      'orange',
      'rose',
      'red',
    ]);
  });

  it('round-trips through storage', () => {
    const s = memoryStorage();
    writeAppearance(VIOLET, s);
    expect(readAppearance(s)).toEqual(VIOLET);
  });

  it.each([
    ['nothing stored', undefined],
    ['invalid JSON', '{nope'],
    ['an unknown accent', JSON.stringify({ ...VIOLET, accent: 'lime' })],
    ['an unknown translucency', JSON.stringify({ ...VIOLET, translucency: 'glass' })],
    ['a non-object', '"violet"'],
  ])('falls back to the default with %s', (_, raw) => {
    expect(readAppearance(memoryStorage(raw))).toEqual(DEFAULT_APPEARANCE);
  });

  it('falls back to the default when storage throws', () => {
    const s = memoryStorage();
    s.getItem = () => {
      throw new Error('blocked');
    };
    expect(readAppearance(s)).toEqual(DEFAULT_APPEARANCE);
    s.setItem = () => {
      throw new Error('blocked');
    };
    expect(() => writeAppearance(VIOLET, s)).not.toThrow();
  });

  it('round-trips a custom colour and its saved colours', () => {
    const s = memoryStorage();
    writeAppearance(CUSTOM, s);
    expect(readAppearance(s)).toEqual(CUSTOM);
  });

  it('reads the earlier shape, without seed or saved colours', () => {
    const old = JSON.stringify({ accent: 'teal', translucency: 'solid', tonal: true });
    expect(readAppearance(memoryStorage(old))).toEqual({
      accent: 'teal',
      seed: '',
      translucency: 'solid',
      tonal: true,
      saved: [],
    });
  });

  it.each([
    ['missing', undefined],
    ['with alpha', 'oklch(0.6 0.2 30 / 0.5)'],
    ['in another format', '#3366cc'],
    ['with CSS after it', 'oklch(0.6 0.2 30); background: red'],
  ])('falls back to neutral when the custom seed is %s', (_, seed) => {
    const raw = JSON.stringify({ ...CUSTOM, seed });
    expect(readAppearance(memoryStorage(raw))).toEqual({
      ...CUSTOM,
      accent: 'neutral',
      seed: '',
    });
  });

  it('keeps only valid saved colours, at most 16', () => {
    const saved = ['#ff0000', 'nope', 42, ...Array.from({ length: 20 }, (_, i) => `oklch(0.5 0.1 ${i})`)];
    const read = readAppearance(memoryStorage(JSON.stringify({ ...VIOLET, saved })));
    expect(read.saved[0]).toBe('#ff0000');
    expect(read.saved).not.toContain('nope');
    expect(read.saved).toHaveLength(16);
  });

  it('applies a custom colour as data-accent and --seed, and clears it', () => {
    const root = fakeRoot();
    applyAppearance(CUSTOM, root);
    expect(root.attrs.get('data-accent')).toBe('custom');
    expect(root.vars.get('--seed')).toBe('oklch(0.64 0.15 145)');
    expect(root.attrs.get('data-tonal')).toBe('on');
    applyAppearance(VIOLET, root);
    expect(root.vars.has('--seed')).toBe(false);
    expect(root.attrs.get('data-accent')).toBe('violet');
  });

  // The pre-paint script is a string by design, evaluated as the browser does.
  /* eslint-disable @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
  it('the pre-paint script applies a custom colour like applyAppearance', () => {
    const root = fakeRoot();
    new Function('localStorage', 'document', APPEARANCE_SCRIPT)(
      memoryStorage(JSON.stringify(CUSTOM)),
      { documentElement: root },
    );
    expect(root.attrs.get('data-accent')).toBe('custom');
    expect(root.vars.get('--seed')).toBe('oklch(0.64 0.15 145)');
  });

  it('the pre-paint script ignores an unsafe seed', () => {
    const root = fakeRoot();
    new Function('localStorage', 'document', APPEARANCE_SCRIPT)(
      memoryStorage(JSON.stringify({ ...CUSTOM, seed: 'red;}html{display:none' })),
      { documentElement: root },
    );
    expect(root.attrs.has('data-accent')).toBe(false);
    expect(root.vars.size).toBe(0);
  });

  /* eslint-enable @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
  it('sets the three attributes, and none for the default', () => {
    const root = fakeRoot();
    applyAppearance(VIOLET, root);
    expect(Object.fromEntries(root.attrs)).toEqual({
      'data-accent': 'violet',
      'data-translucency': 'immersive',
      'data-tonal': 'on',
    });
    applyAppearance(DEFAULT_APPEARANCE, root);
    expect(root.attrs.size).toBe(0);
  });

  // The inline script is a string by design (it runs before any bundle), so
  // the test evaluates it the way the browser does.
  /* eslint-disable @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
  it('the pre-paint script applies the same attributes as applyAppearance', () => {
    const root = fakeRoot();
    const storage = memoryStorage(JSON.stringify(VIOLET));
    new Function('localStorage', 'document', APPEARANCE_SCRIPT)(storage, {
      documentElement: root,
    });
    const expected = fakeRoot();
    applyAppearance(VIOLET, expected);
    expect(Object.fromEntries(root.attrs)).toEqual(
      Object.fromEntries(expected.attrs),
    );
  });

  it('the pre-paint script never throws', () => {
    const root = fakeRoot();
    expect(() =>
      new Function('localStorage', 'document', APPEARANCE_SCRIPT)(
        memoryStorage('{nope'),
        { documentElement: root },
      ),
    ).not.toThrow();
    expect(root.attrs.size).toBe(0);
  });
});

describe('seedFromColor', () => {
  // Primary is the custom scale's 600 step (L 0.56) in light and 500 (L 0.64)
  // in dark, with the seed's chroma; its text is white below L 0.59.
  const toRgb = converter('rgb');
  const primaryContrast = (seed: string, l: number) => {
    const c = parseColor(seed)!;
    const bg = { mode: 'oklch' as const, l, c: c.c, h: c.h };
    const text = l < 0.59 ? '#ffffff' : '#000000';
    return wcagContrast(text, toRgb(bg));
  };

  it.each([25, 90, 145, 200, 264, 330])(
    'keeps primary text at 4.5:1 for a full-chroma pick at hue %i',
    (h) => {
      const seed = seedFromColor({ l: 0.7, c: 0.4, h, alpha: 0.5 });
      expect(seed).toMatch(/^oklch\([\d.]+ [\d.]+ [\d.]+\)$/);
      expect(primaryContrast(seed, 0.56)).toBeGreaterThanOrEqual(4.5);
      expect(primaryContrast(seed, 0.64)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it('keeps a chroma that already fits', () => {
    expect(seedFromColor({ l: 0.5, c: 0.05, h: 200, alpha: 1 })).toBe(
      'oklch(0.64 0.05 200)',
    );
  });
});
