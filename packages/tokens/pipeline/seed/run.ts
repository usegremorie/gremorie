import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatJson } from '../prettier.ts';
import { seedPrimitives } from './from-css.ts';

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
if (layer === 'primitive') {
  for (const [rel, data] of Object.entries(
    seedPrimitives(reference('theme.css')),
  )) {
    await write(rel, data);
  }
} else {
  console.error('usage: node pipeline/seed/run.ts primitive');
  process.exit(1);
}
