import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type {
  ColorMode,
  PrimitiveToken,
  SemanticToken,
  TokenGraph,
  TokenValue,
} from '../../graph/types.js';
import { buildGraph } from '../css/build-graph.js';
import {
  aliasToCssName,
  fmt,
  formatDtcgValue,
  isAlias,
  pathToCssName,
} from './values.js';

/** DTCG files by path relative to the tokens dir, 'primitive/color.json' → JSON. */
export type DtcgFiles = Record<string, unknown>;
/** Written to @theme by the pipeline: the graph's primitives. */
export const THEME_BLOCK_PRIMITIVES: readonly string[] = [
  'primitive/color.json',
  'primitive/radius.json',
  'primitive/font.json',
  'primitive/spacing.json',
];
/** Written to :root (shadows): the CSS parser saw them as semantics. */
export const ROOT_PRIMITIVES: readonly string[] = ['primitive/shadow.json'];

interface Token {
  $type: string;
  $value: unknown;
  $extensions?: Record<string, unknown>;
}
const isToken = (v: unknown): v is Token =>
  typeof v === 'object' && v !== null && '$value' in v;

function* walk(
  group: unknown,
  path: string[] = [],
): Generator<[string[], Token]> {
  if (typeof group !== 'object' || group === null) return;
  for (const [key, node] of Object.entries(group)) {
    if (key.startsWith('$')) continue;
    if (isToken(node)) yield [[...path, key], node];
    else yield* walk(node, [...path, key]);
  }
}

export function listDtcgFiles(tokensDir: string): string[] {
  const out: string[] = [];
  for (const dir of ['primitive', 'semantic', 'themes']) {
    const full = join(tokensDir, dir);
    if (!existsSync(full)) continue;
    for (const file of readdirSync(full).sort()) {
      if (file.endsWith('.json')) out.push(`${dir}/${file}`);
    }
  }
  return out;
}

export function readDtcgFiles(tokensDir: string): DtcgFiles {
  return Object.fromEntries(
    listDtcgFiles(tokensDir).map((rel) => [
      rel,
      JSON.parse(readFileSync(join(tokensDir, rel), 'utf8')) as unknown,
    ]),
  );
}

/** The CSS text the pipeline writes for a token (references kept). */
export function tokenCss(t: Token): string {
  const css = (
    t.$extensions?.['com.gremorie.css'] as { value?: string } | undefined
  )?.value;
  if (css !== undefined) return css;
  const derive = t.$extensions?.['com.gremorie.derive'] as
    { from: string; multiply: number } | undefined;
  if (derive) {
    return `calc(var(${aliasToCssName(derive.from)}) * ${fmt(derive.multiply)})`;
  }
  if (isAlias(t.$value)) return `var(${aliasToCssName(t.$value)})`;
  return formatDtcgValue(t.$type, t.$value);
}

const semanticValue = (t: Token): TokenValue =>
  isAlias(t.$value)
    ? { kind: 'reference', targetName: aliasToCssName(t.$value) }
    : { kind: 'literal', raw: tokenCss(t) };

export function buildDtcgGraph(files: DtcgFiles): TokenGraph {
  const primitives: PrimitiveToken[] = [];
  const semantics: SemanticToken[] = [];
  const addSemantics = (
    group: unknown,
    theme: string,
    mode: ColorMode,
    sourceFile: string,
  ) => {
    for (const [path, t] of walk(group)) {
      semantics.push({
        kind: 'semantic',
        name: pathToCssName(path),
        value: semanticValue(t),
        theme,
        mode,
        sourceFile,
        sourceLine: 0, // JSON tokens have no CSS line
      });
    }
  };
  for (const rel of THEME_BLOCK_PRIMITIVES) {
    for (const [path, t] of walk(files[rel])) {
      primitives.push({
        kind: 'primitive',
        name: pathToCssName(path),
        value: tokenCss(t),
        theme: 'default',
        mode: 'light',
        sourceFile: rel,
        sourceLine: 0,
      });
    }
  }
  for (const rel of ROOT_PRIMITIVES) {
    addSemantics(files[rel], 'default', 'light', rel);
  }
  addSemantics(
    files['semantic/light.json'],
    'default',
    'light',
    'semantic/light.json',
  );
  addSemantics(
    files['semantic/dark.json'],
    'default',
    'dark',
    'semantic/dark.json',
  );
  const themeFiles = Object.keys(files)
    .filter((f) => f.startsWith('themes/'))
    .sort();
  for (const rel of themeFiles) {
    const theme = rel.slice('themes/'.length, -'.json'.length);
    const data = files[rel] as { light?: unknown; dark?: unknown };
    addSemantics(data.light, theme, 'light', rel);
    addSemantics(data.dark, theme, 'dark', rel);
  }
  return buildGraph({ primitives, semantics, components: [] });
}
