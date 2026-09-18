import { formatValue } from './format';

describe('formatValue', () => {
  // Asserted against the host locale rather than a literal: the default preset
  // delegates to `toLocaleString()`, the same call the React edition makes in
  // `ChartTooltipContent`, so a literal would fail outside en-US.
  it('formats plain numbers with the host locale, matching the React edition', () => {
    expect(formatValue(1234.5)).toBe((1234.5).toLocaleString());
  });

  it('renders decimals the way the React tooltip does', () => {
    expect(formatValue(3.76)).toBe((3.76).toLocaleString());
  });

  it('formats currency presets via Intl', () => {
    expect(formatValue(1234.5, 'currency:BRL')).toBe('R$1,234.50');
  });

  it('formats percent (input is a ratio)', () => {
    expect(formatValue(0.125, 'percent')).toBe('12.5%');
  });

  it('formats compact abbreviations', () => {
    expect(formatValue(12000, 'compact')).toBe('12K');
  });

  it('falls back to the default when preset is unknown', () => {
    expect(formatValue(42, 'nope')).toBe((42).toLocaleString());
  });
});
