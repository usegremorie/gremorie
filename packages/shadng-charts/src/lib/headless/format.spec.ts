import { formatValue } from './format';

describe('formatValue', () => {
  it('formats plain numbers by default', () => {
    expect(formatValue(1234.5)).toBe('1,234.5');
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
    expect(formatValue(42, 'nope')).toBe('42');
  });
});
