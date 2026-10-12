import postcss, { type ChildNode, type Container } from 'postcss';
import { fmt } from './format-number.ts';

export type DeclMap = Map<string, Map<string, string>>;

export interface IntentionalChange {
  file: string;
  selector: string;
  prop: string;
  /** New value, or null when the token was removed on purpose. */
  to: string | null;
  reason: string;
}

export interface CompareOptions {
  allowExtraSelectors?: string[];
  /** Paths, without quotes, e.g. './themes/purple.css'. */
  allowExtraImports?: string[];
  intentional?: IntentionalChange[];
}

export type DifferenceKind =
  | 'missing-selector'
  | 'extra-selector'
  | 'missing'
  | 'extra'
  | 'changed'
  | 'skeleton';

export interface Difference {
  file: string;
  kind: DifferenceKind;
  selector: string;
  prop?: string;
  expected?: string;
  actual?: string;
}

const PLAIN_NUMBER = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i;

/**
 * A plain number, or a percentage scaled to its channel's range. Anything
 * else (units, keywords like `none`, functions) is kept as written, so two
 * different raw values can never collapse to the same text.
 */
function channel(raw: string, percentOf: number | null): string {
  const isPercent = raw.endsWith('%');
  if (isPercent && percentOf === null) return raw;
  const text = isPercent ? raw.slice(0, -1) : raw;
  if (!PLAIN_NUMBER.test(text)) return raw;
  const n = Number(text);
  return fmt(isPercent ? (n * (percentOf ?? 1)) / 100 : n);
}

/**
 * Hue in degrees: a bare number or a number followed by `deg`. Other angle
 * units, and a `deg` suffix on something that is not a number, stay exactly
 * as written.
 */
function hue(raw: string): string {
  if (!raw.toLowerCase().endsWith('deg')) return channel(raw, null);
  const degrees = raw.slice(0, -3);
  return PLAIN_NUMBER.test(degrees) ? channel(degrees, null) : raw;
}

/**
 * Normalizes the inside of `oklch(...)`. Percentages follow CSS Color 4
 * (L: 100% = 1, C: 100% = 0.4, alpha: 100% = 1). Unexpected shapes (not
 * exactly three channels, nested functions) are returned unchanged.
 */
function normalizeOklch(match: string, inner: string): string {
  if (inner.includes('(')) return match;
  const parts = inner.split('/').map((s) => s.trim());
  if (parts.length > 2) return match;
  const [channels = '', alphaRaw] = parts;
  const lch = channels.split(' ').filter((s) => s !== '');
  if (lch.length !== 3 || alphaRaw === '') return match;
  const [l = '', c = '', h = ''] = lch;
  let alpha = '';
  if (alphaRaw !== undefined) {
    const a = channel(alphaRaw, 1);
    if (a !== '1') alpha = ` / ${a}`;
  }
  return `oklch(${channel(l, 1)} ${channel(c, 0.4)} ${hue(h)}${alpha})`;
}

/** Value text with formatting, quotes, comments and number notation erased. */
export function normalizeValue(raw: string): string {
  return raw
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/["']/g, '')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s*,\s*/g, ', ')
    .replace(/\s*\/\s*/g, ' / ')
    .replace(/oklch\(([^)]*)\)/gi, (match: string, inner: string) =>
      normalizeOklch(match, inner),
    );
}

export function selectorKey(node: ChildNode): string | null {
  if (node.type === 'rule') {
    return node.selector.replace(/"/g, "'").replace(/\s+/g, ' ').trim();
  }
  if (node.type === 'atrule' && node.name === 'theme') {
    return node.params ? `@theme ${node.params}` : '@theme';
  }
  return null;
}

/**
 * Custom properties per token block. A selector that appears more than once
 * is merged into one block, later declarations winning, as in the cascade.
 */
export function collectDeclarations(css: string): DeclMap {
  const map: DeclMap = new Map();
  postcss.parse(css).each((node) => {
    const key = selectorKey(node);
    if (key === null) return;
    const decls = map.get(key) ?? new Map<string, string>();
    (node as Container).each((child) => {
      if (child.type === 'decl' && child.prop.startsWith('--')) {
        const value = normalizeValue(child.value);
        decls.set(child.prop, child.important ? `${value} !important` : value);
      }
    });
    map.set(key, decls);
  });
  return map;
}

const squash = (s: string) =>
  s
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};:,>])\s*/g, '$1')
    .replace(/"/g, "'")
    .trim();

function withoutComments<T extends ChildNode>(node: T): T {
  const clone = node.clone() as T;
  if ('walkComments' in clone) {
    (clone as unknown as Container).walkComments((c) => {
      c.remove();
    });
  }
  return clone;
}

export function skeleton(css: string): string[] {
  const out: string[] = [];
  postcss.parse(css).each((node) => {
    if (node.type === 'comment') return;
    if (node.type === 'atrule' && node.name === 'import') {
      out.push(`@import ${node.params.replace(/"/g, "'").trim()}`);
      return;
    }
    const key = selectorKey(node);
    if (key !== null) {
      const clone = withoutComments(node) as unknown as Container;
      clone.walkDecls((d) => {
        if (d.prop.startsWith('--')) d.remove();
      });
      out.push(`${key}{${squash((clone.nodes ?? []).map(String).join(';'))}}`);
      return;
    }
    out.push(squash(withoutComments(node).toString()));
  });
  return out;
}

export function compareCss(
  file: string,
  reference: string,
  generated: string,
  options: CompareOptions = {},
): Difference[] {
  const diffs: Difference[] = [];
  const ref = collectDeclarations(reference);
  const gen = collectDeclarations(generated);

  for (const change of options.intentional ?? []) {
    if (change.file !== file) continue;
    const block = ref.get(change.selector) ?? new Map<string, string>();
    if (change.to === null) block.delete(change.prop);
    else block.set(change.prop, normalizeValue(change.to));
    ref.set(change.selector, block);
  }

  for (const [selector, decls] of ref) {
    const other = gen.get(selector);
    if (!other) {
      diffs.push({ file, kind: 'missing-selector', selector });
      continue;
    }
    for (const [prop, expected] of decls) {
      const actual = other.get(prop);
      if (actual === undefined) {
        diffs.push({ file, kind: 'missing', selector, prop, expected });
      } else if (actual !== expected) {
        diffs.push({ file, kind: 'changed', selector, prop, expected, actual });
      }
    }
    for (const [prop, actual] of other) {
      if (!decls.has(prop)) {
        diffs.push({ file, kind: 'extra', selector, prop, actual });
      }
    }
  }
  const allowedSelectors = new Set(options.allowExtraSelectors ?? []);
  for (const selector of gen.keys()) {
    if (!ref.has(selector) && !allowedSelectors.has(selector)) {
      diffs.push({ file, kind: 'extra-selector', selector });
    }
  }

  const allowedImports = new Set(
    (options.allowExtraImports ?? []).map((p) => `@import '${p}'`),
  );
  const expected = skeleton(reference);
  const actual = skeleton(generated).filter(
    (n) =>
      !allowedImports.has(n) && !allowedSelectors.has(n.split('{')[0] ?? ''),
  );
  for (let i = 0; i < Math.max(expected.length, actual.length); i++) {
    if (expected[i] !== actual[i]) {
      const d: Difference = { file, kind: 'skeleton', selector: `#${i}` };
      if (expected[i] !== undefined) d.expected = expected[i];
      if (actual[i] !== undefined) d.actual = actual[i];
      diffs.push(d);
    }
  }
  return diffs;
}
