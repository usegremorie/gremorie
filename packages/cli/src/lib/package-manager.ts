import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

const LOCKFILES: ReadonlyArray<[string, PackageManager]> = [
  ['pnpm-lock.yaml', 'pnpm'],
  ['yarn.lock', 'yarn'],
  ['bun.lock', 'bun'],
  ['bun.lockb', 'bun'],
  ['package-lock.json', 'npm'],
];

const isPackageManager = (value: string): value is PackageManager =>
  value === 'npm' || value === 'pnpm' || value === 'yarn' || value === 'bun';

/** The `packageManager` field of package.json (`pnpm@9.1.0` → `pnpm`). */
function fromPackageJson(dir: string): PackageManager | null {
  const file = join(dir, 'package.json');
  if (!existsSync(file)) return null;
  try {
    const field = (
      JSON.parse(readFileSync(file, 'utf-8')) as {
        packageManager?: unknown;
      }
    ).packageManager;
    if (typeof field !== 'string') return null;
    const name = field.split('@')[0] ?? '';
    return isPackageManager(name) ? name : null;
  } catch {
    return null;
  }
}

/** The tool that launched the CLI (`npx`, `pnpm dlx`, `bunx`, `yarn dlx`). */
function fromUserAgent(): PackageManager | null {
  const name = (process.env.npm_config_user_agent ?? '').split('/')[0] ?? '';
  return isPackageManager(name) ? name : null;
}

/**
 * Detect the package manager of the consumer's project. From `cwd` up to the
 * filesystem root, the first folder that says wins: its package.json
 * `packageManager` field, then its lockfile. An app inside a monorepo therefore
 * resolves to the workspace's manager. Falls back to the tool that launched
 * the CLI, then npm.
 */
export function detectPackageManager(
  cwd: string = process.cwd(),
): PackageManager {
  let dir = cwd;
  for (;;) {
    const declared = fromPackageJson(dir);
    if (declared) return declared;
    for (const [lockfile, pm] of LOCKFILES) {
      if (existsSync(join(dir, lockfile))) return pm;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return fromUserAgent() ?? 'npm';
}

/**
 * Build the install command string for a given package manager + packages.
 */
export function installCommand(
  pm: PackageManager,
  packages: readonly string[],
  options: { saveDev?: boolean } = {},
): string {
  const list = packages.join(' ');
  switch (pm) {
    case 'pnpm':
      return `pnpm add ${options.saveDev ? '-D ' : ''}${list}`;
    case 'yarn':
      return `yarn add ${options.saveDev ? '-D ' : ''}${list}`;
    case 'bun':
      return `bun add ${options.saveDev ? '-d ' : ''}${list}`;
    case 'npm':
    default:
      return `npm install ${options.saveDev ? '-D ' : ''}${list}`;
  }
}
