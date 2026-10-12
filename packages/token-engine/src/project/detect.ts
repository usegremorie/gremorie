import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export interface RegistryProject {
  root: string;
  globalsCss: string;
}

/**
 * Detect a project compatible with the registry-distribution model by
 * locating a `components.json` config and resolving its global CSS path.
 * Returns `null` when the project does not match this shape.
 */
export function detectRegistryProject(root: string): RegistryProject | null {
  const componentsJsonPath = join(root, 'components.json');
  if (!existsSync(componentsJsonPath)) return null;
  try {
    const cfg = JSON.parse(readFileSync(componentsJsonPath, 'utf8'));
    const cssPath = cfg.tailwind?.css ?? 'src/styles/globals.css';
    if (!existsSync(join(root, cssPath))) return null;
    return { root, globalsCss: cssPath };
  } catch {
    return null;
  }
}

export interface DtcgProject {
  root: string;
  packageDir: string;
  tokensDir: string;
}

/**
 * The Gremorie monorepo itself: the DTCG source in packages/tokens/tokens and
 * the pipeline that rebuilds the CSS from it.
 */
export function detectDtcgProject(root: string): DtcgProject | null {
  const packageDir = join(root, 'packages', 'tokens');
  const tokensDir = join(packageDir, 'tokens');
  if (
    !existsSync(join(tokensDir, 'primitive', 'color.json')) ||
    !existsSync(join(packageDir, 'pipeline', 'build.ts'))
  ) {
    return null;
  }
  return { root, packageDir, tokensDir };
}
