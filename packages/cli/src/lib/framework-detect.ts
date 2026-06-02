import { readPackageJsonDependencies } from './angular-detect.js';
import type { RegistryFramework } from '../registry.js';

/**
 * Auto-detect the consumer project's framework by inspecting its
 * package.json dependencies. Returns null when no signal is found
 * (the CLI should prompt or default to ng).
 *
 * The label "rx" is intentional and consistent with the registry layout
 * (`/r/rx/...`) and the npm prefix (`@gremorie/rx-*`). It is not "react".
 */
export function detectFramework(
  cwd: string = process.cwd(),
): RegistryFramework | null {
  const deps = readPackageJsonDependencies(cwd);
  if (deps['@angular/core']) return 'ng';
  if (deps['react']) return 'rx';
  if (deps['vue']) return 'vue';
  if (deps['svelte']) return 'sv';
  return null;
}
