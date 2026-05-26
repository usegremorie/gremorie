import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import kleur from 'kleur';

import {
  createRegistryClient,
  type RegistryFramework,
  type RegistryItem,
} from '../registry.js';

export interface AddOptions {
  dryRun?: boolean;
  framework?: RegistryFramework;
}

export async function addCommand(
  name: string,
  options: AddOptions = {},
): Promise<void> {
  const cwd = process.cwd();
  const framework: RegistryFramework = options.framework ?? 'ng';
  const client = createRegistryClient();

  console.log();
  console.log(kleur.bold().cyan(`gremorie add ${name}`));
  console.log(kleur.dim(`  registry: ${client.baseUrl}`));
  console.log(kleur.dim(`  target:   ${cwd}`));
  console.log();

  // 1. Fetch the item plus all transitive registryDependencies.
  const ordered: RegistryItem[] = [];
  const seen = new Set<string>();
  try {
    await resolve(name, framework, client, ordered, seen);
  } catch (err) {
    console.error(
      kleur.red('x'),
      err instanceof Error ? err.message : String(err),
    );
    process.exit(1);
  }

  // 2. Aggregate npm dependencies so the user knows what to install.
  const npmDeps = new Set<string>();
  const npmDevDeps = new Set<string>();
  for (const item of ordered) {
    for (const dep of item.dependencies) npmDeps.add(dep);
    for (const dep of item.devDependencies ?? []) npmDevDeps.add(dep);
  }

  // 3. Write files (or print what would be written).
  let writtenCount = 0;
  for (const item of ordered) {
    console.log(
      kleur.bold(`-> ${item.name}`),
      kleur.dim(`(${item.files.length} files)`),
    );
    for (const file of item.files) {
      const dest = join(cwd, file.target ?? file.path);
      if (options.dryRun) {
        console.log(
          kleur.yellow('  ~'),
          kleur.dim(file.target ?? file.path),
        );
      } else {
        mkdirSync(dirname(dest), { recursive: true });
        writeFileSync(dest, file.content, 'utf-8');
        writtenCount += 1;
        console.log(
          kleur.green('  +'),
          kleur.dim(file.target ?? file.path),
        );
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
    for (const dep of npmDeps) {
      console.log(`  ${kleur.cyan(dep)}`);
    }
  }
  if (npmDevDeps.size > 0) {
    console.log();
    console.log(kleur.dim('Plus dev dependencies:'));
    for (const dep of npmDevDeps) {
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
