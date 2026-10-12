import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  aliasPath,
  BUILD_EXTENSION,
  DERIVE_EXTENSION,
  DTCG_TYPES,
  isAlias,
  isToken,
  PRIMITIVE_FILES,
  SEMANTIC_FILES,
  THEMES,
  themeFile,
  type Derive,
  type DtcgGroup,
  type DtcgToken,
  type DtcgType,
  type Layer,
  type Mode,
  type NamedTheme,
  type ThemeId,
} from './model.ts';
import { pathToCssName } from './names.ts';
import { setPath } from './tree.ts';

export interface TokenSource {
  root: string;
  themes: readonly ThemeId[];
  files: Record<string, DtcgGroup>;
}
export interface FlatToken {
  path: string[];
  token: DtcgToken;
  file: string;
}

const named = (themes: readonly ThemeId[]) =>
  themes.filter((t): t is NamedTheme => t !== 'default');

export function createSource(
  files: Record<string, DtcgGroup>,
  themes: readonly ThemeId[] = THEMES,
): TokenSource {
  return { root: '', themes, files };
}

export function loadSource(
  root: string,
  themes: readonly ThemeId[] = THEMES,
): TokenSource {
  const rels = [
    ...Object.keys(PRIMITIVE_FILES),
    SEMANTIC_FILES.light,
    SEMANTIC_FILES.dark,
    ...named(themes).map(themeFile),
  ];
  const files: Record<string, DtcgGroup> = {};
  for (const rel of rels) {
    const path = join(root, 'tokens', rel);
    if (!existsSync(path)) throw new Error(`Missing token file tokens/${rel}`);
    files[rel] = JSON.parse(readFileSync(path, 'utf8')) as DtcgGroup;
  }
  return { root, themes, files };
}

export function flatten(
  group: DtcgGroup,
  file: string,
  prefix: string[] = [],
  inherited?: DtcgType,
): FlatToken[] {
  const out: FlatToken[] = [];
  const groupType = (group.$type as DtcgType | undefined) ?? inherited;
  for (const [key, node] of Object.entries(group)) {
    if (key.startsWith('$')) continue;
    if (isToken(node)) {
      const token =
        node.$type || !groupType ? node : { ...node, $type: groupType };
      out.push({ path: [...prefix, key], token, file });
    } else if (typeof node === 'object' && node !== null) {
      out.push(
        ...flatten(node as DtcgGroup, file, [...prefix, key], groupType),
      );
    }
  }
  return out;
}

const fileOf = (source: TokenSource, rel: string): DtcgGroup =>
  source.files[rel] ?? {};

const modeGroup = (data: DtcgGroup, mode: Mode): DtcgGroup =>
  (data[mode] ?? {}) as DtcgGroup;

/** Token layers for one theme and mode, lowest precedence first. */
export function layerTokens(
  source: TokenSource,
  theme: ThemeId,
  mode: Mode,
): { layer: Layer; tokens: FlatToken[] }[] {
  const layers: { layer: Layer; tokens: FlatToken[] }[] = [
    {
      layer: 'primitive',
      tokens: Object.keys(PRIMITIVE_FILES).flatMap((rel) =>
        flatten(fileOf(source, rel), rel),
      ),
    },
    {
      layer: 'semantic-light',
      tokens: flatten(
        fileOf(source, SEMANTIC_FILES.light),
        SEMANTIC_FILES.light,
      ),
    },
  ];
  if (mode === 'dark') {
    layers.push({
      layer: 'semantic-dark',
      tokens: flatten(fileOf(source, SEMANTIC_FILES.dark), SEMANTIC_FILES.dark),
    });
  }
  if (theme !== 'default') {
    const rel = themeFile(theme);
    const data = fileOf(source, rel);
    layers.push({
      layer: 'theme-light',
      tokens: flatten(modeGroup(data, 'light'), rel),
    });
    if (mode === 'dark') {
      layers.push({
        layer: 'theme-dark',
        tokens: flatten(modeGroup(data, 'dark'), rel),
      });
    }
  }
  return layers;
}

const SEGMENT = /^[a-z0-9][a-z0-9-]*$/;
const key = (path: string[]) => path.join('.');

export function validateSource(source: TokenSource): string[] {
  const problems: string[] = [];
  const base = new Map<string, FlatToken>();
  for (const { tokens } of layerTokens(source, 'default', 'light')) {
    for (const t of tokens) base.set(key(t.path), t);
  }
  const overrides: FlatToken[] = [
    ...flatten(fileOf(source, SEMANTIC_FILES.dark), SEMANTIC_FILES.dark),
    ...named(source.themes).flatMap((theme) => {
      const rel = themeFile(theme);
      const data = fileOf(source, rel);
      return [
        ...flatten(modeGroup(data, 'light'), rel),
        ...flatten(modeGroup(data, 'dark'), rel),
      ];
    }),
  ];

  // Two paths must never collapse to the same CSS custom property.
  const owners = new Map<string, FlatToken>();
  for (const t of [...base.values(), ...overrides]) {
    const name = pathToCssName(t.path);
    const owner = owners.get(name);
    if (owner !== undefined && key(owner.path) !== key(t.path)) {
      problems.push(
        `${name} is declared by both ${key(owner.path)} (${owner.file}) and ${key(t.path)} (${t.file})`,
      );
    }
    if (owner === undefined) owners.set(name, t);
  }

  for (const t of [...base.values(), ...overrides]) {
    const where = `${t.file}: ${key(t.path)}`;
    if (t.path.some((segment) => !SEGMENT.test(segment))) {
      problems.push(`${where} has an invalid name`);
    }
    if (!DTCG_TYPES.includes(t.token.$type)) {
      problems.push(`${where} has unsupported $type ${String(t.token.$type)}`);
      continue;
    }
    if (isAlias(t.token.$value)) {
      const target = base.get(key(aliasPath(t.token.$value)));
      if (!target) {
        problems.push(
          `${where} points at ${t.token.$value}, which does not exist`,
        );
      } else if (target.token.$type !== t.token.$type) {
        problems.push(
          `${where} is ${t.token.$type} but ${t.token.$value} is ${target.token.$type}`,
        );
      }
    }
    const derive = t.token.$extensions?.[DERIVE_EXTENSION] as
      Derive | undefined;
    if (derive) {
      const from = isAlias(derive.from)
        ? base.get(key(aliasPath(derive.from)))
        : undefined;
      if (!from || from.token.$type !== 'dimension') {
        problems.push(`${where} derives from ${derive.from}, not a dimension`);
      }
    }
  }
  // An override whose path the base layer lacks is an orphan, and one that
  // changes the type of its base token would change what the name means.
  for (const t of overrides) {
    const target = base.get(key(t.path));
    if (!target) {
      problems.push(
        `${t.file}: ${key(t.path)} overrides nothing in the base layer`,
      );
    } else if (target.token.$type !== t.token.$type) {
      problems.push(
        `${t.file}: ${key(t.path)} is ${t.token.$type} but the base token is ${target.token.$type}`,
      );
    }
  }

  // A path cannot be a token in one file and a group in another: composing
  // them would overwrite one with the other.
  const tokenAt = new Map<string, FlatToken>();
  for (const t of [...base.values(), ...overrides]) {
    if (!tokenAt.has(key(t.path))) tokenAt.set(key(t.path), t);
  }
  const nested = new Set<string>();
  for (const t of [...base.values(), ...overrides]) {
    for (let i = 1; i < t.path.length; i++) {
      const owner = tokenAt.get(key(t.path.slice(0, i)));
      if (!owner) continue;
      const problem = `${t.file}: ${key(t.path)} is nested under ${key(owner.path)}, a token in ${owner.file}`;
      if (!nested.has(problem)) {
        nested.add(problem);
        problems.push(problem);
      }
    }
  }

  // A cycle shared by several themes and modes (one in the base layer) is
  // reported once, under the first theme and mode that has it.
  const reported = new Set<string>();
  for (const theme of source.themes) {
    for (const mode of ['light', 'dark'] as const) {
      const merged = new Map<string, DtcgToken>();
      for (const { tokens } of layerTokens(source, theme, mode)) {
        for (const t of tokens) merged.set(key(t.path), t.token);
      }
      for (const start of merged.keys()) {
        const chain = [start];
        let token = merged.get(start);
        while (token && isAlias(token.$value)) {
          const next = key(aliasPath(token.$value));
          if (chain.includes(next)) {
            const cycle = [...chain.slice(chain.indexOf(next)), next];
            const id = [...new Set(cycle)].sort().join();
            if (!reported.has(id)) {
              reported.add(id);
              problems.push(
                `${theme}/${mode}: reference cycle ${cycle.join(' → ')}`,
              );
            }
            break;
          }
          chain.push(next);
          token = merged.get(next);
        }
      }
    }
  }
  return problems;
}

/** One DTCG tree for a theme and mode, each token tagged with its layer. */
export function composeTokens(
  source: TokenSource,
  theme: ThemeId,
  mode: Mode,
): DtcgGroup {
  const tree: DtcgGroup = {};
  let order = 0;
  for (const { layer, tokens } of layerTokens(source, theme, mode)) {
    for (const t of tokens) {
      const token = structuredClone(t.token);
      token.$extensions = {
        ...(token.$extensions ?? {}),
        [BUILD_EXTENSION]: { layer, file: t.file, order: order++ },
      };
      setPath(tree, t.path, token);
    }
  }
  return tree;
}
