import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface AngularContext {
  isAngular: boolean;
  workspaceFile: 'angular.json' | 'workspace.json' | 'nx.json' | null;
  rootStylesPath: string | null;
}

/**
 * Detect whether the current working directory looks like an Angular
 * project, and try to locate the root styles entrypoint.
 *
 * Used by `gremorie init` to know where to write the theme.css import.
 */
export function detectAngular(cwd: string = process.cwd()): AngularContext {
  const candidates = ['angular.json', 'workspace.json', 'nx.json'] as const;
  let workspaceFile: AngularContext['workspaceFile'] = null;

  for (const candidate of candidates) {
    if (existsSync(join(cwd, candidate))) {
      workspaceFile = candidate;
      break;
    }
  }

  const stylesCandidates = [
    'src/styles.css',
    'src/styles.scss',
    'src/global.css',
    'src/global.scss',
  ];

  let rootStylesPath: string | null = null;
  for (const candidate of stylesCandidates) {
    if (existsSync(join(cwd, candidate))) {
      rootStylesPath = candidate;
      break;
    }
  }

  return {
    isAngular: workspaceFile !== null,
    workspaceFile,
    rootStylesPath,
  };
}

export function readPackageJsonDependencies(
  cwd: string = process.cwd(),
): Record<string, string> {
  const pkgPath = join(cwd, 'package.json');
  if (!existsSync(pkgPath)) {
    return {};
  }
  try {
    const parsed = JSON.parse(readFileSync(pkgPath, 'utf-8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    return { ...(parsed.dependencies ?? {}), ...(parsed.devDependencies ?? {}) };
  } catch {
    return {};
  }
}
