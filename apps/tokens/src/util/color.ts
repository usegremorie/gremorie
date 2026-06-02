import { parse, formatHex, formatRgb, oklch, type Color } from 'culori';

export function parseColor(input: string): Color | undefined {
  return parse(input);
}

export function toOklchString(color: Color): string {
  const c = oklch(color);
  if (!c) return '';
  const l = (c.l ?? 0).toFixed(3);
  const ch = (c.c ?? 0).toFixed(3);
  const h = (c.h ?? 0).toFixed(1);
  return `oklch(${l} ${ch} ${h})`;
}

export function toHex(color: Color): string {
  return formatHex(color) ?? '';
}

// formatRgb reserved for future use
export { formatRgb };
