import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import kleur from 'kleur';

import { detectFramework } from '../lib/framework-detect.js';
import {
  createRegistryClient,
  type RegistryFramework,
  type RegistryItem,
} from '../registry.js';

export interface AddOptions {
  dryRun?: boolean;
  framework?: string;
}

/** Normalise friendly aliases to the registry framework labels. */
function normaliseFramework(fw: string | undefined): RegistryFramework | null {
  if (!fw) return null;
  switch (fw.toLowerCase()) {
    case 'react':
    case 'rx':
      return 'rx';
    case 'angular':
    case 'ng':
      return 'ng';
    case 'vue':
      return 'vue';
    case 'svelte':
    case 'sv':
      return 'sv';
    default:
      return fw as RegistryFramework;
  }
}

/**
 * Infer the framework from the registry item name itself: `rx-*` items are
 * React, `ng-*` items are Angular, and `block-*` items are React registry
 * blocks. This beats any package.json heuristic because the name is explicit.
 */
function inferFromName(name: string): RegistryFramework | null {
  if (name.startsWith('rx-')) return 'rx';
  if (name.startsWith('ng-')) return 'ng';
  if (name.startsWith('block-')) return 'rx';
  return null;
}

interface ResolvedFramework {
  framework: RegistryFramework;
  source: 'flag' | 'item prefix' | 'auto-detected' | 'default';
}

function resolveFramework(
  name: string,
  requested: RegistryFramework | null,
  detected: RegistryFramework | null,
): ResolvedFramework {
  if (requested) return { framework: requested, source: 'flag' };
  const inferred = inferFromName(name);
  if (inferred) return { framework: inferred, source: 'item prefix' };
  if (detected) return { framework: detected, source: 'auto-detected' };
  return { framework: 'ng', source: 'default' };
}

/** Extract `@gremorie/<pkg>` package names from a source file's imports. */
function scanGremorieImports(content: string): string[] {
  const found = new Set<string>();
  const pattern =
    /(?:from\s+|import\s*\(\s*|require\s*\(\s*)['"](@gremorie\/[a-z0-9-]+)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(content)) !== null) {
    found.add(match[1]);
  }
  return [...found];
}

export async function addCommand(
  names: string[],
  options: AddOptions = {},
): Promise<void> {
  const cwd = process.cwd();
  const requested = normaliseFramework(options.framework);
  const detected = detectFramework(cwd);
  const client = createRegistryClient();

  console.log();
  console.log(kleur.bold().cyan(`gremorie add ${names.join(' ')}`));
  console.log(kleur.dim(`  registry:  ${client.baseUrl}`));
  console.log(kleur.dim(`  target:    ${cwd}`));
  console.log();

  // 1. Fetch every item plus all transitive registryDependencies.
  const ordered: RegistryItem[] = [];
  const seen = new Set<string>();
  for (const name of names) {
    const { framework, source } = resolveFramework(name, requested, detected);
    console.log(kleur.dim(`  ${name}: framework ${framework} (${source})`));
    try {
      await resolve(name, framework, client, ordered, seen);
    } catch (err) {
      console.error(
        kleur.red('x'),
        err instanceof Error ? err.message : String(err),
      );
      // Let the event loop drain instead of process.exit(): killing the
      // process with live fetch handles trips a libuv assertion on Windows.
      process.exitCode = 1;
      return;
    }
  }
  console.log();

  // 2. Aggregate npm dependencies so the user knows what to install.
  const npmDeps = new Set<string>();
  const npmDevDeps = new Set<string>();
  for (const item of ordered) {
    for (const dep of item.dependencies) npmDeps.add(dep);
    for (const dep of item.devDependencies ?? []) npmDevDeps.add(dep);
  }

  // 3. Write files (or print what would be written). Also scan the copied
  // sources for @gremorie/* imports as a safety net, in case the registry
  // item under-declares its npm dependencies.
  let writtenCount = 0;
  for (const item of ordered) {
    console.log(
      kleur.bold(`-> ${item.name}`),
      kleur.dim(`(${item.files.length} files)`),
    );
    for (const file of item.files) {
      for (const pkg of scanGremorieImports(file.content)) {
        npmDeps.add(pkg);
      }
      const dest = join(cwd, file.target ?? file.path);
      if (options.dryRun) {
        console.log(kleur.yellow('  ~'), kleur.dim(file.target ?? file.path));
      } else {
        mkdirSync(dirname(dest), { recursive: true });
        writeFileSync(dest, file.content, 'utf-8');
        writtenCount += 1;
        console.log(kleur.green('  +'), kleur.dim(file.target ?? file.path));
      }
    }
  }

  console.log();
  if (options.dryRun) {
    console.log(kleur.yellow('dry-run:'), 'no files were written.');
  } else {
    console.log(
      kleur.bold().green('OK'),
      `wrote ${writtenCount} file(s) across ${ordered.length} registry item(s).`,
    );
  }

  if (npmDeps.size > 0) {
    console.log();
    console.log(kleur.dim('Make sure these npm packages are installed:'));
    for (const dep of [...npmDeps].sort()) {
      console.log(`  ${kleur.cyan(dep)}`);
    }
  }
  if (npmDevDeps.size > 0) {
    console.log();
    console.log(kleur.dim('Plus dev dependencies:'));
    for (const dep of [...npmDevDeps].sort()) {
      console.log(`  ${kleur.cyan(dep)}`);
    }
  }
  console.log();
}

async function resolve(
  name: string,
  framework: RegistryFramework,
  client: ReturnType<typeof createRegistryClient>,
  ordered: RegistryItem[],
  seen: Set<string>,
): Promise<void> {
  if (seen.has(name)) return;
  seen.add(name);

  const item = await client.fetchItem(name, framework);

  // Resolve dependencies first so installed order is deterministic.
  for (const dep of item.registryDependencies) {
    await resolve(dep, framework, client, ordered, seen);
  }
  ordered.push(item);
}
