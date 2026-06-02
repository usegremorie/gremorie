export type ColorMode = 'light' | 'dark';
export type ThemeId = string;

export interface TokenReference {
  kind: 'reference';
  targetName: string;
}

export interface TokenLiteral {
  kind: 'literal';
  raw: string;
}

export type TokenValue = TokenReference | TokenLiteral;

interface TokenBase {
  name: string;
  theme: ThemeId;
  mode: ColorMode;
  sourceFile: string;
  sourceLine: number;
}

export interface PrimitiveToken extends TokenBase {
  kind: 'primitive';
  value: string;
}

export interface SemanticToken extends TokenBase {
  kind: 'semantic';
  value: TokenValue;
}

export interface ComponentToken extends TokenBase {
  kind: 'component';
  value: TokenValue;
}

export interface ComponentVariant {
  componentName: string;
  variantGroup: string;
  variantName: string;
  classes: string;
}

export interface ComponentInfo {
  name: string;
  sourceFile: string;
  variants: Record<string, string[]>;
  defaultVariants: Record<string, string>;
  classesByVariant: Record<string, Record<string, string>>;
  baseClasses: string;
}

export interface TokenGraph {
  primitives: Record<string, PrimitiveToken>;
  semantics: Record<string, SemanticToken>;
  components: Record<string, ComponentInfo>;
  themes: ThemeId[];
}

export function tokenKey(token: {
  theme: ThemeId;
  mode: ColorMode;
  name: string;
}): string {
  return `${token.theme}::${token.mode}::${token.name}`;
}
