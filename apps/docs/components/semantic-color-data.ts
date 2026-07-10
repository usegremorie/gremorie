/**
 * Semantic token data for the six shipped themes.
 *
 * Hand-verified extraction from the CURRENT token sources:
 * - `packages/tokens/styles/theme.css` (base semantic layer: `:root` light
 *   plus `.dark`, consumed as-is by the Default theme)
 * - `packages/tokens/styles/themes/{claude,chatgpt,gemini,perplexity,mistral}.css`
 *   (per-theme override layers: `:root[data-theme='<id>']` and
 *   `:root[data-theme='<id>'].dark`)
 *
 * The file mirrors the CSS structure on purpose: a BASE map plus per-theme
 * OVERRIDE maps, so a diff against the css files stays trivial. Tokens a
 * theme does not override resolve to the base value, which is exactly the
 * shipped cascade behavior.
 *
 * Cascade note (matches the css): with a theme active in dark mode the
 * precedence is theme-dark > theme-light > base-dark > base-light, because
 * `:root[data-theme=...]` outranks the bare `.dark` selector. The resolver
 * below reproduces that order.
 *
 * Regenerate by hand whenever theme.css or any themes/*.css changes.
 * Quick check: `git diff packages/tokens/styles/` against this file.
 */
import { PRIMITIVE_COLOR_RAMPS } from './primitive-color-data';

/**
 * A declared value: either a primitive reference (e.g. 'gray-900', meaning
 * `var(--color-gray-900)`) or a literal CSS color (starts with 'oklch(').
 */
type Ref = string;

type TokenMap = Record<string, Ref>;

export const SEMANTIC_TOKEN_ORDER = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
] as const;

/* ── Base layer: theme.css `:root` (light) ─────────────────────────
 * card-foreground / popover-foreground are declared as var(--foreground)
 * in the css; they are recorded here already resolved to gray-950. */
const BASE_LIGHT: TokenMap = {
  background: 'gray-50',
  foreground: 'gray-950',
  card: 'gray-0',
  'card-foreground': 'gray-950',
  popover: 'gray-0',
  'popover-foreground': 'gray-950',
  primary: 'gray-900',
  'primary-foreground': 'gray-50',
  secondary: 'gray-100',
  'secondary-foreground': 'gray-900',
  muted: 'gray-100',
  'muted-foreground': 'gray-500',
  accent: 'gray-100',
  'accent-foreground': 'gray-900',
  destructive: 'red-600',
  'destructive-foreground': 'gray-50',
  border: 'gray-200',
  input: 'gray-200',
  ring: 'gray-400',
  'chart-1': 'oklch(0.646 0.222 41.116)',
  'chart-2': 'oklch(0.6 0.118 184.704)',
  'chart-3': 'oklch(0.398 0.07 227.392)',
  'chart-4': 'oklch(0.828 0.189 84.429)',
  'chart-5': 'oklch(0.769 0.188 70.08)',
  sidebar: 'gray-50',
  'sidebar-foreground': 'gray-950',
  'sidebar-primary': 'gray-900',
  'sidebar-primary-foreground': 'gray-50',
  'sidebar-accent': 'gray-100',
  'sidebar-accent-foreground': 'gray-900',
  'sidebar-border': 'gray-200',
  'sidebar-ring': 'gray-400',
};

/* ── Base layer: theme.css `.dark` ── */
const BASE_DARK: TokenMap = {
  background: 'gray-950',
  foreground: 'gray-50',
  card: 'gray-900',
  'card-foreground': 'gray-50',
  popover: 'gray-900',
  'popover-foreground': 'gray-50',
  primary: 'gray-100',
  'primary-foreground': 'gray-900',
  secondary: 'gray-800',
  'secondary-foreground': 'gray-50',
  muted: 'gray-800',
  'muted-foreground': 'gray-400',
  accent: 'gray-800',
  'accent-foreground': 'gray-50',
  destructive: 'red-400',
  'destructive-foreground': 'gray-50',
  border: 'oklch(1 0 0 / 10%)',
  input: 'oklch(1 0 0 / 15%)',
  ring: 'gray-500',
  'chart-1': 'oklch(0.488 0.243 264.376)',
  'chart-2': 'oklch(0.696 0.17 162.48)',
  'chart-3': 'oklch(0.769 0.188 70.08)',
  'chart-4': 'oklch(0.627 0.265 303.9)',
  'chart-5': 'oklch(0.645 0.246 16.439)',
  sidebar: 'gray-900',
  'sidebar-foreground': 'gray-50',
  'sidebar-primary': 'gray-100',
  'sidebar-primary-foreground': 'gray-900',
  'sidebar-accent': 'gray-800',
  'sidebar-accent-foreground': 'gray-50',
  'sidebar-border': 'oklch(1 0 0 / 10%)',
  'sidebar-ring': 'gray-500',
};

export interface SemanticThemeSource {
  id: string;
  name: string;
  /** Root selector that activates the theme. */
  selector: string;
  /** --radius-base the theme ships. */
  radius: string;
  description: { en: string; pt: string };
  /** Overrides on top of the base light layer. */
  light: TokenMap;
  /** Overrides on top of the cascade (theme light > base dark). */
  dark: TokenMap;
}

export const SEMANTIC_THEMES: SemanticThemeSource[] = [
  {
    id: 'default',
    name: 'Default',
    selector: ':root',
    radius: '0.625rem',
    description: {
      en: 'The base semantic layer itself, on the neutralized gray ramp. Conservative and brand-free; every other theme is an override layer on top of it.',
      pt: 'A propria camada semantica base, sobre a rampa gray neutralizada. Conservador e sem marca; todos os outros temas sao camadas de override por cima dele.',
    },
    light: {},
    dark: {},
  },
  {
    id: 'claude',
    name: 'Claude',
    selector: "[data-theme='claude']",
    radius: '0.5rem',
    description: {
      en: 'Warm clay (coral terracotta) on cream surfaces, taupe support, serif display. Dark mode sits on the warm charcoal of the real product.',
      pt: 'Clay quente (terracota coral) sobre superficies creme, apoio em taupe, display serifado. O dark mode usa o carvao quente do produto real.',
    },
    light: {
      background: 'oklch(0.965 0.011 92)',
      foreground: 'gray-950',
      card: 'oklch(0.985 0.008 92)',
      'card-foreground': 'gray-950',
      popover: 'oklch(0.985 0.008 92)',
      'popover-foreground': 'gray-950',
      primary: 'clay-500',
      'primary-foreground': 'gray-50',
      secondary: 'oklch(0.95 0.012 80)',
      'secondary-foreground': 'clay-900',
      muted: 'oklch(0.95 0.012 80)',
      'muted-foreground': 'taupe-600',
      accent: 'clay-100',
      'accent-foreground': 'clay-900',
      ring: 'clay-500',
      border: 'oklch(0.9 0.014 78)',
      input: 'oklch(0.9 0.014 78)',
      sidebar: 'oklch(0.97 0.01 84)',
      'sidebar-foreground': 'gray-950',
      'sidebar-primary': 'clay-600',
      'sidebar-primary-foreground': 'gray-50',
      'sidebar-accent': 'clay-100',
      'sidebar-accent-foreground': 'clay-900',
      'sidebar-border': 'oklch(0.9 0.014 78)',
      'sidebar-ring': 'clay-500',
      'chart-1': 'clay-500',
      'chart-2': 'clay-300',
      'chart-3': 'clay-700',
      'chart-4': 'taupe-400',
      'chart-5': 'amber-400',
    },
    dark: {
      background: 'oklch(0.235 0.006 100)',
      foreground: 'gray-50',
      card: 'oklch(0.268 0.005 100)',
      'card-foreground': 'gray-50',
      popover: 'oklch(0.268 0.005 100)',
      'popover-foreground': 'gray-50',
      primary: 'clay-400',
      'primary-foreground': 'gray-950',
      secondary: 'oklch(0.28 0.012 58)',
      'secondary-foreground': 'gray-50',
      muted: 'oklch(0.28 0.012 58)',
      'muted-foreground': 'taupe-300',
      accent: 'clay-900',
      'accent-foreground': 'clay-50',
      ring: 'clay-400',
      border: 'oklch(1 0 0 / 10%)',
      input: 'oklch(1 0 0 / 15%)',
      sidebar: 'oklch(0.24 0.012 60)',
      'sidebar-foreground': 'gray-50',
      'sidebar-primary': 'clay-400',
      'sidebar-primary-foreground': 'gray-950',
      'sidebar-accent': 'oklch(0.28 0.012 58)',
      'sidebar-accent-foreground': 'gray-50',
      'sidebar-border': 'oklch(1 0 0 / 10%)',
      'sidebar-ring': 'clay-400',
      'chart-1': 'clay-400',
      'chart-2': 'clay-200',
      'chart-3': 'clay-600',
      'chart-4': 'taupe-400',
      'chart-5': 'amber-400',
    },
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    selector: "[data-theme='chatgpt']",
    radius: '0.75rem',
    description: {
      en: 'Emerald accent on a flat, low-shadow surface. Dark mode uses the flat graphite of the real product; surfaces otherwise inherit the neutral base.',
      pt: 'Acento emerald sobre superficie flat de sombras suaves. O dark mode usa o grafite flat do produto real; as demais superficies herdam a base neutra.',
    },
    light: {
      primary: 'emerald-700',
      'primary-foreground': 'gray-50',
      accent: 'emerald-100',
      'accent-foreground': 'emerald-900',
      ring: 'emerald-500',
      'sidebar-primary': 'emerald-700',
      'sidebar-primary-foreground': 'gray-50',
      'sidebar-ring': 'emerald-500',
      'chart-1': 'emerald-500',
      'chart-2': 'emerald-300',
      'chart-3': 'teal-600',
      'chart-4': 'green-400',
      'chart-5': 'cyan-400',
    },
    dark: {
      background: 'oklch(0.248 0 0)',
      card: 'oklch(0.278 0 0)',
      popover: 'oklch(0.278 0 0)',
      primary: 'emerald-400',
      'primary-foreground': 'gray-950',
      accent: 'emerald-900',
      'accent-foreground': 'emerald-50',
      ring: 'emerald-400',
      'sidebar-primary': 'emerald-400',
      'sidebar-primary-foreground': 'gray-950',
      'sidebar-ring': 'emerald-400',
      'chart-1': 'emerald-400',
      'chart-2': 'emerald-200',
      'chart-3': 'teal-400',
      'chart-4': 'green-400',
      'chart-5': 'cyan-400',
    },
  },
  {
    id: 'gemini',
    name: 'Gemini',
    selector: "[data-theme='gemini']",
    radius: '1rem',
    description: {
      en: 'Google blue with a blue-to-purple chart ramp and the roundest radius of the set. Dark mode sits on the cool graphite of the real product.',
      pt: 'Azul Google com rampa de chart azul-para-roxo e o radius mais arredondado do conjunto. O dark mode usa o grafite frio do produto real.',
    },
    light: {
      primary: 'oklch(0.55 0.19 258)',
      'primary-foreground': 'gray-50',
      accent: 'indigo-100',
      'accent-foreground': 'indigo-900',
      ring: 'oklch(0.63 0.18 260)',
      'sidebar-primary': 'oklch(0.55 0.19 258)',
      'sidebar-primary-foreground': 'gray-50',
      'sidebar-ring': 'oklch(0.63 0.18 260)',
      'chart-1': 'oklch(0.63 0.18 260)',
      'chart-2': 'oklch(0.78 0.11 258)',
      'chart-3': 'oklch(0.629 0.136 304)',
      'chart-4': 'oklch(0.78 0.09 304)',
      'chart-5': 'oklch(0.53 0.2 276)',
    },
    dark: {
      background: 'oklch(0.239 0.002 248)',
      card: 'oklch(0.274 0.002 248)',
      popover: 'oklch(0.274 0.002 248)',
      primary: 'oklch(0.75 0.11 258)',
      'primary-foreground': 'gray-950',
      accent: 'indigo-900',
      'accent-foreground': 'indigo-50',
      ring: 'oklch(0.75 0.11 258)',
      'sidebar-primary': 'oklch(0.75 0.11 258)',
      'sidebar-primary-foreground': 'gray-950',
      'sidebar-ring': 'oklch(0.75 0.11 258)',
      'chart-1': 'oklch(0.75 0.11 258)',
      'chart-2': 'oklch(0.85 0.07 255)',
      'chart-3': 'oklch(0.72 0.12 304)',
      'chart-4': 'oklch(0.84 0.06 300)',
      'chart-5': 'oklch(0.68 0.14 276)',
    },
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    selector: "[data-theme='perplexity']",
    radius: '0.375rem',
    description: {
      en: 'True turquoise on offblack, sober and tight, with the smallest radius of the set. The light primary is the brand turquoise #20808D.',
      pt: 'Turquesa verdadeiro sobre offblack, sobrio e compacto, com o menor radius do conjunto. O primary claro e o turquesa de marca #20808D.',
    },
    light: {
      primary: 'oklch(0.553 0.086 208.5)',
      'primary-foreground': 'gray-0',
      accent: 'teal-100',
      'accent-foreground': 'teal-900',
      ring: 'oklch(0.553 0.086 208.5)',
      'sidebar-primary': 'oklch(0.553 0.086 208.5)',
      'sidebar-primary-foreground': 'gray-0',
      'sidebar-ring': 'oklch(0.553 0.086 208.5)',
      'chart-1': 'teal-600',
      'chart-2': 'teal-300',
      'chart-3': 'cyan-600',
      'chart-4': 'sky-400',
      'chart-5': 'emerald-400',
    },
    dark: {
      background: 'oklch(0.192 0.02 195.6)',
      card: 'oklch(0.225 0.018 196)',
      popover: 'oklch(0.225 0.018 196)',
      primary: 'oklch(0.72 0.11 205)',
      'primary-foreground': 'gray-950',
      accent: 'teal-900',
      'accent-foreground': 'teal-50',
      ring: 'oklch(0.72 0.11 205)',
      'sidebar-primary': 'oklch(0.72 0.11 205)',
      'sidebar-primary-foreground': 'gray-950',
      'sidebar-ring': 'oklch(0.72 0.11 205)',
      'chart-1': 'teal-400',
      'chart-2': 'teal-200',
      'chart-3': 'cyan-400',
      'chart-4': 'sky-400',
      'chart-5': 'emerald-400',
    },
  },
  {
    id: 'mistral',
    name: 'Mistral',
    selector: "[data-theme='mistral']",
    radius: '0.5rem',
    description: {
      en: 'Flame orange with a black-on-orange primary, matching Mistral brand usage. Surfaces inherit the neutral base in both modes.',
      pt: 'Laranja flame com primary preto-sobre-laranja, espelhando o uso de marca da Mistral. As superficies herdam a base neutra nos dois modos.',
    },
    light: {
      primary: 'orange-600',
      'primary-foreground': 'gray-950',
      accent: 'orange-100',
      'accent-foreground': 'orange-900',
      ring: 'orange-500',
      'sidebar-primary': 'orange-600',
      'sidebar-primary-foreground': 'gray-950',
      'sidebar-ring': 'orange-500',
      'chart-1': 'orange-500',
      'chart-2': 'orange-300',
      'chart-3': 'orange-700',
      'chart-4': 'amber-400',
      'chart-5': 'red-400',
    },
    dark: {
      primary: 'orange-400',
      'primary-foreground': 'gray-950',
      accent: 'orange-900',
      'accent-foreground': 'orange-50',
      ring: 'orange-400',
      'sidebar-primary': 'orange-400',
      'sidebar-primary-foreground': 'gray-950',
      'sidebar-ring': 'orange-400',
      'chart-1': 'orange-400',
      'chart-2': 'orange-200',
      'chart-3': 'orange-600',
      'chart-4': 'amber-400',
      'chart-5': 'red-400',
    },
  },
];

/* ── Resolver ── */

export interface ResolvedValue {
  /** What the css declares: a primitive name or a literal oklch color. */
  ref: Ref;
  /** Concrete CSS color, usable directly as a swatch background. */
  css: string;
  /** True when the theme does not override the token (base value applies). */
  inherited: boolean;
}

export interface ResolvedRow {
  token: string;
  light: ResolvedValue;
  dark: ResolvedValue;
}

function toCss(ref: Ref): string {
  if (ref.startsWith('oklch(')) return ref;
  const sep = ref.lastIndexOf('-');
  const ramp = ref.slice(0, sep);
  const step = ref.slice(sep + 1);
  const stop = PRIMITIVE_COLOR_RAMPS[ramp]?.find((s) => s.step === step);
  if (!stop) throw new Error(`Unknown primitive reference: ${ref}`);
  return stop.oklch;
}

/**
 * Resolves the full token table for a theme, applying the shipped cascade:
 * light = theme-light > base-light; dark = theme-dark > theme-light >
 * base-dark > base-light.
 */
export function resolveThemeRows(theme: SemanticThemeSource): ResolvedRow[] {
  return SEMANTIC_TOKEN_ORDER.map((token) => {
    const lightRef = theme.light[token] ?? BASE_LIGHT[token];
    const darkRef =
      theme.dark[token] ??
      theme.light[token] ??
      BASE_DARK[token] ??
      BASE_LIGHT[token];
    if (lightRef === undefined || darkRef === undefined) {
      throw new Error(`Token missing from the base layer: --${token}`);
    }
    return {
      token: `--${token}`,
      light: {
        ref: lightRef,
        css: toCss(lightRef),
        inherited: !(token in theme.light),
      },
      dark: {
        ref: darkRef,
        css: toCss(darkRef),
        inherited: !(token in theme.dark) && !(token in theme.light),
      },
    };
  });
}
