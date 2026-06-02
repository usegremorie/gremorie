/**
 * Typography token data — manually transcribed from
 * `packages/kds/src/styles/tokens/primitive/typography.css`.
 * Small, stable scale; not worth a generator.
 */

export interface TypeSizeRow {
  token: string;
  utility: string;
  size: string; // rem value as written in source
  px: string; // computed at base 16
  lineHeight: string; // computed line-height ratio rounded
  useCase: string;
}

export interface TypeWeightRow {
  token: string;
  utility: string;
  value: number;
  useCase: string;
}

export interface LeadingRow {
  token: string;
  utility: string;
  value: string;
  useCase: string;
}

export interface TrackingRow {
  token: string;
  utility: string;
  value: string;
  useCase: string;
}

export const TYPE_SIZES: TypeSizeRow[] = [
  {
    token: '--text-xs',
    utility: 'text-xs',
    size: '0.75rem',
    px: '12px',
    lineHeight: '1.333 (16px)',
    useCase: 'Captions, labels secundários, microcópia',
  },
  {
    token: '--text-sm',
    utility: 'text-sm',
    size: '0.875rem',
    px: '14px',
    lineHeight: '1.429 (20px)',
    useCase: 'Texto compacto em UI densa, tabelas',
  },
  {
    token: '--text-base',
    utility: 'text-base',
    size: '1rem',
    px: '16px',
    lineHeight: '1.5 (24px)',
    useCase: 'Body padrão. Default do sistema.',
  },
  {
    token: '--text-lg',
    utility: 'text-lg',
    size: '1.125rem',
    px: '18px',
    lineHeight: '1.556 (28px)',
    useCase: 'Body em conteúdo editorial, leitura longa',
  },
  {
    token: '--text-xl',
    utility: 'text-xl',
    size: '1.25rem',
    px: '20px',
    lineHeight: '1.4 (28px)',
    useCase: 'Subtítulos, lead paragraphs',
  },
  {
    token: '--text-2xl',
    utility: 'text-2xl',
    size: '1.5rem',
    px: '24px',
    lineHeight: '1.333 (32px)',
    useCase: 'H3 / títulos de cards',
  },
  {
    token: '--text-3xl',
    utility: 'text-3xl',
    size: '1.875rem',
    px: '30px',
    lineHeight: '1.2 (36px)',
    useCase: 'H2 / títulos de seção',
  },
  {
    token: '--text-4xl',
    utility: 'text-4xl',
    size: '2.25rem',
    px: '36px',
    lineHeight: '1.111 (40px)',
    useCase: 'H1 em apps; H2 em landing pages',
  },
  {
    token: '--text-5xl',
    utility: 'text-5xl',
    size: '3rem',
    px: '48px',
    lineHeight: '1',
    useCase: 'Hero pequeno, números grandes em KPIs',
  },
  {
    token: '--text-6xl',
    utility: 'text-6xl',
    size: '3.75rem',
    px: '60px',
    lineHeight: '1',
    useCase: 'Hero médio em landing pages',
  },
  {
    token: '--text-7xl',
    utility: 'text-7xl',
    size: '4.5rem',
    px: '72px',
    lineHeight: '1',
    useCase: 'Hero grande, displays editoriais',
  },
  {
    token: '--text-8xl',
    utility: 'text-8xl',
    size: '6rem',
    px: '96px',
    lineHeight: '1',
    useCase: 'Display gigante, manchete de portfolio',
  },
  {
    token: '--text-9xl',
    utility: 'text-9xl',
    size: '8rem',
    px: '128px',
    lineHeight: '1',
    useCase: 'Display extremo. Use com parcimônia.',
  },
];

export const TYPE_WEIGHTS: TypeWeightRow[] = [
  {
    token: '--font-weight-thin',
    utility: 'font-thin',
    value: 100,
    useCase: 'Display somente — ilegível em corpo',
  },
  {
    token: '--font-weight-extralight',
    utility: 'font-extralight',
    value: 200,
    useCase: 'Display refinado em telas grandes',
  },
  {
    token: '--font-weight-light',
    utility: 'font-light',
    value: 300,
    useCase: 'Editorial, textos longos com pegada elegante',
  },
  {
    token: '--font-weight-normal',
    utility: 'font-normal',
    value: 400,
    useCase: 'Body padrão',
  },
  {
    token: '--font-weight-medium',
    utility: 'font-medium',
    value: 500,
    useCase: 'Botões, navs — peso intermediário',
  },
  {
    token: '--font-weight-semibold',
    utility: 'font-semibold',
    value: 600,
    useCase: 'Headings de UI, labels enfáticos',
  },
  {
    token: '--font-weight-bold',
    utility: 'font-bold',
    value: 700,
    useCase: 'Headings principais, ênfase forte',
  },
  {
    token: '--font-weight-extrabold',
    utility: 'font-extrabold',
    value: 800,
    useCase: 'Display, branding',
  },
  {
    token: '--font-weight-black',
    utility: 'font-black',
    value: 900,
    useCase: 'Display extremo. Pode sobrecarregar a página.',
  },
];

export const LEADINGS: LeadingRow[] = [
  {
    token: '--leading-tight',
    utility: 'leading-tight',
    value: '1.25',
    useCase: 'Headings grandes — fecha o espaço entre linhas',
  },
  {
    token: '--leading-snug',
    utility: 'leading-snug',
    value: '1.375',
    useCase: 'Subtítulos e UI compacta',
  },
  {
    token: '--leading-normal',
    utility: 'leading-normal',
    value: '1.5',
    useCase: 'Body padrão',
  },
  {
    token: '--leading-relaxed',
    utility: 'leading-relaxed',
    value: '1.625',
    useCase: 'Editorial, leitura longa, posts de blog',
  },
  {
    token: '--leading-loose',
    utility: 'leading-loose',
    value: '2',
    useCase: 'Citações, poesia, espaçamento dramático',
  },
];

export const TRACKINGS: TrackingRow[] = [
  {
    token: '--tracking-tighter',
    utility: 'tracking-tighter',
    value: '-0.05em',
    useCase: 'Display gigante — corrige spacing exagerado',
  },
  {
    token: '--tracking-tight',
    utility: 'tracking-tight',
    value: '-0.025em',
    useCase: 'Headings grandes',
  },
  {
    token: '--tracking-normal',
    utility: 'tracking-normal',
    value: '0em',
    useCase: 'Body padrão',
  },
  {
    token: '--tracking-wide',
    utility: 'tracking-wide',
    value: '0.025em',
    useCase: 'Caps, eyebrows, microcópia',
  },
  {
    token: '--tracking-wider',
    utility: 'tracking-wider',
    value: '0.05em',
    useCase: 'All-caps em UI compacta',
  },
  {
    token: '--tracking-widest',
    utility: 'tracking-widest',
    value: '0.1em',
    useCase: 'Eyebrows dramáticos, branding',
  },
];

export const FONT_FAMILIES = [
  {
    token: '--font-sans',
    utility: 'font-sans',
    description:
      'Sistema operacional do usuário — sem download, máxima performance. ui-sans-serif, system-ui, sans-serif e fallbacks de emoji.',
  },
  {
    token: '--font-serif',
    utility: 'font-serif',
    description:
      'Pilha serif do sistema — Georgia, Cambria, Times. Para conteúdo editorial e displays com tom literário.',
  },
  {
    token: '--font-mono',
    utility: 'font-mono',
    description:
      'Pilha monoespaçada — SFMono, Menlo, Monaco, Consolas. Para código, tokens, valores numéricos alinhados.',
  },
];
