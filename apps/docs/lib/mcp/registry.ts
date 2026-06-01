/**
 * MCP helpers: reads the static registry artefacts emitted by
 * `@gremorie/registry` into apps/docs/public/r/ at build time.
 *
 * - registry.json   -> the index (lightweight catalogue)
 * - r/<fw>/<n>.json -> the full registry item (source + usage + api)
 *
 * Reads from filesystem at request time. Cheap for an MCP — the files are
 * tiny and the Vercel function runtime caches the bundle's static assets.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

const REGISTRY_PUBLIC_DIR = path.join(process.cwd(), 'public', 'r');

export interface RegistryIndexItem {
  name: string;
  type: string;
  framework: string;
  title: string;
  description: string;
  categories: string[];
  registryDependencies: string[];
}

export interface RegistryIndex {
  $schema?: string;
  name: string;
  homepage?: string;
  items: RegistryIndexItem[];
}

export interface RegistryItem extends RegistryIndexItem {
  $schema?: string;
  dependencies?: string[];
  devDependencies?: string[];
  files?: Array<{
    path: string;
    content: string;
    type: string;
    target?: string;
  }>;
  cssVars?: Record<string, unknown>;
  usage?: {
    whenToUse?: string;
    whenNotToUse?: string;
    bestPractices?: string[];
    antipatterns?: string[];
    api?: Record<string, unknown>;
    examples?: Array<{ title: string; code: string }>;
  };
}

/** Read and parse the top-level registry index. */
export async function readRegistryIndex(): Promise<RegistryIndex> {
  const indexPath = path.join(REGISTRY_PUBLIC_DIR, 'registry.json');
  const raw = await fs.readFile(indexPath, 'utf-8');
  return JSON.parse(raw) as RegistryIndex;
}

/** Read a single registry item by name (and optional framework). */
export async function readRegistryItem(
  name: string,
  framework?: string,
): Promise<RegistryItem | null> {
  // If the caller pinned a framework, look there first.
  if (framework) {
    const file = path.join(REGISTRY_PUBLIC_DIR, framework, `${name}.json`);
    try {
      const raw = await fs.readFile(file, 'utf-8');
      return JSON.parse(raw) as RegistryItem;
    } catch {
      // fall through to the scan
    }
  }

  // Scan every framework subdirectory in public/r/.
  const entries = await fs.readdir(REGISTRY_PUBLIC_DIR, {
    withFileTypes: true,
  });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const file = path.join(REGISTRY_PUBLIC_DIR, entry.name, `${name}.json`);
    try {
      const raw = await fs.readFile(file, 'utf-8');
      return JSON.parse(raw) as RegistryItem;
    } catch {
      // not in this framework dir, keep scanning
    }
  }

  return null;
}

/**
 * Categorical + substring filter over the registry index.
 *
 * - `category`  -> matches when the item's `categories` array contains it
 * - `framework` -> exact match
 * - `query`     -> case-insensitive substring against name + description + title
 */
export function filterRegistry(
  items: RegistryIndexItem[],
  opts: { query?: string; framework?: string; category?: string } = {},
): RegistryIndexItem[] {
  const q = opts.query?.toLowerCase().trim();
  return items.filter((item) => {
    if (opts.framework && item.framework !== opts.framework) return false;
    if (opts.category && !item.categories.includes(opts.category)) return false;
    if (q) {
      const haystack =
        `${item.name} ${item.title} ${item.description}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}
