import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { collectDeclarations, normalizeValue } from '../../pipeline/compare.ts';
import { fmt } from '../../pipeline/format-number.ts';
import { REFERENCE_DIR } from './paths.ts';

const blocks = new Map<string, Map<string, string>>();
for (const file of [
  'theme.css',
  ...readdirSync(join(REFERENCE_DIR, 'themes')).map((f) => `themes/${f}`),
]) {
  for (const [selector, decls] of collectDeclarations(
    readFileSync(join(REFERENCE_DIR, file), 'utf8'),
  )) {
    blocks.set(selector, decls);
  }
}

const evaluateCalc = (value: string) =>
  value.replace(
    /calc\((-?[\d.]+)(px|rem) \* ([\d.]+)\)/g,
    (_m, n: string, unit: string, f: string) =>
      `${fmt(Number(n) * Number(f))}${unit}`,
  );

/**
 * Every custom property the browser would compute on <html> for a theme and
 * mode: @theme, then :root, then .dark, then the theme's light block, then its
 * dark block (`:root[data-theme]` outranks `.dark`), with var() substituted.
 */
export function referenceValues(
  theme: string,
  mode: 'light' | 'dark',
): Map<string, string> {
  const merged = new Map<string, string>();
  const stack = ['@theme', ':root'];
  if (mode === 'dark') stack.push('.dark');
  if (theme !== 'default') {
    stack.push(`:root[data-theme='${theme}']`);
    if (mode === 'dark') stack.push(`:root[data-theme='${theme}'].dark`);
  }
  for (const selector of stack) {
    for (const [name, value] of blocks.get(selector) ?? []) {
      merged.set(name, value);
    }
  }
  const resolve = (value: string, seen: Set<string>): string =>
    value.replace(/var\((--[\w-]+)\)/g, (_m, name: string) => {
      if (seen.has(name)) throw new Error(`cycle at ${name}`);
      const target = merged.get(name);
      if (target === undefined) throw new Error(`unknown ${name}`);
      return resolve(target, new Set([...seen, name]));
    });
  const out = new Map<string, string>();
  for (const [name, value] of merged) {
    out.set(
      name,
      evaluateCalc(normalizeValue(resolve(value, new Set([name])))),
    );
  }
  return out;
}
