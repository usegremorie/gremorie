import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { wrapComment } from './css.ts';
import { themeFile, type DtcgGroup, type NamedTheme } from './model.ts';
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
  const { files } = await buildCss(source);
  return files;
}

function rootFromArgs(args: readonly string[]): string {
  const at = args.indexOf('--root');
  if (at === -1) return fileURLToPath(new URL('../', import.meta.url));
  const dir = args[at + 1];
  if (dir === undefined) throw new Error('--root needs a directory');
  return resolve(dir);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const root = rootFromArgs(args);
  const outputs = await buildOutputs(root);
  const stale = Object.entries(outputs).filter(
    ([rel, content]) =>
      !existsSync(join(root, rel)) ||
      readFileSync(join(root, rel), 'utf8') !== content,
  );
  if (args.includes('--check')) {
    const committed = stale.filter(([rel]) => rel.startsWith('styles/'));
    if (committed.length > 0) {
      console.error(
        `Out of date, run nx build tokens:\n${committed.map(([rel]) => rel).join('\n')}`,
      );
      process.exit(1);
    }
    return;
  }
  for (const [rel, content] of stale) {
    const target = join(root, rel);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
    console.log(`wrote ${rel}`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
