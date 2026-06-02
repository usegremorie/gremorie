/**
 * Spacing, radius, shadow and motion token data — manually
 * transcribed from `packages/kds/src/styles/tokens/primitive/*.css`.
 */

export interface SpacingRow {
  step: number; // multiplier of --spacing
  utility: string;
  rem: string;
  px: string;
  useCase: string;
}

export interface RadiusRow {
  token: string;
  utility: string;
  rem: string;
  px: string;
  useCase: string;
}

export interface ShadowRow {
  token: string;
  utility: string;
  definition: string;
  useCase: string;
}

export interface EaseRow {
  token: string;
  utility: string;
  value: string;
  useCase: string;
}

export interface DurationRow {
  token: string;
  ms: string;
  useCase: string;
}

/**
 * Tailwind v4 derives every spacing utility from `--spacing` (0.25rem
 * = 4px). The scale is linear: `p-N` = `calc(var(--spacing) * N)`.
 * Rather than enumerate hundreds of stops, we surface a representative
 * subset that covers practical usage.
 */
export const SPACING_STEPS: SpacingRow[] = [
  {
    step: 0,
    utility: 'p-0',
    rem: '0rem',
    px: '0px',
    useCase: 'Zero espaço — reset',
  },
  {
    step: 0.5,
    utility: 'p-0.5',
    rem: '0.125rem',
    px: '2px',
    useCase: 'Hairline — bordas, separadores ultra-finos',
  },
  {
    step: 1,
    utility: 'p-1',
    rem: '0.25rem',
    px: '4px',
    useCase: 'Padding mínimo de UI compacta',
  },
  {
    step: 1.5,
    utility: 'p-1.5',
    rem: '0.375rem',
    px: '6px',
    useCase: 'Pill / tag interno',
  },
  {
    step: 2,
    utility: 'p-2',
    rem: '0.5rem',
    px: '8px',
    useCase: 'Padding interno de inputs e botões pequenos',
  },
  {
    step: 3,
    utility: 'p-3',
    rem: '0.75rem',
    px: '12px',
    useCase: 'Espaçamento entre elementos relacionados',
  },
  {
    step: 4,
    utility: 'p-4',
    rem: '1rem',
    px: '16px',
    useCase: 'Padding padrão de cards e containers',
  },
  {
    step: 5,
    utility: 'p-5',
    rem: '1.25rem',
    px: '20px',
    useCase: 'Padding intermediário',
  },
  {
    step: 6,
    utility: 'p-6',
    rem: '1.5rem',
    px: '24px',
    useCase: 'Padding amplo de cards, gap entre seções',
  },
  {
    step: 8,
    utility: 'p-8',
    rem: '2rem',
    px: '32px',
    useCase: 'Espaçamento entre blocos',
  },
  {
    step: 10,
    utility: 'p-10',
    rem: '2.5rem',
    px: '40px',
    useCase: 'Espaçamento generoso',
  },
  {
    step: 12,
    utility: 'p-12',
    rem: '3rem',
    px: '48px',
    useCase: 'Padding hero',
  },
  {
    step: 16,
    utility: 'p-16',
    rem: '4rem',
    px: '64px',
    useCase: 'Margens de seção em landings',
  },
  {
    step: 20,
    utility: 'p-20',
    rem: '5rem',
    px: '80px',
    useCase: 'Espaçamento entre seções em landings',
  },
  {
    step: 24,
    utility: 'p-24',
    rem: '6rem',
    px: '96px',
    useCase: 'Padding de hero generoso',
  },
  {
    step: 32,
    utility: 'p-32',
    rem: '8rem',
    px: '128px',
    useCase: 'Espaçamento dramático',
  },
  {
    step: 48,
    utility: 'p-48',
    rem: '12rem',
    px: '192px',
    useCase: 'Display, ilustrações ocupando largura',
  },
  {
    step: 64,
    utility: 'p-64',
    rem: '16rem',
    px: '256px',
    useCase: 'Larguras fixas grandes (sidebars, hero columns)',
  },
  {
    step: 96,
    utility: 'p-96',
    rem: '24rem',
    px: '384px',
    useCase: 'Larguras gigantes (extremo da escala)',
  },
];

export const RADIUS_TOKENS: RadiusRow[] = [
  {
    token: '--radius-xs',
    utility: 'rounded-xs',
    rem: '0.125rem',
    px: '2px',
    useCase: 'Toque de suavização — quase reto',
  },
  {
    token: '--radius-sm',
    utility: 'rounded-sm',
    rem: '0.25rem',
    px: '4px',
    useCase: 'Inputs em tema austero, separadores',
  },
  {
    token: '--radius-md',
    utility: 'rounded-md',
    rem: '0.375rem',
    px: '6px',
    useCase: 'Default de inputs e botões pequenos',
  },
  {
    token: '--radius-lg',
    utility: 'rounded-lg',
    rem: '0.5rem',
    px: '8px',
    useCase: 'Cards, modais, painéis',
  },
  {
    token: '--radius-xl',
    utility: 'rounded-xl',
    rem: '0.75rem',
    px: '12px',
    useCase: 'Cards generosos, surfaces friendly',
  },
  {
    token: '--radius-2xl',
    utility: 'rounded-2xl',
    rem: '1rem',
    px: '16px',
    useCase: 'Cards arredondados, pegada moderna',
  },
  {
    token: '--radius-3xl',
    utility: 'rounded-3xl',
    rem: '1.5rem',
    px: '24px',
    useCase: 'Cards muito arredondados, pílulas grandes',
  },
  {
    token: '--radius-4xl',
    utility: 'rounded-4xl',
    rem: '2rem',
    px: '32px',
    useCase: 'Surfaces blob-style, ilustrações',
  },
];

export const SHADOW_TOKENS: ShadowRow[] = [
  {
    token: '--shadow-2xs',
    utility: 'shadow-2xs',
    definition: '0 1px rgb(0 0 0 / 0.05)',
    useCase: 'Hairline shadow — separação sutil sem profundidade real',
  },
  {
    token: '--shadow-xs',
    utility: 'shadow-xs',
    definition: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    useCase: 'Inputs e cards de baixa elevação',
  },
  {
    token: '--shadow-sm',
    utility: 'shadow-sm',
    definition: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    useCase: 'Cards default, dropdowns rasos',
  },
  {
    token: '--shadow-md',
    utility: 'shadow-md',
    definition:
      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    useCase: 'Cards interativos, hover de cards estáticos',
  },
  {
    token: '--shadow-lg',
    utility: 'shadow-lg',
    definition:
      '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    useCase: 'Popovers, dropdowns, tooltips',
  },
  {
    token: '--shadow-xl',
    utility: 'shadow-xl',
    definition:
      '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    useCase: 'Modais e dialogs',
  },
  {
    token: '--shadow-2xl',
    utility: 'shadow-2xl',
    definition: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    useCase: 'Drawers, fullscreen overlays',
  },
];

export const INSET_SHADOWS: ShadowRow[] = [
  {
    token: '--inset-shadow-2xs',
    utility: 'inset-shadow-2xs',
    definition: 'inset 0 1px rgb(0 0 0 / 0.05)',
    useCase: 'Detalhe sutil em superfícies pressed',
  },
  {
    token: '--inset-shadow-xs',
    utility: 'inset-shadow-xs',
    definition: 'inset 0 1px 1px rgb(0 0 0 / 0.05)',
    useCase: 'Inputs rebaixados',
  },
  {
    token: '--inset-shadow-sm',
    utility: 'inset-shadow-sm',
    definition: 'inset 0 2px 4px rgb(0 0 0 / 0.05)',
    useCase: 'Wells, áreas de input afundadas',
  },
];

export const EASE_TOKENS: EaseRow[] = [
  {
    token: '--ease-in',
    utility: 'ease-in',
    value: 'cubic-bezier(0.4, 0, 1, 1)',
    useCase: 'Saídas — elemento começa lento e acelera para fora',
  },
  {
    token: '--ease-out',
    utility: 'ease-out',
    value: 'cubic-bezier(0, 0, 0.2, 1)',
    useCase: 'Entradas — elemento entra rápido e desacelera (mais natural)',
  },
  {
    token: '--ease-in-out',
    utility: 'ease-in-out',
    value: 'cubic-bezier(0.4, 0, 0.2, 1)',
    useCase: 'Transições simétricas — toggles, expansões',
  },
];

export const DURATION_TOKENS: DurationRow[] = [
  {
    token: 'Default',
    ms: '150ms',
    useCase: 'Transições padrão de UI (hover, focus)',
  },
  {
    token: 'Fast',
    ms: '75-100ms',
    useCase: 'Microinterações imperceptíveis (cor, opacity)',
  },
  {
    token: 'Medium',
    ms: '200-300ms',
    useCase: 'Acordeões, drawers, dialogs',
  },
  {
    token: 'Slow',
    ms: '400-500ms',
    useCase: 'Page transitions, animações narrativas',
  },
];

export const ANIMATIONS = [
  {
    token: '--animate-spin',
    utility: 'animate-spin',
    value: 'spin 1s linear infinite',
    useCase: 'Loaders rotativos',
  },
  {
    token: '--animate-ping',
    utility: 'animate-ping',
    value: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
    useCase: 'Pulsos de notificação (badge não-lida)',
  },
  {
    token: '--animate-pulse',
    utility: 'animate-pulse',
    value: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    useCase: 'Skeletons, placeholders de loading',
  },
  {
    token: '--animate-bounce',
    utility: 'animate-bounce',
    value: 'bounce 1s infinite',
    useCase: 'Indicadores de scroll, chamados de atenção',
  },
];
