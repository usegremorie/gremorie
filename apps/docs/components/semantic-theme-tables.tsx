/**
 * Per-theme truth tables for the semantic tokens page
 * (/tokens/semantic/colors).
 *
 * Data comes from `semantic-color-data.ts` (hand-verified extraction of
 * `packages/tokens/styles/theme.css` plus `themes/*.css`). Swatches render
 * the literal resolved value over the theme's own light/dark background,
 * so both columns are faithful regardless of the site mode the reader is
 * in, and alpha values (dark borders) composite the way they ship.
 */
import {
  resolveThemeRows,
  SEMANTIC_THEMES,
  type ResolvedValue,
} from './semantic-color-data';

type Locale = 'en' | 'pt';

const TH =
  'px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-fd-muted-foreground border-b border-fd-border';
const TD = 'px-3 py-2 align-middle border-b border-fd-border';
const MONO = 'font-mono text-xs text-fd-foreground';
const MONO_MUTED = 'font-mono text-xs text-fd-muted-foreground';

const LABELS: Record<
  Locale,
  {
    light: string;
    dark: string;
    token: string;
    valueLight: string;
    valueDark: string;
    inherited: string;
    unknown: string;
  }
> = {
  en: {
    light: 'Light',
    dark: 'Dark',
    token: 'Token',
    valueLight: 'Value (light)',
    valueDark: 'Value (dark)',
    inherited: 'base',
    unknown: 'Unknown theme:',
  },
  pt: {
    light: 'Light',
    dark: 'Dark',
    token: 'Token',
    valueLight: 'Valor (light)',
    valueDark: 'Valor (dark)',
    inherited: 'base',
    unknown: 'Tema desconhecido:',
  },
};

/** Swatch chip rendered over the theme's own surface for that mode. */
function ModeSwatch({ value, backdrop }: { value: string; backdrop: string }) {
  return (
    <span
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded border border-fd-border align-middle"
      style={{ backgroundColor: backdrop }}
      aria-hidden
    >
      <span
        className="block h-4 w-4 rounded-sm"
        style={{ backgroundColor: value }}
      />
    </span>
  );
}

function ValueCell({
  value,
  inheritedLabel,
}: {
  value: ResolvedValue;
  inheritedLabel: string;
}) {
  return (
    <td className={`${TD} ${MONO_MUTED} whitespace-nowrap`}>
      {value.ref}
      {value.inherited ? (
        <span className="ml-1.5 rounded bg-fd-muted px-1 py-0.5 text-[10px] uppercase tracking-wide">
          {inheritedLabel}
        </span>
      ) : null}
    </td>
  );
}

export function SemanticThemeTable({
  themeId,
  locale = 'en',
}: {
  themeId: string;
  locale?: Locale;
}) {
  const labels = LABELS[locale];
  const theme = SEMANTIC_THEMES.find((t) => t.id === themeId);
  if (!theme) {
    return (
      <p className="my-4 text-sm text-fd-muted-foreground">
        {labels.unknown} <code>{themeId}</code>
      </p>
    );
  }
  const rows = resolveThemeRows(theme);
  const lightBg = rows.find((r) => r.token === '--background')?.light.css;
  const darkBg = rows.find((r) => r.token === '--background')?.dark.css;
  return (
    <section className="my-8" id={`theme-${theme.id}`}>
      <h3 className="text-xl font-semibold tracking-tight">{theme.name}</h3>
      <p className="mt-1 text-sm text-fd-muted-foreground">
        {theme.description[locale]}
      </p>
      <p className="mt-2 text-xs text-fd-muted-foreground">
        <code className="font-mono">--radius-base</code>: {theme.radius}
        {' · '}selector <code className="font-mono">{theme.selector}</code>
      </p>
      <div className="mt-4 overflow-x-auto rounded-lg border border-fd-border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-fd-muted/40">
            <tr>
              <th className={TH} style={{ width: '60px' }}>
                {labels.light}
              </th>
              <th className={TH} style={{ width: '60px' }}>
                {labels.dark}
              </th>
              <th className={TH}>{labels.token}</th>
              <th className={TH}>{labels.valueLight}</th>
              <th className={TH}>{labels.valueDark}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.token} className="hover:bg-fd-muted/20">
                <td className={TD}>
                  <ModeSwatch value={row.light.css} backdrop={lightBg ?? ''} />
                </td>
                <td className={TD}>
                  <ModeSwatch value={row.dark.css} backdrop={darkBg ?? ''} />
                </td>
                <td className={`${TD} ${MONO}`}>{row.token}</td>
                <ValueCell
                  value={row.light}
                  inheritedLabel={labels.inherited}
                />
                <ValueCell value={row.dark} inheritedLabel={labels.inherited} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
