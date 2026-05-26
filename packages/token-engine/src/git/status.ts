import { execFileSync } from "node:child_process";

export interface GitStatus {
  inRepo: boolean;
  dirty: boolean;
  branch: string | null;
}

export function gitStatus(cwd: string): GitStatus {
  try {
    const branch = execFileSync("git", ["branch", "--show-current"], { cwd, encoding: "utf8" }).trim();
    const porcelain = execFileSync("git", ["status", "--porcelain"], { cwd, encoding: "utf8" });
    return { inRepo: true, dirty: porcelain.trim().length > 0, branch: branch || null };
  } catch {
    return { inRepo: false, dirty: false, branch: null };
  }
}
