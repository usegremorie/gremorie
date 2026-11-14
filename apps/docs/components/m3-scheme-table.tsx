/**
 * The Material 3 ColorScheme of a Gremorie theme, read from the build output
 * (`@gremorie/tokens/tokens.json`), so it can never drift from what Compose
 * receives. Swatches render over the theme's own background for each mode.
 */
import tokens from '@gremorie/tokens/tokens.json';

type Locale = 'en' | 'pt';
type Mode = 'light' | 'dark';
interface ColorValue {
  hex: string;
  oklch: string;
}
interface Model {
  themeNames: string[];
  m3Roles: string[];
  m3Sources: Record<string, string>;
  themes: Record<string, Record<Mode, { m3: Record<string, ColorValue> }>>;
}
const model = tokens as unknown as Model;

const LABELS: Record<
  Locale,
  {
    light: string;
    dark: string;
    role: string;
    source: string;
    derived: string;
    unknown: string;
  }
> = {
  en: {
    light: 'Light',
    dark: 'Dark',
    role: 'Role',
    source: 'Source',
    derived: 'derived',
    unknown: 'Unknown theme:',
  },
  pt: {
    light: 'Claro',
    dark: 'Escuro',
    role: 'Papel',
    source: 'Origem',
    derived: 'derivado',
    unknown: 'Tema desconhecido:',
  },
};

const TH =
  'px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-fd-muted-foreground border-b border-fd-border';
const TD = 'px-3 py-2 align-middle border-b border-fd-border';
const MONO = 'font-mono text-xs text-fd-foreground';
const MONO_MUTED = 'font-mono text-xs text-fd-muted-foreground';
const MISSING: ColorValue = { hex: 'transparent', oklch: '' };

function Swatch({ value, backdrop }: { value: string; backdrop: string }) {
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

export function M3SchemeTable({
  themeId,
  locale = 'en',
}: {
  themeId: string;
  locale?: Locale;
}) {
  const labels = LABELS[locale];
  const theme = model.themes[themeId];
  if (!theme) {
    return (
      <p className="my-4 text-sm text-fd-muted-foreground">
        {labels.unknown} <code>{themeId}</code>
      </p>
    );
  }
  const lightBg = theme.light.m3.background?.hex ?? 'transparent';
  const darkBg = theme.dark.m3.background?.hex ?? 'transparent';
  return (
    <div
      className="mt-4 overflow-x-auto rounded-lg border border-fd-border"
      id={`m3-${themeId}`}
    >
      <table className="w-full border-collapse text-sm">
        <thead className="bg-fd-muted/40">
          <tr>
            <th className={TH} style={{ width: '60px' }}>
              {labels.light}
            </th>
            <th className={TH} style={{ width: '60px' }}>
              {labels.dark}
            </th>
            <th className={TH}>{labels.role}</th>
            <th className={TH}>{labels.source}</th>
            <th className={TH}>OKLCH ({labels.light})</th>
            <th className={TH}>Hex ({labels.light})</th>
            <th className={TH}>Hex ({labels.dark})</th>
          </tr>
        </thead>
        <tbody>
          {model.m3Roles.map((role) => {
            const light = theme.light.m3[role] ?? MISSING;
            const dark = theme.dark.m3[role] ?? MISSING;
            const source = model.m3Sources[role] ?? '';
            return (
              <tr key={role} data-role={role} className="hover:bg-fd-muted/20">
                <td className={TD}>
                  <Swatch value={light.hex} backdrop={lightBg} />
                </td>
                <td className={TD}>
                  <Swatch value={dark.hex} backdrop={darkBg} />
                </td>
                <td className={`${TD} ${MONO}`}>{role}</td>
                <td className={`${TD} ${MONO_MUTED}`}>
                  {source === 'derived' ? labels.derived : source}
                </td>
                <td className={`${TD} ${MONO_MUTED} whitespace-nowrap`}>
                  {light.oklch}
                </td>
                <td className={`${TD} ${MONO_MUTED}`}>{light.hex}</td>
                <td className={`${TD} ${MONO_MUTED}`}>{dark.hex}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
