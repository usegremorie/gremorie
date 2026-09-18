import { format as d3Format } from 'd3-format';

/*
 * The default preset delegates to `toLocaleString()` — the same call the React
 * edition makes in `ChartTooltipContent` — so a value reads identically in both
 * editions. A fixed d3 format would print `3.76` next to React's `3,76` for a
 * reader in pt-BR. The trade is that output now follows the host locale, so
 * assert against `toLocaleString()` rather than a literal in tests.
 */
const number = (value: number) => value.toLocaleString();
const compact = d3Format('.3~s');
const percent = d3Format('.1~%');

/**
 * Format a numeric value using a named preset. Presets are JSON-friendly
 * strings (no functions) so the styled layer's config stays serializable
 * for generative UI. Unknown presets fall back to the default number format.
 *
 * Supported: 'number' (default) | 'currency:<ISO>' | 'percent' | 'compact'.
 */
export function formatValue(value: number, preset = 'number'): string {
  if (preset.startsWith('currency:')) {
    const currency = preset.slice('currency:'.length) || 'USD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(value);
  }
  switch (preset) {
    case 'percent':
      return percent(value);
    case 'compact':
      return compact(value).toUpperCase();
    case 'number':
      return number(value);
    default:
      return number(value);
  }
}
