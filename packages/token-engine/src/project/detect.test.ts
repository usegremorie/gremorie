import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { detectShadcnProject } from "./detect.js";

describe("detectShadcnProject", () => {
  const dir = join(tmpdir(), "tokens-detect-" + Date.now());

  it("returns null when not a shadcn project", () => {
    mkdirSync(dir, { recursive: true });
    expect(detectShadcnProject(dir)).toBeNull();
    rmSync(dir, { recursive: true, force: true });
  });

  it("detects by components.json and finds globals.css", () => {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "components.json"), JSON.stringify({
      tailwind: { css: "src/styles/globals.css" }
    }));
    mkdirSync(join(dir, "src/styles"), { recursive: true });
    writeFileSync(join(dir, "src/styles/globals.css"), ":root {}");

    const result = detectShadcnProject(dir);
    expect(result).not.toBeNull();
    expect(result!.globalsCss).toBe("src/styles/globals.css");
    rmSync(dir, { recursive: true, force: true });
  });
});
