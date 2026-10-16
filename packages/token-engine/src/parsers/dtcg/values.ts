/**
 * DTCG values as CSS text, the same text packages/tokens/pipeline writes.
 * Kept small and local because this package compiles with tsc and does not
 * import the tokens pipeline; load-dtcg.test.ts proves the two agree on every
 * token of the real source.
 */
export interface DtcgColor {
  colorSpace: 'oklch';
  components: [number, number, number];
  alpha?: number;
}
interface Dimension {
  value: number;
  unit: string;
}
interface ShadowLayer {
  color: DtcgColor;
  offsetX: Dimension;
  offsetY: Dimension;
  blur: Dimension;
  spread: Dimension;
  inset?: boolean;
}

export function fmt(n: number): string {
  const s = n.toFixed(6).replace(/\.?0+$/, '');
  return s === '-0' ? '0' : s;
}
const round6 = (n: number) => Number(n.toFixed(6));

export function formatColor(c: DtcgColor): string {
  const [l, ch, h] = c.components;
  const alpha =
    c.alpha === undefined || c.alpha === 1 ? '' : ` / ${fmt(c.alpha)}`;
  return `oklch(${fmt(l)} ${fmt(ch)} ${fmt(h)}${alpha})`;
}

const part = (raw: string, percent: boolean) => {
  if (raw.endsWith('%')) {
    if (!percent) throw new Error(`Percent not allowed here: ${raw}`);
    return round6(Number(raw.slice(0, -1)) / 100);
  }
  const n = Number(raw);
  if (raw === '' || Number.isNaN(n)) throw new Error(`Not a number: ${raw}`);
  return round6(n);
};

export function parseOklch(raw: string): DtcgColor {
  const m = /^oklch\(([^)]*)\)$/i.exec(raw.replace(/\s+/g, ' ').trim());
  if (!m) throw new Error(`Only oklch() colours can be written: ${raw}`);
  const [, inner = ''] = m;
  const [channels = '', alphaRaw] = inner.split('/').map((s) => s.trim());
  const parts = channels.split(' ');
  if (parts.length !== 3) {
    throw new Error(`oklch() needs three channels: ${raw}`);
  }
  const [l = '', c = '', h = ''] = parts;
  const color: DtcgColor = {
    colorSpace: 'oklch',
    components: [part(l, true), part(c, false), part(h, false)],
  };
  if (alphaRaw !== undefined) {
    const alpha = part(alphaRaw, true);
    if (alpha !== 1) color.alpha = alpha;
  }
  return color;
}

const dimension = (d: Dimension) =>
  d.value === 0 ? '0' : `${fmt(d.value)}${d.unit}`;
const GENERIC = new Set([
  'serif',
  'sans-serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'ui-serif',
  'ui-sans-serif',
  'ui-monospace',
  'ui-rounded',
  'emoji',
  'math',
  'fangsong',
]);

export function formatDtcgValue(type: string, value: unknown): string {
  switch (type) {
    case 'color':
      return formatColor(value as DtcgColor);
    case 'dimension':
      return dimension(value as Dimension);
    case 'fontFamily':
      return (value as string[])
        .map((f) => (GENERIC.has(f) ? f : `'${f}'`))
        .join(', ');
    case 'shadow': {
      const layers = Array.isArray(value)
        ? (value as ShadowLayer[])
        : [value as ShadowLayer];
      return layers
        .map((l) =>
          [
            l.inset ? 'inset' : null,
            dimension(l.offsetX),
            dimension(l.offsetY),
            dimension(l.blur),
            dimension(l.spread),
            formatColor(l.color),
          ]
            .filter((p): p is string => p !== null)
            .join(' '),
        )
        .join(', ');
    }
    default:
      throw new Error(`Unsupported $type ${type}`);
  }
}

export const isAlias = (v: unknown): v is string =>
  typeof v === 'string' && /^\{[^{}]+\}$/.test(v);

export function cssNameToPath(name: string): string[] {
  if (!name.startsWith('--')) throw new Error(`Not a custom property: ${name}`);
  const bare = name.slice(2);
  if (bare.startsWith('color-')) {
    const rest = bare.slice('color-'.length);
    const cut = rest.lastIndexOf('-');
    return ['color', rest.slice(0, cut), rest.slice(cut + 1)];
  }
  for (const group of ['radius', 'font', 'tracking']) {
    if (bare.startsWith(`${group}-`)) {
      return [group, bare.slice(group.length + 1)];
    }
  }
  return [bare];
}

export const pathToCssName = (path: readonly string[]): string =>
  `--${path.join('-')}`;
export const aliasToCssName = (alias: string): string =>
  pathToCssName(alias.slice(1, -1).split('.'));
