import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { wrapComment } from './css.ts';
import { loadRoleMap } from './m3.ts';
import { renderTokensJson } from './platforms/json.ts';
import { renderKotlin } from './platforms/kotlin.ts';
import { buildPlatformModel } from './platforms/model.ts';
import { renderSwift } from './platforms/swift.ts';
import { renderIndexDts, renderIndexJs } from './platforms/ts.ts';
import {
  ROOT_PLACEMENT,
  themeFile,
  type DtcgGroup,
  type NamedTheme,
} from './model.ts';
import { formatCss } from './prettier.ts';
import { blockOf, runTheme, type Run } from './run.ts';
import { loadSource, validateSource, type TokenSource } from './source.ts';

export const PARTIALS = [
  'header',
  'variants',
  'motion',
  'wiring',
  'base',
] as const;

export async function buildCss(
  source: TokenSource,
): Promise<{ files: Record<string, string>; runs: Map<string, Run> }> {
  const partial = (name: (typeof PARTIALS)[number]) =>
    readFileSync(
      join(source.root, 'styles', 'partials', `${name}.css`),
      'utf8',
    ).trimEnd();
  const runs = new Map<string, Run>();
  const files: Record<string, string> = {};

  const base = await runTheme(source, 'default', 'light', [
    {
      destination: '@theme',
      selector: '@theme',
      include: (t) => t.layer === 'primitive' && blockOf(t) === '@theme',
      hex: true,
    },
    {
      destination: ':root',
      selector: ':root',
      include: (t) =>
        t.layer === 'semantic-light' ||
        (t.layer === 'primitive' && blockOf(t) === ':root'),
      placeAfter: ROOT_PLACEMENT,
    },
  ]);
  const baseDark = await runTheme(source, 'default', 'dark', [
    {
      destination: '.dark',
      selector: '.dark',
      include: (t) => t.layer === 'semantic-dark',
    },
  ]);
  runs.set('default/light', base.run);
  runs.set('default/dark', baseDark.run);

  const named = source.themes.filter((t): t is NamedTheme => t !== 'default');
  files['styles/theme.css'] = await formatCss(
    [
      partial('header'),
      named.map((t) => `@import './themes/${t}.css';`).join('\n'),
      partial('variants'),
      base.blocks['@theme'],
      base.blocks[':root'],
      baseDark.blocks['.dark'],
      partial('motion'),
      partial('wiring'),
      partial('base'),
    ].join('\n\n') + '\n',
  );

  for (const theme of named) {
    const data = source.files[themeFile(theme)] ?? {};
    const groupDescription = (mode: 'light' | 'dark') =>
      ((data[mode] ?? {}) as DtcgGroup).$description as string | undefined;
    const selector = `:root[data-theme='${theme}']`;
    const light = await runTheme(source, theme, 'light', [
      {
        destination: 'light',
        selector,
        include: (t) => t.layer === 'theme-light',
        description: groupDescription('light'),
      },
    ]);
    const dark = await runTheme(source, theme, 'dark', [
      {
        destination: 'dark',
        selector: `${selector}.dark`,
        include: (t) => t.layer === 'theme-dark',
        description: groupDescription('dark'),
      },
    ]);
    runs.set(`${theme}/light`, light.run);
    runs.set(`${theme}/dark`, dark.run);
    const header = [
      data.$description as string | undefined,
      `GENERATED FILE from tokens/themes/${theme}.json by nx build tokens. Edit the JSON, never this file.`,
    ]
      .filter(Boolean)
      .join('\n\n');
    files[`styles/themes/${theme}.css`] = await formatCss(
      [wrapComment(header, ''), light.blocks.light, dark.blocks.dark].join(
        '\n\n',
      ) + '\n',
    );
  }
  return { files, runs };
}

export async function buildOutputs(
  root: string,
): Promise<Record<string, string>> {
  const source = loadSource(root);
  const problems = validateSource(source);
  if (problems.length > 0) {
    throw new Error(`Invalid token source:\n${problems.join('\n')}`);
  }
  const { files, runs } = await buildCss(source);
  const { version } = JSON.parse(
    readFileSync(join(root, 'package.json'), 'utf8'),
  ) as { version: string };
  const model = buildPlatformModel(
    runs,
    loadRoleMap(root),
    source.themes,
    version,
  );
  files['dist/tokens.json'] = renderTokensJson(model);
  files['dist/index.js'] = renderIndexJs(model);
  files['dist/index.d.ts'] = renderIndexDts(model);
  files['dist/compose/GremorieColorSchemes.kt'] = renderKotlin(model);
  files['dist/swift/GremorieTokens.swift'] = renderSwift(model);
  return files;
}

function rootFromArgs(args: readonly string[]): string {
  const at = args.indexOf('--root');
  if (at === -1) return fileURLToPath(new URL('../', import.meta.url));
  const dir = args[at + 1];
  if (dir === undefined) throw new Error('--root needs a directory');
  return resolve(dir);
}

const differs = (root: string, rel: string, content: string) =>
  !existsSync(join(root, rel)) ||
  readFileSync(join(root, rel), 'utf8') !== content;

/** Paths under styles/ to write or delete so they match the build. */
export function findDrift(
  root: string,
  outputs: Readonly<Record<string, string>>,
): string[] {
  const stale = Object.entries(outputs)
    .filter(([rel]) => rel.startsWith('styles/'))
    .filter(([rel, content]) => differs(root, rel, content))
    .map(([rel]) => rel);
  const themesDir = join(root, 'styles', 'themes');
  const orphans = existsSync(themesDir)
    ? readdirSync(themesDir)
        .filter((f) => f.endsWith('.css'))
        .map((f) => `styles/themes/${f}`)
        .filter((rel) => !(rel in outputs))
    : [];
  return [...stale, ...orphans].sort();
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const root = rootFromArgs(args);
  const outputs = await buildOutputs(root);
  const drift = findDrift(root, outputs);
  if (args.includes('--check')) {
    if (drift.length > 0) {
      console.error(`Out of date, run nx build tokens:\n${drift.join('\n')}`);
      process.exit(1);
    }
    return;
  }
  // Outputs outside styles/ are not committed, so --check ignores them, but
  // the build still writes them.
  const uncommitted = Object.entries(outputs)
    .filter(([rel]) => !rel.startsWith('styles/'))
    .filter(([rel, content]) => differs(root, rel, content))
    .map(([rel]) => rel);
  for (const rel of [...drift, ...uncommitted]) {
    const target = join(root, rel);
    const content = outputs[rel];
    if (content === undefined) {
      rmSync(target);
      console.log(`removed ${rel}`);
      continue;
    }
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
    console.log(`wrote ${rel}`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
