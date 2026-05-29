import postcss, { type Rule } from "postcss";
import type { TokenValue, ThemeId, ColorMode } from "../graph/types.js";

export type Change =
  | { kind: "primitive-value"; tokenName: string; newValue: string }
  | { kind: "semantic-value"; tokenName: string; theme: ThemeId; mode: ColorMode; newValue: TokenValue };

function selectorForTheme(theme: ThemeId, mode: ColorMode): string {
  if (theme === "default") return mode === "light" ? ":root" : ".dark";
  return mode === "light"
    ? `[data-theme="${theme}"]`
    : `[data-theme="${theme}"].dark`;
}

function valueToString(v: TokenValue): string {
  return v.kind === "literal" ? v.raw : `var(${v.targetName})`;
}

export function applyChanges(
  css: string,
  sourceFile: string,
  changes: Change[]
): string {
  if (changes.length === 0) return css;
  const root = postcss.parse(css, { from: sourceFile });

  const primitiveChanges = new Map(
    changes
      .filter((c): c is Extract<Change, { kind: "primitive-value" }> => c.kind === "primitive-value")
      .map(c => [c.tokenName, c.newValue])
  );

  const semanticChanges = new Map<string, Extract<Change, { kind: "semantic-value" }>>();
  for (const c of changes) {
    if (c.kind !== "semantic-value") continue;
    semanticChanges.set(`${selectorForTheme(c.theme, c.mode)}::${c.tokenName}`, c);
  }

  root.walkAtRules("theme", (atRule) => {
    atRule.walkDecls((decl) => {
      const next = primitiveChanges.get(decl.prop);
      if (next !== undefined) decl.value = next;
    });
  });

  root.walkRules((rule: Rule) => {
    rule.walkDecls((decl) => {
      const key = `${rule.selector}::${decl.prop}`;
      const c = semanticChanges.get(key);
      if (c) decl.value = valueToString(c.newValue);
    });
  });

  return root.toString();
}
