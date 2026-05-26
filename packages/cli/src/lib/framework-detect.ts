import { readPackageJsonDependencies } from './angular-detect.js';
import type { RegistryFramework } from '../registry.js';

/**
 * Auto-detect the consumer project's framework by inspecting its
 * package.json dependencies. Returns null when no signal is found
 * (the CLI should prompt or default to ng).
 */
export function detectFramework(cwd: string = process.cwd()): RegistryFramework | null {
  const deps = readPackageJsonDependencies(cwd);
  if (deps['@angular/core']) return 'ng';
  if (deps['react']) return 'react';
  if (deps['vue']) return 'vue';
  return null;
}
