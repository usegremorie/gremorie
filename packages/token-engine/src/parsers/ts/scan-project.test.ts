import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { scanProjectComponents } from "./scan-project.js";

describe("scanProjectComponents", () => {
  it("finds all .tsx components with cva calls in a directory", () => {
    const dir = join(tmpdir(), "tokens-test-" + Date.now());
    const ui = join(dir, "components/ui");
    mkdirSync(ui, { recursive: true });
    writeFileSync(
      join(ui, "button.tsx"),
      `import { cva } from "class-variance-authority";
       export const buttonVariants = cva("inline-flex", { variants: { variant: { default: "x" } } });`
    );
    writeFileSync(join(ui, "no-cva.tsx"), `export const x = 1;`);

    const results = scanProjectComponents(dir);
    rmSync(dir, { recursive: true, force: true });

    expect(results).toHaveLength(1);
    expect(results[0]!.name).toBe("Button");
  });
});
