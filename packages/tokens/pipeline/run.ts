import StyleDictionary from 'style-dictionary';
import type {
  DesignTokens,
  Dictionary,
  TransformedToken,
} from 'style-dictionary/types';
import { formatValue } from './css-value.ts';
import {
  aliasPath,
  BUILD_EXTENSION,
  CSS_EXTENSION,
  DERIVE_EXTENSION,
  MODES,
  PRIMITIVE_FILES,
  type BuildMeta,
  type CssBlock,
  type Derive,
  type DtcgDimension,
  type DtcgType,
  type DtcgValue,
  type Layer,
  type Mode,
  type ThemeId,
} from './model.ts';
import { pathToCssName } from './names.ts';
import { composeTokens, type TokenSource } from './source.ts';
import { round6 } from './format-number.ts';

export interface RunToken {
  path: string[];
  name: string;
  type: DtcgType;
  layer: Layer;
  file: string;
  order: number;
  /** Resolved: aliases followed, derivations applied. */
  value: DtcgValue;
  /** As written in the source: an alias '{a.b}' or a value. */
  original: DtcgValue | string;
  cssValue?: string;
  derive?: Derive;
  description?: string;
}
export interface Run {
  theme: ThemeId;
  mode: Mode;
  tokens: RunToken[];
  byName: ReadonlyMap<string, RunToken>;
}
export interface BlockSpec {
  destination: string;
  selector: string;
  include: (t: RunToken) => boolean;
  description?: string;
  /** Append the sRGB hex of literal colours as a comment (the @theme block). */
  hex?: boolean;
}

/** The CSS block a token is written to in the base layer. */
export const blockOf = (t: RunToken): CssBlock =>
  t.layer === 'primitive' ? (PRIMITIVE_FILES[t.file] ?? '@theme') : ':root';

export function toRunToken(t: TransformedToken): RunToken {
  // Style Dictionary resolves references inside $extensions too, so the
  // extensions are read from the original token, where an alias stays an alias.
  const original = t.original as {
    $value: DtcgValue | string;
    $extensions?: Record<string, unknown>;
  };
  const ext = original.$extensions ?? {};
  const build = ext[BUILD_EXTENSION] as BuildMeta | undefined;
  if (!build) throw new Error(`${t.path.join('.')} has no build metadata`);
  const css = ext[CSS_EXTENSION] as { value?: string } | undefined;
  const derive = ext[DERIVE_EXTENSION] as Derive | undefined;
  const token: RunToken = {
    path: [...t.path],
    name: pathToCssName(t.path),
    type: t.$type as DtcgType,
    layer: build.layer,
    file: build.file,
    order: build.order,
    value: t.$value as DtcgValue,
    original: original.$value,
  };
  if (css?.value !== undefined) token.cssValue = css.value;
  if (derive) token.derive = derive;
  if (typeof t.$description === 'string') token.description = t.$description;
  return token;
}

export function applyDerive(tokens: RunToken[]): RunToken[] {
  const byPath = new Map(tokens.map((t) => [t.path.join('.'), t]));
  return tokens.map((t) => {
    if (!t.derive) return t;
    const base = byPath.get(aliasPath(t.derive.from).join('.'));
    if (!base || base.type !== 'dimension') {
      throw new Error(
        `${t.name}: derive.from ${t.derive.from} is not a dimension`,
      );
    }
    const d = base.value as DtcgDimension;
    return {
      ...t,
      value: { value: round6(d.value * t.derive.multiply), unit: d.unit },
    };
  });
}

/** The resolved value as CSS text (the raw CSS extension wins if present). */
export const resolvedCss = (t: RunToken): string =>
  t.cssValue ?? formatValue(t.type, t.value);

type FormatArgs = { dictionary: Dictionary; options: Record<string, unknown> };
const TRANSFORMS = {
  // Without a name transform every token is named after its last key, and
  // Style Dictionary reports collisions (color.gray.50 and color.red.50).
  'gremorie/name': {
    type: 'name' as const,
    transform: (t: TransformedToken) => pathToCssName(t.path).slice(2),
  },
};
const FORMATS: Record<string, (args: FormatArgs) => string> = {
  'gremorie/run': ({ dictionary }) =>
    JSON.stringify(dictionary.allTokens.map(toRunToken)),
};

/** One Style Dictionary run for a theme and mode. */
export async function runTheme(
  source: TokenSource,
  theme: ThemeId,
  mode: Mode,
  blocks: readonly BlockSpec[] = [],
): Promise<{ run: Run; blocks: Record<string, string> }> {
  const sd = new StyleDictionary(
    {
      tokens: composeTokens(source, theme, mode) as DesignTokens,
      usesDtcg: true,
      log: { verbosity: 'silent', warnings: 'error' },
      hooks: { formats: FORMATS, transforms: TRANSFORMS },
      platforms: {
        gremorie: {
          transforms: ['gremorie/name'],
          files: [
            { destination: 'run.json', format: 'gremorie/run' },
            ...blocks.map((b) => ({
              destination: b.destination,
              format: 'gremorie/css-block',
              filter: (t: TransformedToken) => b.include(toRunToken(t)),
              options: {
                selector: b.selector,
                description: b.description,
                hex: b.hex,
              },
            })),
          ],
        },
      },
    },
    { init: false },
  );
  await sd.init();
  const outputs = await sd.formatPlatform('gremorie');
  const byDestination = new Map(
    outputs.map((o) => [o.destination ?? '', String(o.output)]),
  );
  const runJson = byDestination.get('run.json');
  if (runJson === undefined) {
    throw new Error(`${theme}/${mode}: Style Dictionary wrote no run.json`);
  }
  const tokens = applyDerive(
    (JSON.parse(runJson) as RunToken[]).sort((a, b) => a.order - b.order),
  );
  const out: Record<string, string> = {};
  for (const b of blocks) {
    out[b.destination] = byDestination.get(b.destination) ?? '';
  }
  return {
    run: {
      theme,
      mode,
      tokens,
      byName: new Map(tokens.map((t) => [t.name, t])),
    },
    blocks: out,
  };
}

/** Every theme and mode of the source, keyed 'theme/mode'. */
export async function runAll(source: TokenSource): Promise<Map<string, Run>> {
  const runs = new Map<string, Run>();
  for (const theme of source.themes) {
    for (const mode of MODES) {
      runs.set(`${theme}/${mode}`, (await runTheme(source, theme, mode)).run);
    }
  }
  return runs;
}
