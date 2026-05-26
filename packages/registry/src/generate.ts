import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';

import kleur from 'kleur';

import { ITEMS } from './items.js';
import { REGISTRY_ITEM_SCHEMA } from './schema.js';
import type {
  ItemConfig,
  RegistryFile,
  RegistryFileType,
  RegistryIndex,
  RegistryIndexEntry,
  RegistryItem,
} from './types.js';
import { readUsage } from './usage.js';

const SCHEMA_URL = 'https://gremorie.com/schema/registry-item.json';
const INDEX_SCHEMA_URL = 'https://gremorie.com/schema/registry.json';

export interface GenerateOptions {
  /** Repo root. Defaults to process.cwd(). */
  cwd?: string;
  /** Where the JSON files land. Defaults to `apps/docs/public/r`. */
  outDir?: string;
  /** Where the JSON Schema lands. Defaults to `apps/docs/public/schema`. */
  schemaDir?: string;
  /** Whether to clear the output directory before writing. Defaults to true. */
  clean?: boolean;
}

export interface GenerateResult {
  outDir: string;
  itemsWritten: number;
  indexPath: string;
  schemaPath: string;
}

export async function generate(
  options: GenerateOptions = {},
): Promise<GenerateResult> {
  const cwd = options.cwd ?? process.cwd();
  const outDir = join(cwd, options.outDir ?? 'apps/docs/public/r');
  const schemaDir = join(cwd, options.schemaDir ?? 'apps/docs/public/schema');
  const clean = options.clean ?? true;

  console.log();
  console.log(kleur.bold().cyan('gremorie registry: generate'));
  console.log(kleur.dim(`  repo:   ${cwd}`));
  console.log(kleur.dim(`  out:    ${outDir}`));
  console.log(kleur.dim(`  schema: ${schemaDir}`));
  console.log();

  if (clean && existsSync(outDir)) {
    rmSync(outDir, { recursive: true, force: true });
  }
  mkdirSync(outDir, { recursive: true });
  mkdirSync(schemaDir, { recursive: true });

  // 1. JSON schema (single source of truth for what an item looks like).
  const schemaPath = join(schemaDir, 'registry-item.json');
  writeFile(schemaPath, JSON.stringify(REGISTRY_ITEM_SCHEMA, null, 2));
  console.log(kleur.green('+'), kleur.dim('schema/registry-item.json'));

  // 2. Per-item JSONs.
  const indexEntries: RegistryIndexEntry[] = [];
  for (const item of ITEMS) {
    const json = buildItem(cwd, item);
    const target = join(outDir, item.framework, `${item.name}.json`);
    writeFile(target, JSON.stringify(json, null, 2));
    console.log(
      kleur.green('+'),
      kleur.dim(`r/${item.framework}/${item.name}.json`),
      kleur.gray(`(${json.files.length} files)`),
    );
    indexEntries.push({
      name: item.name,
      type: json.type,
      framework: item.framework,
      title: json.title,
      description: json.description,
      categories: json.categories,
      registryDependencies: json.registryDependencies,
    });
  }

  // 3. Index.
  const index: RegistryIndex = {
    $schema: INDEX_SCHEMA_URL,
    name: 'gremorie',
    homepage: 'https://gremorie.com',
    items: indexEntries,
  };
  const indexPath = join(outDir, 'registry.json');
  writeFile(indexPath, JSON.stringify(index, null, 2));
  console.log(kleur.green('+'), kleur.dim('r/registry.json'));
  console.log();
  console.log(
    kleur.bold().green('OK'),
    `wrote ${indexEntries.length} item(s) to ${outDir}`,
  );
  console.log();

  return {
    outDir,
    itemsWritten: indexEntries.length,
    indexPath,
    schemaPath,
  };
}

function buildItem(cwd: string, item: ItemConfig): RegistryItem {
  const srcStrip = item.srcStrip ?? 'src/';
  const stripPrefix = (rel: string): string =>
    rel.startsWith(srcStrip) ? rel.slice(srcStrip.length) : rel;

  const files: RegistryFile[] = [];
  for (const rel of item.sourceFiles) {
    const abs = join(cwd, item.packageRoot, rel);
    if (!existsSync(abs)) {
      throw new Error(
        `Item "${item.name}": expected source file not found at ${abs}`,
      );
    }
    const content = normaliseLineEndings(readFileSync(abs, 'utf-8'));
    files.push({
      path: rel,
      content,
      type: inferFileType(rel),
      target: join(item.targetPrefix, stripPrefix(rel)).replace(/\\/g, '/'),
    });
  }
  for (const rel of item.assetFiles ?? []) {
    const abs = join(cwd, item.packageRoot, rel);
    if (!existsSync(abs)) continue;
    const content = normaliseLineEndings(readFileSync(abs, 'utf-8'));
    files.push({
      path: rel,
      content,
      type: 'registry:style',
      target: join(item.targetPrefix, rel).replace(/\\/g, '/'),
    });
  }

  const usage = readUsage(join(cwd, item.packageRoot), item.name);

  return {
    $schema: SCHEMA_URL,
    name: item.name,
    type: 'registry:block',
    framework: item.framework,
    title: item.title,
    description: item.description,
    categories: item.categories,
    dependencies: item.dependencies,
    devDependencies: item.devDependencies ?? [],
    registryDependencies: item.registryDependencies,
    files,
    cssVars: item.cssVars ?? {},
    usage,
  };
}

function inferFileType(path: string): RegistryFileType {
  if (path.endsWith('.css')) return 'registry:style';
  if (path.endsWith('.types.ts')) return 'registry:lib';
  if (path.endsWith('.utils.ts')) return 'registry:lib';
  if (path.endsWith('utils.ts')) return 'registry:lib';
  if (path.endsWith('index.ts')) return 'registry:lib';
  return 'registry:component';
}

function writeFile(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf-8');
}

function normaliseLineEndings(content: string): string {
  return content.replace(/\r\n/g, '\n');
}
