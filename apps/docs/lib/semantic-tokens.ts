/**
 * Semantic token data per theme — manually transcribed from
 * `packages/kds/src/styles/tokens/semantic/colors-*.css`. Keep in
 * sync when the source files change.
 */

export interface SemanticRow {
  token: string;
  primitiveLight: string;
  primitiveDark: string;
}

export interface SemanticTheme {
  id: string;
  name: string;
  description: string;
  radius: string;
  rows: SemanticRow[];
}

const ROW_ORDER = [
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
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
];

function row(token: string, light: string, dark: string): SemanticRow {
  return {
    token: `--${token}`,
    primitiveLight: light,
    primitiveDark: dark,
  };
}

export const SEMANTIC_THEMES: SemanticTheme[] = [
  {
    id: 'default',
    name: 'Default (Neutral)',
    description:
      'Tema base com `baseColor: neutral`. Ponto de partida quando o produto ainda não tem voz cromática.',
    radius: '0.625rem',
    rows: [
      row('background', 'white', 'neutral-950'),
      row('foreground', 'neutral-950', 'neutral-50'),
      row('card', 'white', 'neutral-900'),
      row('card-foreground', 'neutral-950', 'neutral-50'),
      row('popover', 'white', 'neutral-900'),
      row('popover-foreground', 'neutral-950', 'neutral-50'),
      row('primary', 'neutral-900', 'neutral-50'),
      row('primary-foreground', 'neutral-50', 'neutral-900'),
      row('secondary', 'neutral-100', 'neutral-800'),
      row('secondary-foreground', 'neutral-900', 'neutral-50'),
      row('muted', 'neutral-100', 'neutral-800'),
      row('muted-foreground', 'neutral-500', 'neutral-400'),
      row('accent', 'neutral-100', 'neutral-800'),
      row('accent-foreground', 'neutral-900', 'neutral-50'),
      row('destructive', 'red-600', 'red-700'),
      row('destructive-foreground', 'neutral-50', 'neutral-50'),
      row('border', 'neutral-200', 'neutral-700'),
      row('input', 'neutral-200', 'neutral-700'),
      row('ring', 'neutral-400', 'neutral-500'),
      row('sidebar', 'neutral-50', 'neutral-900'),
      row('sidebar-foreground', 'neutral-950', 'neutral-50'),
      row('sidebar-primary', 'neutral-900', 'neutral-50'),
      row('sidebar-primary-foreground', 'neutral-50', 'neutral-900'),
      row('sidebar-accent', 'neutral-100', 'neutral-800'),
      row('sidebar-accent-foreground', 'neutral-900', 'neutral-50'),
      row('sidebar-border', 'neutral-200', 'neutral-700'),
      row('sidebar-ring', 'neutral-400', 'neutral-500'),
    ],
  },
  {
    id: 'amber-minimal',
    name: 'Amber Minimal',
    description:
      'Importado do tweakcn. Brand amber sobre neutros frios — funciona para produtos warm-tech, fitness, criativo. Toque institucional sem perder personalidade.',
    radius: '0.375rem',
    rows: [
      row('background', 'white', 'neutral-900'),
      row('foreground', 'neutral-800', 'neutral-200'),
      row('card', 'white', 'neutral-800'),
      row('card-foreground', 'neutral-800', 'neutral-200'),
      row('popover', 'white', 'neutral-800'),
      row('popover-foreground', 'neutral-800', 'neutral-200'),
      row('primary', 'amber-500', 'amber-500'),
      row('primary-foreground', 'black', 'black'),
      row('secondary', 'gray-100', 'neutral-800'),
      row('secondary-foreground', 'gray-600', 'neutral-200'),
      row('muted', 'gray-50', 'olive-900'),
      row('muted-foreground', 'gray-500', 'neutral-400'),
      row('accent', 'amber-50', 'amber-800'),
      row('accent-foreground', 'amber-800', 'amber-200'),
      row('destructive', 'red-500', 'red-500'),
      row('destructive-foreground', 'white', 'white'),
      row('border', 'gray-200', 'neutral-700'),
      row('input', 'gray-200', 'neutral-700'),
      row('ring', 'amber-500', 'amber-500'),
      row('sidebar', 'gray-50', 'olive-950'),
      row('sidebar-foreground', 'neutral-800', 'neutral-200'),
      row('sidebar-primary', 'amber-500', 'amber-500'),
      row('sidebar-primary-foreground', 'white', 'white'),
      row('sidebar-accent', 'amber-50', 'amber-800'),
      row('sidebar-accent-foreground', 'amber-800', 'amber-200'),
      row('sidebar-border', 'gray-200', 'neutral-700'),
      row('sidebar-ring', 'amber-500', 'amber-500'),
    ],
  },
  {
    id: 'amethyst-haze',
    name: 'Amethyst Haze',
    description:
      'Lavanda dessaturada sobre mauve. Personalidade etérea — aproxima de produtos editoriais, contemplativos, AI-first. O brand aqui é discreto: o tom do produto vem mais do espaçamento e da tipografia.',
    radius: '0.5rem',
    rows: [
      row('background', 'slate-50', 'mauve-900'),
      row('foreground', 'gray-700', 'zinc-200'),
      row('card', 'white', 'mauve-800'),
      row('card-foreground', 'gray-700', 'zinc-200'),
      row('popover', 'white', 'mauve-800'),
      row('popover-foreground', 'gray-700', 'zinc-200'),
      row('primary', 'slate-500', 'slate-400'),
      row('primary-foreground', 'slate-50', 'mauve-900'),
      row('secondary', 'violet-200', 'slate-600'),
      row('secondary-foreground', 'gray-700', 'zinc-200'),
      row('muted', 'gray-300', 'mauve-800'),
      row('muted-foreground', 'mauve-500', 'zinc-400'),
      row('accent', 'rose-300', 'mauve-700'),
      row('accent-foreground', 'mauve-700', 'red-200'),
      row('destructive', 'red-400', 'red-400'),
      row('destructive-foreground', 'slate-50', 'mauve-900'),
      row('border', 'mauve-300', 'slate-800'),
      row('input', 'gray-200', 'gray-800'),
      row('ring', 'slate-500', 'slate-400'),
      row('sidebar', 'mauve-100', 'mauve-900'),
      row('sidebar-foreground', 'gray-700', 'zinc-200'),
      row('sidebar-primary', 'slate-500', 'slate-400'),
      row('sidebar-primary-foreground', 'slate-50', 'mauve-900'),
      row('sidebar-accent', 'rose-300', 'mauve-700'),
      row('sidebar-accent-foreground', 'mauve-700', 'red-200'),
      row('sidebar-border', 'mauve-300', 'gray-800'),
      row('sidebar-ring', 'slate-500', 'slate-400'),
    ],
  },
  {
    id: 'claude',
    name: 'Claude',
    description:
      'Stone, taupe, olive e amber. Pegada terrosa, editorial, próxima de papel. Funciona para AI consumer-facing, conteúdo longo-form, marcas com personalidade humana.',
    radius: '0.5rem',
    rows: [
      row('background', 'stone-50', 'neutral-800'),
      row('foreground', 'taupe-700', 'taupe-300'),
      row('card', 'stone-50', 'neutral-800'),
      row('card-foreground', 'neutral-900', 'stone-50'),
      row('popover', 'white', 'olive-800'),
      row('popover-foreground', 'taupe-800', 'stone-200'),
      row('primary', 'amber-700', 'amber-600'),
      row('primary-foreground', 'white', 'white'),
      row('secondary', 'olive-200', 'stone-50'),
      row('secondary-foreground', 'stone-600', 'olive-800'),
      row('muted', 'olive-200', 'stone-900'),
      row('muted-foreground', 'olive-500', 'olive-400'),
      row('accent', 'olive-200', 'stone-900'),
      row('accent-foreground', 'taupe-800', 'olive-100'),
      row('destructive', 'neutral-900', 'red-500'),
      row('destructive-foreground', 'white', 'white'),
      row('border', 'olive-300', 'neutral-700'),
      row('input', 'olive-400', 'stone-600'),
      row('ring', 'amber-700', 'amber-600'),
      row('sidebar', 'stone-50', 'neutral-800'),
      row('sidebar-foreground', 'taupe-700', 'taupe-300'),
      row('sidebar-primary', 'amber-700', 'amber-600'),
      row('sidebar-primary-foreground', 'white', 'white'),
      row('sidebar-accent', 'olive-200', 'stone-900'),
      row('sidebar-accent-foreground', 'taupe-800', 'olive-100'),
      row('sidebar-border', 'olive-300', 'neutral-700'),
      row('sidebar-ring', 'amber-700', 'amber-600'),
    ],
  },
];

export { ROW_ORDER };
