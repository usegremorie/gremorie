import { spawnSync } from 'node:child_process';

import { installCommand, type PackageManager } from './package-manager.js';

export interface PackageJsonLike {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

/** `culori` → `{ name: 'culori' }`; `@scope/pkg@1.2.0` → with a version. */
function parseRequest(request: string): { name: string; versioned: boolean } {
  const at = request.indexOf('@', request.startsWith('@') ? 1 : 0);
  return at === -1
    ? { name: request, versioned: false }
    : { name: request.slice(0, at), versioned: true };
}

/**
 * The registry lists bare package names. Installing a bare name that the
 * project already declares would re-resolve it to `latest` and rewrite the
 * range the user chose, so those are skipped. A request with an explicit
 * version is kept: an item may pin one on purpose. Requests are deduped by
 * name, the versioned one winning. A name starting with "-" would reach the
 * package manager as a flag, so it is rejected.
 */
export function missingDependencies(
  requests: readonly string[],
  pkg: PackageJsonLike | null,
): string[] {
  const declared = new Set([
    ...Object.keys(pkg?.dependencies ?? {}),
    ...Object.keys(pkg?.devDependencies ?? {}),
    ...Object.keys(pkg?.optionalDependencies ?? {}),
    ...Object.keys(pkg?.peerDependencies ?? {}),
  ]);
  const chosen = new Map<string, { request: string; versioned: boolean }>();
  for (const raw of requests) {
    const request = raw.trim();
    if (request.startsWith('-')) {
      throw new Error(
        `Invalid dependency "${request}": names cannot start with "-".`,
      );
    }
    const { name, versioned } = parseRequest(request);
    if (!versioned && declared.has(name)) continue;
    const current = chosen.get(name);
    if (!current || (versioned && !current.versioned)) {
      chosen.set(name, { request, versioned });
    }
  }
  return [...chosen.values()].map((c) => c.request);
}

export interface InstallStep {
  command: PackageManager;
  args: string[];
  /** The same step as a line the user can paste. */
  display: string;
}

const NPM_FLAGS = ['--no-audit', '--no-fund'];

function step(
  pm: PackageManager,
  packages: string[],
  dev: boolean,
): InstallStep {
  const base = pm === 'npm' ? ['install', ...NPM_FLAGS] : ['add'];
  const devFlag = dev ? [pm === 'bun' ? '-d' : '-D'] : [];
  return {
    command: pm,
    // "--" ends the options: whatever follows is a package name.
    args: [...base, ...devFlag, '--', ...packages],
    display: installCommand(pm, packages, { saveDev: dev }),
  };
}

/** One install step for dependencies and one for dev dependencies. */
export function installSteps(
  pm: PackageManager,
  dependencies: string[],
  devDependencies: string[],
): InstallStep[] {
  const steps: InstallStep[] = [];
  if (dependencies.length) steps.push(step(pm, dependencies, false));
  if (devDependencies.length) steps.push(step(pm, devDependencies, true));
  return steps;
}

export type Runner = (
  command: string,
  args: string[],
  cwd: string,
) => { ok: boolean; error?: string };

/**
 * Run the package manager with the output streamed to the terminal. No shell,
 * except on Windows, where npm, pnpm and yarn are .cmd shims that only start
 * through one; the names reaching it were validated above.
 */
export const spawnRunner: Runner = (command, args, cwd) => {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  return { ok: result.status === 0, error: result.error?.message };
};

export type InstallResult =
  { ok: true } | { ok: false; manual: string[]; error?: string };

/** Run the steps in order; on a failure, return what is left to run by hand. */
export function runInstall(
  steps: InstallStep[],
  cwd: string,
  run: Runner = spawnRunner,
): InstallResult {
  for (const [index, current] of steps.entries()) {
    const outcome = run(current.command, current.args, cwd);
    if (!outcome.ok) {
      const manual = steps.slice(index).map((s) => s.display);
      return outcome.error
        ? { ok: false, manual, error: outcome.error }
        : { ok: false, manual };
    }
  }
  return { ok: true };
}
