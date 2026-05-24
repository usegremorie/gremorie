import { format as d3Format } from 'd3-format';

const number = d3Format(',');
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
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
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
