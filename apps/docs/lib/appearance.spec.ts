import { describe, expect, it } from 'vitest';
import {
  ACCENTS,
  APPEARANCE_KEY,
  APPEARANCE_SCRIPT,
  DEFAULT_APPEARANCE,
  applyAppearance,
  readAppearance,
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
  return {
    attrs,
    setAttribute: (k: string, v: string) => void attrs.set(k, v),
    removeAttribute: (k: string) => void attrs.delete(k),
  } as unknown as HTMLElement & { attrs: Map<string, string> };
}

const VIOLET: Appearance = {
  accent: 'violet',
  translucency: 'immersive',
  tonal: true,
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
    [
      'an unknown translucency',
      JSON.stringify({ ...VIOLET, translucency: 'glass' }),
    ],
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
