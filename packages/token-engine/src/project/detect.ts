import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export interface ShadcnProject {
  root: string;
  globalsCss: string;
}

export function detectShadcnProject(root: string): ShadcnProject | null {
  const componentsJsonPath = join(root, "components.json");
  if (!existsSync(componentsJsonPath)) return null;
  try {
    const cfg = JSON.parse(readFileSync(componentsJsonPath, "utf8"));
    const cssPath = cfg.tailwind?.css ?? "src/styles/globals.css";
    if (!existsSync(join(root, cssPath))) return null;
    return { root, globalsCss: cssPath };
  } catch {
    return null;
  }
}
