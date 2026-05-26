import { describe, it, expect } from "vitest";
import { buildGraph } from "./build-graph.js";
import type { PrimitiveToken, SemanticToken } from "../../graph/types.js";

describe("buildGraph", () => {
  it("indexes primitives and semantics by composite key", () => {
    const primitives: PrimitiveToken[] = [{
      kind: "primitive", name: "--color-gray-50", value: "oklch(0.98 0 0)",
      theme: "default", mode: "light", sourceFile: "g.css", sourceLine: 1
    }];
    const semantics: SemanticToken[] = [{
      kind: "semantic", name: "--background",
      value: { kind: "reference", targetName: "--color-gray-50" },
      theme: "default", mode: "light", sourceFile: "g.css", sourceLine: 5
    }];

    const graph = buildGraph({ primitives, semantics, components: [] });

    expect(Object.keys(graph.primitives)).toContain("default::light::--color-gray-50");
    expect(Object.keys(graph.semantics)).toContain("default::light::--background");
    expect(graph.themes).toContain("default");
  });
});
