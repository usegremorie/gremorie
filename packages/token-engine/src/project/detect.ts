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
