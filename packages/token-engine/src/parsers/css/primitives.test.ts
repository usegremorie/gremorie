import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import { parsePrimitives } from "./primitives.js";

const fixture = readFileSync(
  join(__dirname, "__fixtures__/primitives-basic.css"), "utf8"
);

describe("parsePrimitives", () => {
  it("extracts color primitive tokens", () => {
    const result = parsePrimitives(fixture, "primitives-basic.css");
    const colorTokens = result.filter(t => t.name.startsWith("--color-"));
    expect(colorTokens).toHaveLength(2);
    expect(colorTokens[0]).toMatchObject({
      kind: "primitive",
      name: "--color-gray-50",
      value: "oklch(0.985 0 0)",
      theme: "default",
      mode: "light"
    });
  });
  it("records source line numbers", () => {
    const result = parsePrimitives(fixture, "primitives-basic.css");
    const gray50 = result.find(t => t.name === "--color-gray-50");
    expect(gray50?.sourceLine).toBeGreaterThan(0);
  });
});

describe("parsePrimitives — real KDS file", () => {
  // Test file lives at src/parsers/css/primitives.test.ts → __dirname = src/parsers/css
  // Up 4 levels from css/ reaches packages/, then into kds/
  const kdsPath = join(__dirname, "../../../../kds/src/styles/tokens/primitive/colors.css");

  it.skipIf(!existsSync(kdsPath))("extracts at least 10 color primitives from KDS primitives", () => {
    const css = readFileSync(kdsPath, "utf8");
    const tokens = parsePrimitives(css, "colors.css");
    const colorTokens = tokens.filter(t => t.name.startsWith("--color-"));
    expect(colorTokens.length).toBeGreaterThanOrEqual(10);
  });
});
