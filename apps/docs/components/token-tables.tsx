/**
 * Server-rendered table primitives for the Tokens documentation.
 *
 * Each table renders the canonical Kalvner token format: a swatch /
 * sample on the left, then monospaced token + utility columns, then
 * computed values, then a use-case description. Styling uses
 * Fumadocs / KDS utility classes and CSS variables — no client JS.
 */
import type { ChartScheme } from '@/lib/chart-tokens';
import type { ColorPalette, ColorRow } from '@/lib/primitive-tokens';

import {
  ANIMATIONS,
  DURATION_TOKENS,
  EASE_TOKENS,
  INSET_SHADOWS,
  RADIUS_TOKENS,
  SHADOW_TOKENS,
  SPACING_STEPS,
} from '@/lib/scale-tokens';
import { SEMANTIC_THEMES } from '@/lib/semantic-tokens';
import {
  FONT_FAMILIES,
  LEADINGS,
  TRACKINGS,
  TYPE_SIZES,
  TYPE_WEIGHTS,
} from '@/lib/typography-tokens';

const TH =
  'px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-fd-muted-foreground border-b border-fd-border';
const TD = 'px-3 py-2 align-middle border-b border-fd-border';
const MONO = 'font-mono text-xs text-fd-foreground';
const MONO_MUTED = 'font-mono text-xs text-fd-muted-foreground';

function Swatch({ value, square = true }: { value: string; square?: boolean }) {
  return (
    <span
      className={`inline-block ${square ? 'h-6 w-6' : 'h-4 w-12'} shrink-0 rounded border border-fd-border align-middle`}
      style={{ backgroundColor: value }}
      aria-hidden
    />
  );
}

/* ----------------------------- Color ------------------------------- */

export function ColorPaletteTable({ palette }: { palette: ColorPalette }) {
  return (
    <section className="my-8" id={`palette-${palette.id}`}>
      <h3 className="text-xl font-semibold tracking-tight">{palette.name}</h3>
      {palette.description ? (
        <p className="mt-1 text-sm text-fd-muted-foreground">
          {palette.description}
        </p>
      ) : null}
      <div className="mt-4 overflow-x-auto rounded-lg border border-fd-border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-fd-muted/40">
            <tr>
              <th className={TH} style={{ width: '60px' }}>
                Amostra
              </th>
              <th className={TH} style={{ width: '70px' }}>
                Passo
              </th>
              <th className={TH}>CSS Token</th>
              <th className={TH}>Classe Tailwind</th>
              <th className={TH}>OKLCH</th>
              <th className={TH}>HEX</th>
            </tr>
          </thead>
          <tbody>
            {palette.rows.map((row: ColorRow) => (
              <tr key={row.token} className="hover:bg-fd-muted/20">
                <td className={TD}>
                  <Swatch value={`var(${row.token})`} />
                </td>
                <td className={`${TD} ${MONO}`}>{row.step}</td>
                <td className={`${TD} ${MONO}`}>{row.token}</td>
                <td className={`${TD} ${MONO_MUTED}`}>{row.utility}</td>
                <td className={`${TD} ${MONO_MUTED}`}>{row.oklch}</td>
                <td className={`${TD} ${MONO_MUTED}`}>{row.hex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ---------------------------- Typography --------------------------- */

export function TypeSizeTable() {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-fd-border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-fd-muted/40">
          <tr>
            <th className={TH} style={{ width: '32%' }}>
              Amostra
            </th>
            <th className={TH}>Token</th>
            <th className={TH}>Classe</th>
            <th className={TH}>Tamanho</th>
            <th className={TH}>Line-height</th>
            <th className={TH}>Uso</th>
          </tr>
        </thead>
        <tbody>
          {TYPE_SIZES.map((row) => (
            <tr key={row.token} className="hover:bg-fd-muted/20">
              <td className={TD}>
                <span
                  style={{ fontSize: row.size, lineHeight: 1.05 }}
                  className="block truncate font-medium"
                >
                  Aa
                </span>
              </td>
              <td className={`${TD} ${MONO}`}>{row.token}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.utility}</td>
              <td className={`${TD} ${MONO_MUTED}`}>
                {row.size} <span className="opacity-60">/ {row.px}</span>
              </td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.lineHeight}</td>
              <td className={TD}>{row.useCase}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TypeWeightTable() {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-fd-border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-fd-muted/40">
          <tr>
            <th className={TH} style={{ width: '20%' }}>
              Amostra
            </th>
            <th className={TH}>Token</th>
            <th className={TH}>Classe</th>
            <th className={TH}>Valor</th>
            <th className={TH}>Uso</th>
          </tr>
        </thead>
        <tbody>
          {TYPE_WEIGHTS.map((row) => (
            <tr key={row.token} className="hover:bg-fd-muted/20">
              <td className={TD}>
                <span style={{ fontWeight: row.value }} className="text-base">
                  Texto
                </span>
              </td>
              <td className={`${TD} ${MONO}`}>{row.token}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.utility}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.value}</td>
              <td className={TD}>{row.useCase}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LeadingTable() {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-fd-border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-fd-muted/40">
          <tr>
            <th className={TH}>Token</th>
            <th className={TH}>Classe</th>
            <th className={TH}>Valor</th>
            <th className={TH}>Uso</th>
          </tr>
        </thead>
        <tbody>
          {LEADINGS.map((row) => (
            <tr key={row.token} className="hover:bg-fd-muted/20">
              <td className={`${TD} ${MONO}`}>{row.token}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.utility}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.value}</td>
              <td className={TD}>{row.useCase}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TrackingTable() {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-fd-border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-fd-muted/40">
          <tr>
            <th className={TH}>Token</th>
            <th className={TH}>Classe</th>
            <th className={TH}>Valor</th>
            <th className={TH}>Uso</th>
          </tr>
        </thead>
        <tbody>
          {TRACKINGS.map((row) => (
            <tr key={row.token} className="hover:bg-fd-muted/20">
              <td className={`${TD} ${MONO}`}>{row.token}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.utility}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.value}</td>
              <td className={TD}>{row.useCase}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FontFamilyTable() {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-fd-border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-fd-muted/40">
          <tr>
            <th className={TH}>Token</th>
            <th className={TH}>Classe</th>
            <th className={TH}>Descrição</th>
          </tr>
        </thead>
        <tbody>
          {FONT_FAMILIES.map((row) => (
            <tr key={row.token} className="hover:bg-fd-muted/20">
              <td className={`${TD} ${MONO}`}>{row.token}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.utility}</td>
              <td className={TD}>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ----------------------------- Spacing ----------------------------- */

export function SpacingTable() {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-fd-border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-fd-muted/40">
          <tr>
            <th className={TH} style={{ width: '30%' }}>
              Amostra
            </th>
            <th className={TH}>Passo</th>
            <th className={TH}>Classe</th>
            <th className={TH}>Rem</th>
            <th className={TH}>Pixels</th>
            <th className={TH}>Uso</th>
          </tr>
        </thead>
        <tbody>
          {SPACING_STEPS.map((row) => (
            <tr key={row.utility} className="hover:bg-fd-muted/20">
              <td className={TD}>
                <span
                  className="block h-3 rounded bg-fd-primary/70"
                  style={{ width: row.rem, maxWidth: '100%' }}
                  aria-hidden
                />
              </td>
              <td className={`${TD} ${MONO}`}>{row.step}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.utility}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.rem}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.px}</td>
              <td className={TD}>{row.useCase}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ----------------------------- Radius ------------------------------ */

export function RadiusTable() {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-fd-border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-fd-muted/40">
          <tr>
            <th className={TH} style={{ width: '80px' }}>
              Amostra
            </th>
            <th className={TH}>Token</th>
            <th className={TH}>Classe</th>
            <th className={TH}>Rem</th>
            <th className={TH}>Pixels</th>
            <th className={TH}>Uso</th>
          </tr>
        </thead>
        <tbody>
          {RADIUS_TOKENS.map((row) => (
            <tr key={row.token} className="hover:bg-fd-muted/20">
              <td className={TD}>
                <span
                  className="block h-10 w-10 border border-fd-border bg-fd-muted"
                  style={{ borderRadius: row.rem }}
                  aria-hidden
                />
              </td>
              <td className={`${TD} ${MONO}`}>{row.token}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.utility}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.rem}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.px}</td>
              <td className={TD}>{row.useCase}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ----------------------------- Shadow ------------------------------ */

export function ShadowTable({ inset = false }: { inset?: boolean } = {}) {
  const rows = inset ? INSET_SHADOWS : SHADOW_TOKENS;
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-fd-border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-fd-muted/40">
          <tr>
            <th className={TH} style={{ width: '100px' }}>
              Amostra
            </th>
            <th className={TH}>Token</th>
            <th className={TH}>Classe</th>
            <th className={TH}>Definição</th>
            <th className={TH}>Uso</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.token} className="hover:bg-fd-muted/20">
              <td className={TD}>
                <span
                  className="block h-10 w-16 rounded-md bg-fd-card"
                  style={{ boxShadow: row.definition }}
                  aria-hidden
                />
              </td>
              <td className={`${TD} ${MONO}`}>{row.token}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.utility}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.definition}</td>
              <td className={TD}>{row.useCase}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ----------------------------- Motion ------------------------------ */

export function EaseTable() {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-fd-border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-fd-muted/40">
          <tr>
            <th className={TH}>Token</th>
            <th className={TH}>Classe</th>
            <th className={TH}>Curva</th>
            <th className={TH}>Uso</th>
          </tr>
        </thead>
        <tbody>
          {EASE_TOKENS.map((row) => (
            <tr key={row.token} className="hover:bg-fd-muted/20">
              <td className={`${TD} ${MONO}`}>{row.token}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.utility}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.value}</td>
              <td className={TD}>{row.useCase}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DurationTable() {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-fd-border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-fd-muted/40">
          <tr>
            <th className={TH}>Faixa</th>
            <th className={TH}>Duração</th>
            <th className={TH}>Uso</th>
          </tr>
        </thead>
        <tbody>
          {DURATION_TOKENS.map((row) => (
            <tr key={row.token} className="hover:bg-fd-muted/20">
              <td className={`${TD} ${MONO}`}>{row.token}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.ms}</td>
              <td className={TD}>{row.useCase}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AnimationTable() {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-fd-border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-fd-muted/40">
          <tr>
            <th className={TH}>Token</th>
            <th className={TH}>Classe</th>
            <th className={TH}>Definição</th>
            <th className={TH}>Uso</th>
          </tr>
        </thead>
        <tbody>
          {ANIMATIONS.map((row) => (
            <tr key={row.token} className="hover:bg-fd-muted/20">
              <td className={`${TD} ${MONO}`}>{row.token}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.utility}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.value}</td>
              <td className={TD}>{row.useCase}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------------------- Semantic ----------------------------- */

export function SemanticThemeTable({ themeId }: { themeId: string }) {
  const theme = SEMANTIC_THEMES.find((t) => t.id === themeId);
  if (!theme) {
    return (
      <p className="my-4 text-sm text-fd-muted-foreground">
        Tema desconhecido: <code>{themeId}</code>
      </p>
    );
  }
  return (
    <section className="my-8" id={`theme-${theme.id}`}>
      <h3 className="text-xl font-semibold tracking-tight">{theme.name}</h3>
      <p className="mt-1 text-sm text-fd-muted-foreground">
        {theme.description}
      </p>
      <p className="mt-2 text-xs text-fd-muted-foreground">
        <code className="font-mono">--radius</code>: {theme.radius}
        {' · '}selector{' '}
        <code className="font-mono">[data-theme=&quot;{theme.id}&quot;]</code>
      </p>
      <div className="mt-4 overflow-x-auto rounded-lg border border-fd-border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-fd-muted/40">
            <tr>
              <th className={TH} style={{ width: '60px' }}>
                Light
              </th>
              <th className={TH} style={{ width: '60px' }}>
                Dark
              </th>
              <th className={TH}>Token</th>
              <th className={TH}>Primitivo (light)</th>
              <th className={TH}>Primitivo (dark)</th>
            </tr>
          </thead>
          <tbody>
            {theme.rows.map((row) => (
              <tr key={row.token} className="hover:bg-fd-muted/20">
                <td className={TD}>
                  <Swatch value={`var(--color-${row.primitiveLight})`} />
                </td>
                <td className={TD}>
                  <Swatch value={`var(--color-${row.primitiveDark})`} />
                </td>
                <td className={`${TD} ${MONO}`}>{row.token}</td>
                <td className={`${TD} ${MONO_MUTED}`}>{row.primitiveLight}</td>
                <td className={`${TD} ${MONO_MUTED}`}>{row.primitiveDark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ------------------------------ Chart ------------------------------ */

export function ChartSchemeSwatchRow({ scheme }: { scheme: ChartScheme }) {
  return (
    <div className="my-4 flex flex-col gap-2">
      <div className="flex h-12 w-full overflow-hidden rounded-md border border-fd-border">
        {scheme.rows.map((row) => (
          <div
            key={row.token}
            className="flex-1"
            style={{ backgroundColor: `var(${row.token})` }}
            title={row.token}
            aria-label={row.token}
          />
        ))}
      </div>
      <div className="flex w-full gap-1 font-mono text-[10px] text-fd-muted-foreground">
        {scheme.rows.map((row) => (
          <div key={row.token} className="flex-1 truncate text-center">
            {row.token.replace(/^--color-chart-/, '')}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSchemeTable({ scheme }: { scheme: ChartScheme }) {
  const hasMeaning = scheme.rows.some((r) => r.meaning);
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-fd-border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-fd-muted/40">
          <tr>
            <th className={TH} style={{ width: '60px' }}>
              Amostra
            </th>
            <th className={TH}>Token</th>
            <th className={TH}>Primitivo</th>
            {hasMeaning ? <th className={TH}>Significado</th> : null}
          </tr>
        </thead>
        <tbody>
          {scheme.rows.map((row) => (
            <tr key={row.token} className="hover:bg-fd-muted/20">
              <td className={TD}>
                <Swatch value={`var(${row.token})`} />
              </td>
              <td className={`${TD} ${MONO}`}>{row.token}</td>
              <td className={`${TD} ${MONO_MUTED}`}>{row.primitive}</td>
              {hasMeaning ? <td className={TD}>{row.meaning ?? ''}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
