import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { collectDeclarations, normalizeValue } from '../pipeline/compare.ts';
import {
  formatColor,
  formatDimension,
  formatFontFamily,
  formatShadow,
  parseColor,
  parseDimension,
  parseFontFamily,
  parseShadow,
  splitTopLevel,
} from '../pipeline/css-value.ts';
import { typeForProp } from '../pipeline/seed/from-css.ts';
import { REFERENCE_DIR } from './support/paths.ts';

describe('splitTopLevel', () => {
  it('ignores separators inside parentheses', () => {
    expect(
      splitTopLevel('0 1px oklch(0 0 0 / 0.08), 0 2px oklch(1 0 0)', ','),
    ).toEqual(['0 1px oklch(0 0 0 / 0.08)', '0 2px oklch(1 0 0)']);
    expect(splitTopLevel('  0  1px\n oklch(0 0 0 / 0.1) ', ' ')).toEqual([
      '0',
      '1px',
      'oklch(0 0 0 / 0.1)',
    ]);
  });
});

describe('colors', () => {
  it('reads lightness in percent or as a number, and alpha', () => {
    expect(parseColor('oklch(97.1% 0.013 17.38)')).toEqual({
      colorSpace: 'oklch',
      components: [0.971, 0.013, 17.38],
    });
    expect(parseColor('oklch(1 0 0 / 10%)')).toEqual({
      colorSpace: 'oklch',
      components: [1, 0, 0],
      alpha: 0.1,
    });
    expect(parseColor('oklch(\n    1 0 0\n  )')).toEqual({
      colorSpace: 'oklch',
      components: [1, 0, 0],
    });
  });
  it('drops an alpha of 1 and writes decimals', () => {
    expect(formatColor(parseColor('oklch(50% 0.1 20 / 100%)'))).toBe(
      'oklch(0.5 0.1 20)',
    );
    expect(
      formatColor({ colorSpace: 'oklch', components: [1, 0, 0], alpha: 0.15 }),
    ).toBe('oklch(1 0 0 / 0.15)');
  });
  it('refuses what the source never uses', () => {
    expect(() => parseColor('#fff')).toThrow(/oklch/);
    expect(() => parseColor('oklch(0.5 40% 20)')).toThrow(/chroma/);
    expect(() => parseColor('oklch(0.5 0.1)')).toThrow(/three/);
  });
});

describe('dimensions, fonts and shadows', () => {
  it('reads px, rem and a bare zero', () => {
    expect(parseDimension('0.625rem')).toEqual({ value: 0.625, unit: 'rem' });
    expect(parseDimension('-1px')).toEqual({ value: -1, unit: 'px' });
    expect(parseDimension('0')).toEqual({ value: 0, unit: 'px' });
    expect(formatDimension({ value: 0, unit: 'rem' })).toBe('0');
    expect(() => parseDimension('0em')).toThrow(/px or rem/);
  });
  it('quotes every family that is not a generic keyword', () => {
    const f = parseFontFamily(
      "'Tiempos Headline', Georgia, 'Times New Roman', serif",
    );
    expect(f).toEqual([
      'Tiempos Headline',
      'Georgia',
      'Times New Roman',
      'serif',
    ]);
    expect(formatFontFamily(f)).toBe(
      "'Tiempos Headline', 'Georgia', 'Times New Roman', serif",
    );
  });
  it('keeps one shadow as an object and a list as an array', () => {
    expect(parseShadow('0 1px 2px 0 oklch(0 0 0 / 0.05)')).toEqual({
      color: { colorSpace: 'oklch', components: [0, 0, 0], alpha: 0.05 },
      offsetX: { value: 0, unit: 'px' },
      offsetY: { value: 1, unit: 'px' },
      blur: { value: 2, unit: 'px' },
      spread: { value: 0, unit: 'px' },
    });
    const two = parseShadow(
      '0 1px 3px 0 oklch(0 0 0 / 0.08), 0 1px 2px -1px oklch(0 0 0 / 0.08)',
    );
    expect(Array.isArray(two) && two.length).toBe(2);
    expect(formatShadow(two)).toBe(
      '0 1px 3px 0 oklch(0 0 0 / 0.08), 0 1px 2px -1px oklch(0 0 0 / 0.08)',
    );
  });
});

describe('round trip over every literal value of the 0.8.0 CSS', () => {
  const files = [
    'theme.css',
    ...readdirSync(join(REFERENCE_DIR, 'themes')).map((f) => `themes/${f}`),
  ];
  const literals: [string, string][] = [];
  for (const file of files) {
    const css = readFileSync(join(REFERENCE_DIR, file), 'utf8');
    for (const [selector, decls] of collectDeclarations(css)) {
      if (selector === '@theme inline') continue;
      for (const [prop, value] of decls) {
        if (/var\(|em$/.test(value)) continue;
        literals.push([prop, value]);
      }
    }
  }

  it('found the literals', () => {
    expect(literals.length).toBeGreaterThan(300);
  });

  it.each(literals)('%s: %s', (prop, value) => {
    const type = typeForProp(prop);
    const again =
      type === 'color'
        ? formatColor(parseColor(value))
        : type === 'dimension'
          ? formatDimension(parseDimension(value))
          : type === 'fontFamily'
            ? formatFontFamily(parseFontFamily(value))
            : formatShadow(parseShadow(value));
    expect(normalizeValue(again)).toBe(value);
  });
});
