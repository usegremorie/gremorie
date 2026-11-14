import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  resolveThemeRows,
  SEMANTIC_THEMES,
} from '../components/semantic-color-data';

/**
 * Guard over the semantic color data the Tokens docs render.
 *
 * `components/semantic-color-data.ts` is a hand-kept copy of the semantic
 * blocks of the generated CSS: the base `:root` and `.dark` of
 * `packages/tokens/styles/theme.css`, and the two blocks of each
 * `styles/themes/<id>.css`. Its resolver must give, for every theme, mode and
 * token, what the CSS cascade gives: the same primitive, or the same literal
 * color.
 */
const STYLES = join(
  __dirname,
  '..',
  '..',
  '..',
  'packages',
  'tokens',
  'styles',
);

type Block = Map<string, string>;

/** The custom properties declared in the block that opens with `selector {`. */
function block(css: string, selector: string): Block {
  const start = css.indexOf(`\n${selector} {\n`);
  if (start < 0) throw new Error(`No block ${selector}`);
  const end = css.indexOf('\n}\n', start);
  const body = css.slice(start, end).replace(/\/\*[\s\S]*?\*\//g, '');
  const out: Block = new Map();
  for (const [, name, value] of body.matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g)) {
    if (name && value) out.set(name.slice(2), value.trim());
  }
  return out;
}

/** CSS cascade for one theme and mode: later layers win. */
function cascade(layers: Block[]): Block {
  const out: Block = new Map();
  for (const layer of layers) for (const [k, v] of layer) out.set(k, v);
  return out;
}

/**
 * The value a token ends at: a primitive name (`gray-900`) or a literal
 * color with its channels normalized.
 */
function resolve(
  values: Block,
  token: string,
  seen = new Set<string>(),
): string {
  const value = values.get(token);
  if (value === undefined) throw new Error(`--${token} is not declared`);
  const ref = /^var\(--([a-z0-9-]+)\)$/.exec(value)?.[1];
  if (ref === undefined) return normalize(value);
  const primitive = /^color-(.+)$/.exec(ref)?.[1];
  if (primitive !== undefined) return primitive;
  if (seen.has(ref)) throw new Error(`--${token}: alias loop`);
  seen.add(ref);
  return resolve(values, ref, seen);
}

/** `oklch(1 0 0 / 10%)` and `oklch(1 0 0 / 0.1)` read the same. */
function normalize(value: string): string {
  const m = /^oklch\(([^)]*)\)$/.exec(value);
  if (!m?.[1]) return value;
  const [channels = '', alpha] = m[1].split('/').map((s) => s.trim());
  const num = (raw: string, percentOf: number) =>
    raw.endsWith('%')
      ? (Number.parseFloat(raw) * percentOf) / 100
      : Number.parseFloat(raw);
  const [l = '', c = '', h = ''] = channels.split(/\s+/);
  const parts = [num(l, 1), num(c, 0.4), num(h, 1)].map((n) =>
    Number(n.toFixed(6)),
  );
  const a = alpha === undefined ? 1 : Number(num(alpha, 1).toFixed(6));
  return `oklch(${parts.join(' ')}${a === 1 ? '' : ` / ${a}`})`;
}

const base = readFileSync(join(STYLES, 'theme.css'), 'utf8');
const baseLight = block(base, ':root');
const baseDark = block(base, '.dark');

describe('semantic color data mirrors the generated CSS', () => {
  for (const theme of SEMANTIC_THEMES) {
    const own =
      theme.id === 'default'
        ? { light: new Map<string, string>(), dark: new Map<string, string>() }
        : (() => {
            const css = readFileSync(
              join(STYLES, 'themes', `${theme.id}.css`),
              'utf8',
            );
            const root = `:root[data-theme='${theme.id}']`;
            return {
              light: block(css, root),
              dark: block(css, `${root}.dark`),
            };
          })();
    const modes = {
      light: cascade([baseLight, own.light]),
      dark: cascade([baseLight, baseDark, own.light, own.dark]),
    };

    it(`${theme.id}: every token resolves as in the CSS`, () => {
      for (const row of resolveThemeRows(theme)) {
        const token = row.token.slice(2);
        for (const mode of ['light', 'dark'] as const) {
          expect(normalize(row[mode].ref), `${theme.id} ${mode} ${token}`).toBe(
            resolve(modes[mode], token),
          );
        }
      }
    });
  }
});
