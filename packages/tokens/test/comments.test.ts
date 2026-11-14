import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';
import { describe, expect, it } from 'vitest';
import { cleanComment } from '../pipeline/seed/from-css.ts';
import { PACKAGE_ROOT, REFERENCE_DIR } from './support/paths.ts';

const FILES = [
  'theme.css',
  ...readdirSync(join(REFERENCE_DIR, 'themes')).map((f) => `themes/${f}`),
];
const flat = (s: string) => s.replace(/\s+/g, ' ').trim();
const paragraphs = (css: string) => {
  const out: string[] = [];
  postcss.parse(css).walkComments((c) => {
    for (const p of cleanComment(c.text).split('\n\n')) {
      const text = flat(p.replace(/^#[0-9a-f]{6}\b\s*/i, ''));
      if (text) out.push(text);
    }
  });
  return out;
};

/** `--name: value; /* #rrggbb *\/` declarations, by token name. */
const hexComments = (css: string) =>
  new Map(
    [...css.matchAll(/(--[\w-]+):[^;]*;[ \t]*\/\*\s*(#[0-9a-f]{6})\b/gi)].map(
      ([, name = '', hex = '']) => [name, hex.toLowerCase()],
    ),
  );
const channels = (hex: string) =>
  [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));

/**
 * Three yellows sit just outside sRGB. The 0.8.0 comments (copied from
 * Tailwind) clip the channels; the build maps them by chroma reduction
 * (CSS Color 4), like every other sRGB output of the package, which moves
 * one channel by a single step.
 */
const GAMUT_MAPPED = [
  '--color-amber-400',
  '--color-yellow-400',
  '--color-yellow-500',
];

describe('the hex comments of the primitives match 0.8.0', () => {
  const reference = hexComments(
    readFileSync(join(REFERENCE_DIR, 'theme.css'), 'utf8'),
  );
  const generated = hexComments(
    readFileSync(join(PACKAGE_ROOT, 'styles', 'theme.css'), 'utf8'),
  );

  it('keeps every 0.8.0 hex comment on the same token', () => {
    expect(reference.size).toBeGreaterThan(300);
    for (const [name, hex] of reference) {
      if (GAMUT_MAPPED.includes(name)) continue;
      expect(generated.get(name), name).toBe(hex);
    }
  });

  it('moves an out-of-gamut colour by at most one step per channel', () => {
    for (const name of GAMUT_MAPPED) {
      const before = channels(reference.get(name) ?? '');
      const after = channels(generated.get(name) ?? '');
      expect(after, name).toHaveLength(3);
      after.forEach((v, i) =>
        expect(Math.abs(v - (before[i] ?? NaN)), name).toBeLessThanOrEqual(1),
      );
    }
  });
});

describe('every 0.8.0 comment survives in the generated CSS', () => {
  it.each(FILES)('%s', (file) => {
    const generated = flat(
      paragraphs(readFileSync(join(PACKAGE_ROOT, 'styles', file), 'utf8')).join(
        ' ',
      ),
    );
    for (const p of paragraphs(
      readFileSync(join(REFERENCE_DIR, file), 'utf8'),
    )) {
      expect(generated, p).toContain(p);
    }
  });
});
