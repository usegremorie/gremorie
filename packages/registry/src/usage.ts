import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import matter from 'gray-matter';

import type { RegistryUsage } from './types.js';

interface UsageFrontmatter {
  whenToUse?: string;
  whenNotToUse?: string;
  bestPractices?: string[];
  antipatterns?: string[];
  api?: RegistryUsage['api'];
  examples?: RegistryUsage['examples'];
}

/**
 * Reads the co-located `usage.md` for a package and returns a `RegistryUsage`.
 *
 * Format (frontmatter YAML + free markdown body):
 *
 * ```
 * ---
 * whenToUse: "..."
 * whenNotToUse: "..."
 * bestPractices:
 *   - "..."
 * antipatterns:
 *   - "..."
 * api:
 *   inputs:
 *     - { name: value, type: string, required: true }
 * examples:
 *   - title: "Basic"
 *     code: |
 *       ...
 * ---
 * ```
 *
 * The markdown body is currently ignored (kept for future human-facing docs).
 * Missing files yield a `TBD` placeholder so the generator never blocks.
 */
export function readUsage(packageRoot: string, itemName: string): RegistryUsage {
  // Prefer per-item usage at usage/<item>.md; fall back to the package-level
  // usage.md when the per-item file is absent. This gives granular items room
  // to grow their own docs over time while keeping shared docs for packages
  // that have not been broken out yet.
  const perItemPath = join(packageRoot, 'usage', `${itemName}.md`);
  const packagePath = join(packageRoot, 'usage.md');
  const usagePath = existsSync(perItemPath)
    ? perItemPath
    : existsSync(packagePath)
      ? packagePath
      : null;

  if (!usagePath) {
    return placeholder(itemName);
  }

  const raw = readFileSync(usagePath, 'utf-8');
  const parsed = matter(raw).data as UsageFrontmatter;

  return {
    whenToUse: parsed.whenToUse ?? `TBD - document when to use ${itemName}.`,
    whenNotToUse:
      parsed.whenNotToUse ??
      `TBD - document when to reach for something else.`,
    bestPractices: parsed.bestPractices ?? [],
    antipatterns: parsed.antipatterns ?? [],
    ...(parsed.api ? { api: parsed.api } : {}),
    ...(parsed.examples ? { examples: parsed.examples } : {}),
  };
}

function placeholder(itemName: string): RegistryUsage {
  return {
    whenToUse: `TBD - document when to use ${itemName}.`,
    whenNotToUse: `TBD - document when to reach for something else.`,
    bestPractices: [],
    antipatterns: [],
  };
}
