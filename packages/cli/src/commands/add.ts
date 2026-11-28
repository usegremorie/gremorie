import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import kleur from 'kleur';

import {
  installSteps,
  missingDependencies,
  runInstall,
  spawnRunner,
  type PackageJsonLike,
  type Runner,
} from '../lib/dependencies.js';
import { detectFramework } from '../lib/framework-detect.js';
import { detectPackageManager } from '../lib/package-manager.js';
import {
  createRegistryClient,
  type RegistryClient,
  type RegistryFramework,
  type RegistryItem,
} from '../registry.js';

export interface AddOptions {
  dryRun?: boolean;
  framework?: string;
  /** `--no-install` sets this to false: write the files, install nothing. */
  install?: boolean;
  /** Injection points for tests; the CLI uses the defaults. */
  cwd?: string;
  client?: RegistryClient;
  runner?: Runner;
}

function readPackageJson(cwd: string): PackageJsonLike | null {
  const file = join(cwd, 'package.json');
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, 'utf-8')) as PackageJsonLike;
  } catch {
    return null;
  }
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
 * Names the registry used to ship under. The five blocks carried a `block-`
 * category prefix that nothing else in the React namespace used, and that the
 * Angular edition never had - the same block was `block-assistant` here and
 * `ng-assistant` there. They are `rx-*` now, like every other React item.
 *
 * The old names keep working: they went out with 0.7.0, in the docs and in
 * people's notes, and a rename is not a reason to break an install.
 */
const RENAMED: Record<string, string> = {
  'block-assistant': 'rx-assistant',
  'block-dashboard': 'rx-dashboard',
  'block-empty-state': 'rx-empty-state',
  'block-settings-form': 'rx-settings-form',
  'block-sign-in': 'rx-sign-in',
};

/** Map a legacy name onto its current one; anything else passes through. */
export function canonicalName(name: string): string {
  return RENAMED[name] ?? name;
}

/**
 * Infer the framework from the registry item name itself: `rx-*` items are
 * React and `ng-*` items are Angular. This beats any package.json heuristic
 * because the name is explicit.
 */
function inferFromName(name: string): RegistryFramework | null {
  if (name.startsWith('rx-')) return 'rx';
  if (name.startsWith('ng-')) return 'ng';
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
  const cwd = options.cwd ?? process.cwd();
  const requested = normaliseFramework(options.framework);
  const detected = detectFramework(cwd);
  const client = options.client ?? createRegistryClient();

  console.log();
  console.log(kleur.bold().cyan(`gremorie add ${names.join(' ')}`));
  console.log(kleur.dim(`  registry:  ${client.baseUrl}`));
  console.log(kleur.dim(`  target:    ${cwd}`));
  console.log();

  // 1. Fetch every item plus all transitive registryDependencies.
  const ordered: RegistryItem[] = [];
  const seen = new Set<string>();
  for (const requestedName of names) {
    const name = canonicalName(requestedName);
    if (name !== requestedName) {
      console.log(
        kleur.dim(`  ${requestedName} is now ${name} (old name still works)`),
      );
    }
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

  // 2. Aggregate the npm dependencies of every item.
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

  // 4. Install what the project does not declare yet. The files are already
  // written, so a failed install leaves them in place and says what to run.
  let dependencies: string[];
  let devDependencies: string[];
  try {
    const pkg = readPackageJson(cwd);
    dependencies = missingDependencies([...npmDeps].sort(), pkg);
    devDependencies = missingDependencies([...npmDevDeps].sort(), pkg);
  } catch (err) {
    console.error(
      kleur.red('x'),
      err instanceof Error ? err.message : String(err),
    );
    process.exitCode = 1;
    return;
  }
  const steps = installSteps(
    detectPackageManager(cwd),
    dependencies,
    devDependencies,
  );

  console.log();
  if (steps.length === 0) {
    if (npmDeps.size + npmDevDeps.size > 0) {
      console.log(
        kleur.green('OK'),
        kleur.dim('dependencies already installed.'),
      );
    }
  } else if (options.dryRun) {
    console.log(kleur.yellow('dry-run:'), 'would install with:');
    for (const s of steps) console.log(`  ${kleur.cyan(s.display)}`);
  } else if (options.install === false) {
    console.log(kleur.dim('Skipped installing. Run:'));
    for (const s of steps) console.log(`  ${kleur.cyan(s.display)}`);
  } else {
    console.log(kleur.dim('Installing dependencies:'));
    for (const s of steps) console.log(`  ${kleur.cyan(s.display)}`);
    console.log();
    const result = runInstall(steps, cwd, options.runner ?? spawnRunner);
    console.log();
    if (result.ok) {
      console.log(kleur.bold().green('OK'), 'dependencies installed.');
    } else {
      if (result.error) console.log(kleur.red('x'), result.error);
      console.log(
        kleur.red('x'),
        'Install failed. The files are in place; fix the error above, then run:',
      );
      for (const line of result.manual) console.log(`  ${kleur.cyan(line)}`);
      process.exitCode = 1;
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
