import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { PRIMITIVE_COLOR_RAMPS } from '../components/primitive-color-data';

/**
 * Guard over the primitive colour data the Tokens docs render.
 *
 * `components/primitive-color-data.ts` is a hand-kept copy of the primitive
 * block of the generated `packages/tokens/styles/theme.css`, where each
 * primitive carries its sRGB hex as a trailing comment. A copy drifts quietly:
 * amber-500 once read 76.9% and #FE9A00 here while the shipped token was
 * 0.766 and #fc9900. Every documented stop must match the CSS, and every
 * documented ramp must list all of the stops the CSS declares for it.
 */
const THEME_CSS = join(
  __dirname,
  '..',
  '..',
  '..',
  'packages',
  'tokens',
  'styles',
  'theme.css',
);

/**
 * Ramps the palette page leaves out on purpose. `brand` is a slot that a
 * consumer overrides; by default it repeats the indigo ramp, which the page
 * already lists.
 */
const UNDOCUMENTED_RAMPS = ['brand'];

interface CssPrimitive {
  oklch: string;
  hex: string | undefined;
}

function cssPrimitives(): Map<string, CssPrimitive> {
  const css = readFileSync(THEME_CSS, 'utf8');
  const out = new Map<string, CssPrimitive>();
  const declaration =
    /(--color-[a-z]+-\d+):\s*(oklch\([^)]*\));(?:[ \t]*\/\*\s*(#[0-9a-fA-F]{6,8})\s*\*\/)?/g;
  for (const [, token, oklch, hex] of css.matchAll(declaration)) {
    // The first declaration is the primitive; later ones are overrides.
    if (token && oklch && !out.has(token)) out.set(token, { oklch, hex });
  }
  return out;
}

/** `oklch(76.9% 0.188 70.08)` and `oklch(0.769 0.188 70.08)` read the same. */
function components(oklch: string): number[] {
  const parts = oklch
    .replace(/^oklch\(|\)$/g, '')
    .trim()
    .split(/\s+/);
  return parts.slice(0, 3).map((part, i) => {
    const n = Number.parseFloat(part);
    return i === 0 && part.endsWith('%') ? n / 100 : n;
  });
}

describe('primitive colour data mirrors theme.css', () => {
  const css = cssPrimitives();
  const ramps = Object.entries(PRIMITIVE_COLOR_RAMPS);

  it('finds the primitives in theme.css', () => {
    expect(css.size).toBeGreaterThan(0);
    expect(ramps.length).toBeGreaterThan(0);
  });

  it('documents every ramp theme.css declares', () => {
    const declared = new Set(
      [...css.keys()].map((t) => t.replace(/^--color-|-\d+$/g, '')),
    );
    for (const ramp of UNDOCUMENTED_RAMPS) declared.delete(ramp);
    expect(Object.keys(PRIMITIVE_COLOR_RAMPS).sort()).toEqual(
      [...declared].sort(),
    );
  });

  for (const [ramp, stops] of ramps) {
    it(`${ramp}: lists every stop theme.css declares`, () => {
      const prefix = `--color-${ramp}-`;
      const declared = [...css.keys()].filter((t) => t.startsWith(prefix));
      expect(stops.map((s) => s.token).sort()).toEqual(declared.sort());
    });

    it(`${ramp}: has the OKLCH and hex of theme.css`, () => {
      for (const stop of stops) {
        const source = css.get(stop.token);
        expect(source, stop.token).toBeDefined();
        if (!source) continue;
        const documented = components(stop.oklch);
        const shipped = components(source.oklch);
        documented.forEach((value, i) =>
          expect(value, `${stop.token} component ${i}`).toBeCloseTo(
            shipped[i] ?? Number.NaN,
            9,
          ),
        );
        expect(stop.hex.toLowerCase(), stop.token).toBe(
          source.hex?.toLowerCase(),
        );
      }
    });
  }
});
