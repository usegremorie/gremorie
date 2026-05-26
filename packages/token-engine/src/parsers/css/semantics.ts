import postcss, { type Rule } from "postcss";
import type { SemanticToken, TokenValue, ThemeId, ColorMode } from "../../graph/types.js";

const VAR_PATTERN = /^\s*var\((--[a-z0-9-]+)\)\s*$/i;

function parseValue(raw: string): TokenValue {
  const match = VAR_PATTERN.exec(raw);
  if (match) return { kind: "reference", targetName: match[1]! };
  return { kind: "literal", raw: raw.trim() };
}

interface SelectorTheme {
  theme: ThemeId;
  mode: ColorMode;
}

function classifySelector(selector: string): SelectorTheme | null {
  const trimmed = selector.trim();
  if (trimmed === ":root") return { theme: "default", mode: "light" };
  if (trimmed === ".dark" || trimmed === ":root.dark")
    return { theme: "default", mode: "dark" };

  const dataMatch = /\[data-theme="([^"]+)"\](\.dark)?/.exec(trimmed);
  if (dataMatch) {
    return { theme: dataMatch[1]!, mode: dataMatch[2] ? "dark" : "light" };
  }
  return null;
}

export function parseSemantics(css: string, sourceFile: string): SemanticToken[] {
  const root = postcss.parse(css, { from: sourceFile });
  const tokens: SemanticToken[] = [];

  root.walkRules((rule: Rule) => {
    let classified: SelectorTheme | null = null;
    for (const sel of rule.selectors) {
      classified = classifySelector(sel);
      if (classified) break;
    }
    if (!classified) return;

    rule.walkDecls((decl) => {
      if (!decl.prop.startsWith("--")) return;
      if (decl.prop.startsWith("--color-")) return;
      tokens.push({
        kind: "semantic",
        name: decl.prop,
        value: parseValue(decl.value),
        theme: classified.theme,
        mode: classified.mode,
        sourceFile,
        sourceLine: decl.source?.start?.line ?? 0,
      });
    });
  });

  return tokens;
}
