import postcss, { type AtRule } from "postcss";
import type { PrimitiveToken } from "../../graph/types.js";

export function parsePrimitives(
  css: string,
  sourceFile: string
): PrimitiveToken[] {
  const root = postcss.parse(css, { from: sourceFile });
  const tokens: PrimitiveToken[] = [];

  root.walkAtRules("theme", (atRule: AtRule) => {
    atRule.walkDecls((decl) => {
      if (!decl.prop.startsWith("--")) return;
      tokens.push({
        kind: "primitive",
        name: decl.prop,
        value: decl.value,
        theme: "default",
        mode: "light",
        sourceFile,
        sourceLine: decl.source?.start?.line ?? 0
      });
    });
  });

  return tokens;
}
