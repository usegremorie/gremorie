/** Every theme the build emits. 'default' is the base layer itself. */
export const THEMES = [
  'default',
  'claude',
  'chatgpt',
  'gemini',
  'perplexity',
  'mistral',
] as const;
export type ThemeId = (typeof THEMES)[number];
export type NamedTheme = Exclude<ThemeId, 'default'>;
export const MODES = ['light', 'dark'] as const;
export type Mode = (typeof MODES)[number];
export type Layer =
  | 'primitive'
  | 'semantic-light'
  | 'semantic-dark'
  | 'theme-light'
  | 'theme-dark';
export type CssBlock = '@theme' | ':root';

/**
 * Primitive files, in build order, and the CSS block each one is written to.
 * Shadows live in :root, as in 0.8.0, so Tailwind keeps seeing them there.
 */
export const PRIMITIVE_FILES: Readonly<Record<string, CssBlock>> = {
  'primitive/color.json': '@theme',
  'primitive/radius.json': '@theme',
  'primitive/font.json': '@theme',
  'primitive/spacing.json': '@theme',
  'primitive/shadow.json': ':root',
};
/** Where a primitive file written to :root sits among the semantics. */
export interface Placement {
  file: string;
  after: string;
}
/** In 0.8.0 the shadows follow the sidebar tokens and precede the charts. */
export const ROOT_PLACEMENT: Placement = {
  file: 'primitive/shadow.json',
  after: '--sidebar-ring',
};
export const SEMANTIC_FILES = {
  light: 'semantic/light.json',
  dark: 'semantic/dark.json',
} as const;
export const themeFile = (theme: NamedTheme): string => `themes/${theme}.json`;

/** Raw CSS for a value DTCG cannot express: { value: string }. */
export const CSS_EXTENSION = 'com.gremorie.css';
/** A dimension computed from another one: { from: '{radius.base}', multiply }. */
export const DERIVE_EXTENSION = 'com.gremorie.derive';
/** Set by the composer only, never in source files. */
export const BUILD_EXTENSION = 'com.gremorie.build';

export type DtcgType = 'color' | 'dimension' | 'fontFamily' | 'shadow';
export const DTCG_TYPES: readonly DtcgType[] = [
  'color',
  'dimension',
  'fontFamily',
  'shadow',
];

export interface DtcgColor {
  colorSpace: 'oklch';
  components: [number, number, number];
  alpha?: number;
}
export interface DtcgDimension {
  value: number;
  unit: 'px' | 'rem';
}
export interface DtcgShadowLayer {
  color: DtcgColor;
  offsetX: DtcgDimension;
  offsetY: DtcgDimension;
  blur: DtcgDimension;
  spread: DtcgDimension;
  inset?: boolean;
}
export type DtcgShadow = DtcgShadowLayer | DtcgShadowLayer[];
export type DtcgValue = DtcgColor | DtcgDimension | string[] | DtcgShadow;
export interface Derive {
  from: string;
  multiply: number;
}
export interface BuildMeta {
  layer: Layer;
  file: string;
  order: number;
}
export interface DtcgToken {
  $type: DtcgType;
  $value: DtcgValue | string;
  $description?: string;
  $extensions?: Record<string, unknown>;
}
export type DtcgGroup = { [key: string]: unknown };

export const isToken = (v: unknown): v is DtcgToken =>
  typeof v === 'object' && v !== null && '$value' in v;
export const isAlias = (v: unknown): v is string =>
  typeof v === 'string' && /^\{[^{}]+\}$/.test(v);
export const aliasPath = (alias: string): string[] =>
  alias.slice(1, -1).split('.');
