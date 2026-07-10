/**
 * Grouped renderers for the primitive color ramps page
 * (/tokens/primitive/colors).
 *
 * Data comes from `primitive-color-data.ts` (extracted from
 * `packages/tokens/styles/theme.css`); the table itself is the shared
 * `ColorPaletteTable` from `token-tables.tsx`. This file only adds the
 * grouping, the per-ramp copy (EN and PT), and a compact anchor index.
 */
import {
  PRIMITIVE_COLOR_RAMPS,
  type PrimitiveColorStop,
} from './primitive-color-data';
import { ColorPaletteTable, type ColorPalette } from './token-tables';

type Locale = 'en' | 'pt';

export type RampGroup = 'neutrals' | 'brand' | 'warm' | 'cool' | 'accents';

export const RAMP_GROUPS: Record<RampGroup, string[]> = {
  neutrals: [
    'gray',
    'slate',
    'zinc',
    'neutral',
    'stone',
    'mauve',
    'olive',
    'mist',
    'taupe',
  ],
  brand: ['clay'],
  warm: ['red', 'orange', 'amber', 'yellow', 'lime', 'green'],
  cool: [
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
  ],
  accents: ['fuchsia', 'pink', 'rose'],
};

const RAMP_NAMES: Record<string, string> = {
  gray: 'Gray',
  slate: 'Slate',
  zinc: 'Zinc',
  neutral: 'Neutral',
  stone: 'Stone',
  mauve: 'Mauve',
  olive: 'Olive',
  mist: 'Mist',
  taupe: 'Taupe',
  clay: 'Clay',
  red: 'Red',
  orange: 'Orange',
  amber: 'Amber',
  yellow: 'Yellow',
  lime: 'Lime',
  green: 'Green',
  emerald: 'Emerald',
  teal: 'Teal',
  cyan: 'Cyan',
  sky: 'Sky',
  blue: 'Blue',
  indigo: 'Indigo',
  violet: 'Violet',
  purple: 'Purple',
  fuchsia: 'Fuchsia',
  pink: 'Pink',
  rose: 'Rose',
};

const DESCRIPTIONS: Record<Locale, Record<string, string>> = {
  en: {
    gray: 'Pure zero-chroma neutral and the working gray of the system: the default theme resolves its semantic intents here. The extra 0 stop is pure white, used for elevated surfaces (card, popover) in light mode.',
    slate:
      'Cool neutral with a subtle blue bias. Serious UI chrome, corporate dashboards, and products where credibility outweighs personality.',
    zinc: 'Slightly violet, more technical neutral. Good on product surfaces that want a gray with character without committing to a declared color.',
    neutral:
      'The canonical Tailwind zero-chroma gray, kept for compatibility. Nearly identical to gray, minus the 0 stop and with the stock 600 and 700 values.',
    stone:
      'Warm, earthy neutral. Mixes well with the amber and orange ramps and with editorial tones.',
    mauve:
      'Neutral with a subtle violet-pink bias, synthesized for Gremorie. Adds sophistication without leaving neutral territory.',
    olive:
      'Yellow-green earthy neutral, synthesized for Gremorie. Complements amber and stone in editorial layouts and organic-feeling interfaces.',
    mist: 'Neutral with a micro cyan bias, synthesized for Gremorie. Useful when the product wants a gray cooler than slate without tipping into blue.',
    taupe:
      'Warm neutral between stone and mauve, earthy with a pink nuance. Synthesized for Gremorie; the Claude theme uses it for muted text and chart fills.',
    clay: "Warm coral terracotta anchored on Claude's brand color: clay-500 is exactly #D97757 and the rest of the ramp is derived from it. The Claude theme binds its primary to clay-500 in light mode and clay-400 in dark mode.",
    red: 'Classic high-contrast red. Reserved for destruction, critical failures, and unambiguous error states. The default theme binds destructive to red-600 (light) and red-400 (dark).',
    orange:
      'Warm and energetic, more approachable than red. Good for enthusiastic CTAs, non-critical alerts, and discovery elements.',
    amber:
      'Luminous gold. Works well for warnings, premium badges, and warm highlights.',
    yellow:
      'Pure, high-value yellow. Use with care: contrast over white is treacherous, so prefer stops 600 and above for text.',
    lime: 'Acid lime green with attitude. Works for tech-forward and fitness brands; hard to combine with conservative palettes.',
    green:
      'The classic growth green. In UI it signals progress and generic approval.',
    emerald:
      'A cooler, more sophisticated green and the usual success hue. Pairs well with slate and gray.',
    teal: 'The balance point between green and blue. Ideal for calm brands and health, finance, or wellness products.',
    cyan: 'Vibrant light blue, almost electric. A tech accent without falling into corporate blue.',
    sky: 'Light, airy blue and the usual info hue. Friendlier than blue while keeping the technical character.',
    blue: 'The classic digital product blue. The safe, versatile default for links and primary actions.',
    indigo:
      'Deep blue with a violet pull. More editorial and premium than blue; suits nocturnal products and technical brands.',
    violet:
      'Balanced purple. Works as an accent without dominating the palette.',
    purple:
      'More saturated than violet, close to magenta at stop 500. Use for creativity, beta features, and differentiation.',
    fuchsia:
      'Vibrant magenta, almost neon. A discovery and novelty color; hard to combine with conservative palettes.',
    pink: 'Warm, social pink. Suits interfaces that want warmth and closeness, like community and wellbeing products.',
    rose: 'Elegant red-leaning pink. Combines particularly well with stone and taupe.',
  },
  pt: {
    gray: 'Neutro puro (chroma zero) e o cinza de trabalho do sistema: o tema default resolve as intenções semânticas aqui. O stop extra 0 é branco puro, usado em superfícies elevadas (card, popover) no modo claro.',
    slate:
      'Neutro frio com leve viés azulado. Ideal para chrome de UI sério, dashboards corporativos e produtos onde a credibilidade pesa mais que a personalidade.',
    zinc: 'Neutro levemente roxo, mais técnico. Bom em superfícies de produto que querem um cinza com caráter sem cair em uma cor declarada.',
    neutral:
      'O cinza chroma-zero canônico do Tailwind, mantido por compatibilidade. Quase idêntico ao gray, sem o stop 0 e com os valores originais de 600 e 700.',
    stone:
      'Neutro quente, terroso. Mistura bem com as rampas amber e orange e com tons editoriais.',
    mauve:
      'Neutro com viés violeta-rosado sutil, sintetizado para o Gremorie. Adiciona sofisticação sem sair do território neutro.',
    olive:
      'Neutro verde-amarelado, terroso, sintetizado para o Gremorie. Complementa amber e stone em layouts editoriais e interfaces orgânicas.',
    mist: 'Neutro com micro-viés ciano, sintetizado para o Gremorie. Útil quando o produto pede um cinza mais frio que slate sem tombar para o azul.',
    taupe:
      'Neutro morno entre stone e mauve, terroso com nuance rosada. Sintetizado para o Gremorie; o tema Claude usa taupe para texto muted e fills de chart.',
    clay: 'Terracota coral quente ancorada na cor de marca do Claude: clay-500 é exatamente #D97757 e o resto da rampa deriva dela. O tema Claude usa clay-500 como primary no modo claro e clay-400 no escuro.',
    red: 'Vermelho clássico, alto contraste. Reservado para destruição, falhas críticas e estados de erro inequívocos. O tema default liga destructive a red-600 (claro) e red-400 (escuro).',
    orange:
      'Quente e energético, mais aproximável que vermelho. Bom para CTAs entusiastas, alertas não-críticos e elementos de descoberta.',
    amber:
      'Dourado luminoso. Funciona bem em warnings, badges premium e highlights afetuosos.',
    yellow:
      'Amarelo puro, alto valor. Use com cuidado: contraste sobre branco é traiçoeiro, prefira stops 600+ para texto.',
    lime: 'Verde-limão ácido, jovem. Funciona em marcas tech-forward e fitness; difícil de combinar com paletas conservadoras.',
    green:
      'Verde clássico de crescimento. Em UI, sinaliza progresso e aprovação genérica.',
    emerald:
      'Verde mais frio e sofisticado, o tom usual de sucesso. Combina bem com slate e gray.',
    teal: 'Equilíbrio entre verde e azul, ideal para marcas calmas e produtos de saúde, finanças ou bem-estar.',
    cyan: 'Azul-claro vibrante, quase elétrico. Um acento tech sem ir para o azul corporativo.',
    sky: 'Azul céu, leve e arejado, o tom usual de info. Mais acolhedor que blue sem perder o caráter técnico.',
    blue: 'Azul clássico de produto digital. O default seguro e versátil para links e primary actions.',
    indigo:
      'Azul profundo com puxada violeta. Mais editorial e premium que blue; funciona em produtos noturnos e marcas técnicas.',
    violet: 'Roxo equilibrado. Funciona como acento sem dominar a paleta.',
    purple:
      'Roxo mais saturado que violet, quase magenta no stop 500. Use para criatividade, beta features e diferenciação.',
    fuchsia:
      'Magenta vibrante, quase neon. Cor de descoberta e novidade; difícil de combinar com paletas conservadoras.',
    pink: 'Rosa quente, social. Funciona em interfaces que querem carinho e proximidade, como comunidade e bem-estar.',
    rose: 'Rosa-vermelho, elegante. Combina particularmente bem com stone e taupe.',
  },
};

function paletteFor(id: string, locale: Locale): ColorPalette {
  const rows: PrimitiveColorStop[] = PRIMITIVE_COLOR_RAMPS[id] ?? [];
  return {
    id,
    name: RAMP_NAMES[id] ?? id,
    description: DESCRIPTIONS[locale][id] ?? '',
    rows,
  };
}

/** Renders the full table of every ramp in a group, in canonical order. */
export function PrimitiveColorPalettes({
  group,
  locale = 'en',
}: {
  group: RampGroup;
  locale?: Locale;
}) {
  return (
    <>
      {RAMP_GROUPS[group].map((id) => (
        <ColorPaletteTable
          key={id}
          palette={paletteFor(id, locale)}
          locale={locale}
        />
      ))}
    </>
  );
}

/**
 * Compact index of every ramp: name plus the full strip of stops,
 * each row anchor-linked to its table below.
 */
export function PrimitiveRampIndex() {
  const order = (Object.keys(RAMP_GROUPS) as RampGroup[]).flatMap(
    (g) => RAMP_GROUPS[g],
  );
  return (
    <div className="my-6 flex flex-col gap-1.5">
      {order.map((id) => {
        const rows = PRIMITIVE_COLOR_RAMPS[id] ?? [];
        return (
          <a
            key={id}
            href={`#palette-${id}`}
            className="group flex items-center gap-3 no-underline"
          >
            <span className="w-20 shrink-0 font-mono text-xs text-fd-muted-foreground group-hover:text-fd-foreground">
              {id}
            </span>
            <span className="flex h-5 flex-1 overflow-hidden rounded border border-fd-border">
              {rows.map((row) => (
                <span
                  key={row.token}
                  className="flex-1"
                  style={{ backgroundColor: `var(${row.token})` }}
                  title={`${row.token} ${row.hex}`}
                />
              ))}
            </span>
          </a>
        );
      })}
    </div>
  );
}
