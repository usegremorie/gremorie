import type { Accent, Translucency } from '@/lib/appearance';

type Copy = {
  accent: string;
  accentHint: string;
  translucency: string;
  translucencyHint: string;
  modes: Record<Translucency, { name: string; hint: string }>;
  tonal: string;
  tonalOn: string;
  themeDark: string;
  themeLight: string;
  menu: string;
  colors: Record<Accent, string>;
};

const en: Copy = {
  accent: 'Accent color',
  accentHint: 'Changes primary buttons, switches and focus.',
  translucency: 'Translucency',
  translucencyHint: 'How much of the page shows through the interface.',
  modes: {
    solid: {
      name: 'Solid',
      hint: 'Nothing see-through. Opaque menus and cards.',
    },
    subtle: {
      name: 'Subtle',
      hint: 'Only menus, popovers and the top bar show what is behind.',
    },
    immersive: {
      name: 'Immersive',
      hint: 'The page takes the accent color and the interface turns translucent over it.',
    },
  },
  tonal: 'Tonal',
  tonalOn: 'Tonal on',
  themeDark: 'Dark theme',
  themeLight: 'Light theme',
  menu: 'Menu',
  colors: {
    neutral: 'Neutral',
    violet: 'Violet',
    blue: 'Blue',
    teal: 'Teal',
    green: 'Green',
    orange: 'Orange',
    rose: 'Rose',
    red: 'Red',
  },
};

const pt: Copy = {
  accent: 'Cor de destaque',
  accentHint: 'Muda a cor dos botões principais, do switch ligado e do foco.',
  translucency: 'Translucidez',
  translucencyHint: 'Quanto da página aparece através da interface.',
  modes: {
    solid: { name: 'Sólida', hint: 'Nada transparente. Menus e cards opacos.' },
    subtle: {
      name: 'Sutil',
      hint: 'Só menus, popovers e a barra do topo deixam ver o que está atrás.',
    },
    immersive: {
      name: 'Imersiva',
      hint: 'A página ganha a cor de destaque e a interface fica translúcida por cima.',
    },
  },
  tonal: 'Tonal',
  tonalOn: 'Tonal ligado',
  themeDark: 'Tema escuro',
  themeLight: 'Tema claro',
  menu: 'Menu',
  colors: {
    neutral: 'Neutro',
    violet: 'Violeta',
    blue: 'Azul',
    teal: 'Verde-azulado',
    green: 'Verde',
    orange: 'Laranja',
    rose: 'Rosa',
    red: 'Vermelho',
  },
};

export const copyFor = (lang: string): Copy => (lang === 'pt' ? pt : en);
