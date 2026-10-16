import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatJson } from '../prettier.ts';
import { seedPrimitives, seedSemantic, seedTheme } from './from-css.ts';

const root = fileURLToPath(new URL('../../', import.meta.url));
const reference = (file: string) =>
  readFileSync(join(root, 'reference', '0.8.0', file), 'utf8');

async function write(rel: string, value: unknown): Promise<void> {
  const target = join(root, 'tokens', rel);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, await formatJson(value));
  console.log(`wrote tokens/${rel}`);
}

const layer = process.argv[2];
const themeCss = reference('theme.css');
if (layer === 'primitive') {
  for (const [rel, data] of Object.entries(seedPrimitives(themeCss))) {
    await write(rel, data);
  }
} else if (layer === 'semantic') {
  const { light, dark } = seedSemantic(themeCss);
  await write('semantic/light.json', light);
  await write('semantic/dark.json', dark);
} else if (layer === 'themes') {
  for (const theme of [
    'claude',
    'chatgpt',
    'gemini',
    'perplexity',
    'mistral',
  ] as const) {
    await write(
      `themes/${theme}.json`,
      seedTheme(reference(`themes/${theme}.css`), theme),
    );
  }
} else {
  console.error('usage: node pipeline/seed/run.ts primitive|semantic|themes');
  process.exit(1);
}
