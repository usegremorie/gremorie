import { existsSync } from 'node:fs';
import { join } from 'node:path';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

/**
 * Detect the package manager used by the consumer's project, in order:
 * pnpm-lock.yaml > yarn.lock > bun.lockb > package-lock.json > fallback npm.
 */
export function detectPackageManager(cwd: string = process.cwd()): PackageManager {
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn';
  if (existsSync(join(cwd, 'bun.lockb'))) return 'bun';
  return 'npm';
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
