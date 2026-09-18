/**
 * Value formatting for chart tooltips, axes and labels.
 *
 * Built entirely on `Intl.NumberFormat`, the platform API, for three reasons:
 * it needs no dependency, it follows the reader's locale (so a Brazilian sees
 * `1.234,5` and an American `1,234.5`), and it exists identically in both
 * editions — `@gremorie/ng-data` ships a byte-identical copy of this file.
 *
 * **On the duplication:** the two editions have no shared runtime package
 * (`@gremorie/tokens` is CSS, `contracts` is private), and standing one up for
 * twenty lines of pure Intl calls would cost more than it saves. The guard is
 * that both copies carry the same test suite with the same expectations, so a
 * change to one that the other does not mirror fails a build.
 *
 * Presets are plain strings, never functions, so a `ChartConfig` stays
 * JSON-serializable and can be produced by a model.
 *
 * Replaced `d3-format`, which was wrong for `compact` on fractions: `.3~s`
 * renders 0.125 as `125m` (SI *milli*), and the old `.toUpperCase()` turned
 * that into `125M`, which reads as mega.
 */

/** Cache formatters: constructing an `Intl.NumberFormat` is not cheap. */
const cache = new Map<string, Intl.NumberFormat>();

function formatter(key: string, options: Intl.NumberFormatOptions) {
  let f = cache.get(key);
  if (!f) {
    f = new Intl.NumberFormat(undefined, options);
    cache.set(key, f);
  }
  return f;
}

/**
 * Format a numeric value using a named preset. Unknown presets fall back to
 * the default number format.
 *
 * Supported: `'number'` (default) | `'currency:<ISO>'` | `'percent'` | `'compact'`.
 *
 * @example formatValue(1234.5)                 // '1,234.5'   (en-US)
 * @example formatValue(1234.5, 'currency:BRL') // 'R$ 1.234,50' (pt-BR)
 * @example formatValue(0.125, 'percent')       // '12.5%'
 * @example formatValue(12000, 'compact')       // '12K'
 */
export function formatValue(value: number, preset = 'number'): string {
  if (preset.startsWith('currency:')) {
    const currency = preset.slice('currency:'.length) || 'USD';
    return formatter(preset, { style: 'currency', currency }).format(value);
  }
  switch (preset) {
    case 'percent':
      return formatter(preset, {
        style: 'percent',
        maximumFractionDigits: 1,
      }).format(value);
    case 'compact':
      return formatter(preset, {
        notation: 'compact',
        maximumFractionDigits: 2,
      }).format(value);
    default:
      return value.toLocaleString();
  }
}
