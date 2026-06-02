import { Project } from 'ts-morph';
import { readdirSync, statSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { extractCvaFromFile } from './cva.js';
import type { ComponentInfo } from '../../graph/types.js';

const CANDIDATE_DIRS = ['components/ui', 'src/components/ui'];

function walkTsx(dir: string, out: string[] = []): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walkTsx(full, out);
    else if (extname(entry) === '.tsx') out.push(full);
  }
  return out;
}

function componentNameFromPath(p: string): string {
  const base = basename(p, extname(p));
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export function scanProjectComponents(projectRoot: string): ComponentInfo[] {
  const results: ComponentInfo[] = [];
  const project = new Project({
    useInMemoryFileSystem: false,
    skipFileDependencyResolution: true,
  });

  for (const candidate of CANDIDATE_DIRS) {
    const tsxFiles = walkTsx(join(projectRoot, candidate));
    for (const file of tsxFiles) {
      const sf = project.addSourceFileAtPathIfExists(file);
      if (!sf) continue;
      const info = extractCvaFromFile(sf, componentNameFromPath(file));
      if (info) results.push(info);
    }
  }

  return results;
}
