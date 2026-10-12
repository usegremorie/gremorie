import { fmt, round6 } from './format-number.ts';
import type {
  DtcgColor,
  DtcgDimension,
  DtcgShadow,
  DtcgShadowLayer,
  DtcgType,
  DtcgValue,
} from './model.ts';

/** Splits on a separator that is not inside parentheses. */
export function splitTopLevel(text: string, separator: ',' | ' '): string[] {
  const source = separator === ' ' ? text.replace(/\s+/g, ' ').trim() : text;
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of source) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === separator && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  parts.push(current.trim());
  return parts.filter((p) => p !== '');
}

function plainNumber(raw: string, what: string): number {
  if (!/^-?(?:\d+\.?\d*|\.\d+)$/.test(raw)) {
    throw new Error(`Not a plain number for ${what}: ${raw}`);
  }
  return round6(Number(raw));
}

export function parseColor(raw: string): DtcgColor {
  const m = /^oklch\(([^)]*)\)$/i.exec(raw.replace(/\s+/g, ' ').trim());
  if (!m) throw new Error(`Only oklch() colours are supported: ${raw}`);
  const [channels = '', alphaRaw] = m[1]!.split('/').map((s) => s.trim());
  const parts = channels.split(' ');
  if (parts.length !== 3) {
    throw new Error(`oklch() needs three channels: ${raw}`);
  }
  const [l, c, h] = parts as [string, string, string];
  const lightness = l.endsWith('%')
    ? round6(plainNumber(l.slice(0, -1), 'lightness') / 100)
    : plainNumber(l, 'lightness');
  if (c.endsWith('%')) {
    throw new Error(`Percent chroma is not supported: ${raw}`);
  }
  const color: DtcgColor = {
    colorSpace: 'oklch',
    components: [lightness, plainNumber(c, 'chroma'), plainNumber(h, 'hue')],
  };
  if (alphaRaw !== undefined) {
    const alpha = alphaRaw.endsWith('%')
      ? round6(plainNumber(alphaRaw.slice(0, -1), 'alpha') / 100)
      : plainNumber(alphaRaw, 'alpha');
    if (alpha !== 1) color.alpha = alpha;
  }
  return color;
}

export function formatColor(c: DtcgColor): string {
  const [l, ch, h] = c.components;
  const alpha =
    c.alpha === undefined || c.alpha === 1 ? '' : ` / ${fmt(c.alpha)}`;
  return `oklch(${fmt(l)} ${fmt(ch)} ${fmt(h)}${alpha})`;
}

export function parseDimension(raw: string): DtcgDimension {
  const t = raw.trim();
  if (t === '0') return { value: 0, unit: 'px' };
  const m = /^(-?(?:\d+\.?\d*|\.\d+))(px|rem)$/.exec(t);
  if (!m) throw new Error(`Not a px or rem dimension: ${raw}`);
  return { value: round6(Number(m[1])), unit: m[2] as 'px' | 'rem' };
}

export function formatDimension(d: DtcgDimension): string {
  return d.value === 0 ? '0' : `${fmt(d.value)}${d.unit}`;
}

const GENERIC_FAMILIES = new Set([
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

export function parseFontFamily(raw: string): string[] {
  return splitTopLevel(raw, ',').map((f) => f.replace(/^['"]|['"]$/g, ''));
}

export function formatFontFamily(families: readonly string[]): string {
  return families
    .map((f) => (GENERIC_FAMILIES.has(f) ? f : `'${f}'`))
    .join(', ');
}

function parseShadowLayer(text: string): DtcgShadowLayer {
  const parts = splitTopLevel(text, ' ');
  const inset = parts[0] === 'inset';
  if (inset) parts.shift();
  const colorAt = parts.findIndex((p) => p.startsWith('oklch('));
  if (colorAt === -1) {
    throw new Error(`Shadow without an oklch() colour: ${text}`);
  }
  const [colorText] = parts.splice(colorAt, 1);
  const [x = '0', y = '0', blur = '0', spread = '0'] = parts;
  const layer: DtcgShadowLayer = {
    color: parseColor(colorText!),
    offsetX: parseDimension(x),
    offsetY: parseDimension(y),
    blur: parseDimension(blur),
    spread: parseDimension(spread),
  };
  if (inset) layer.inset = true;
  return layer;
}

export function parseShadow(raw: string): DtcgShadow {
  const layers = splitTopLevel(raw, ',').map(parseShadowLayer);
  return layers.length === 1 ? layers[0]! : layers;
}

export function formatShadow(shadow: DtcgShadow): string {
  const layers = Array.isArray(shadow) ? shadow : [shadow];
  return layers
    .map((l) =>
      [
        l.inset ? 'inset' : null,
        formatDimension(l.offsetX),
        formatDimension(l.offsetY),
        formatDimension(l.blur),
        formatDimension(l.spread),
        formatColor(l.color),
      ]
        .filter((p): p is string => p !== null)
        .join(' '),
    )
    .join(', ');
}

export function formatValue(type: DtcgType, value: DtcgValue): string {
  switch (type) {
    case 'color':
      return formatColor(value as DtcgColor);
    case 'dimension':
      return formatDimension(value as DtcgDimension);
    case 'fontFamily':
      return formatFontFamily(value as string[]);
    case 'shadow':
      return formatShadow(value as DtcgShadow);
  }
}
