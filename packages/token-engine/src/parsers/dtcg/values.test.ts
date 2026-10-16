import { describe, expect, it } from 'vitest';
import {
  aliasToCssName,
  cssNameToPath,
  formatDtcgValue,
  parseOklch,
} from './values.js';

describe('DTCG values as CSS text', () => {
  it('formats the four types the source uses', () => {
    expect(
      formatDtcgValue('color', {
        colorSpace: 'oklch',
        components: [1, 0, 0],
        alpha: 0.1,
      }),
    ).toBe('oklch(1 0 0 / 0.1)');
    expect(formatDtcgValue('dimension', { value: 0.625, unit: 'rem' })).toBe(
      '0.625rem',
    );
    expect(formatDtcgValue('fontFamily', ['Inter', 'system-ui'])).toBe(
      "'Inter', system-ui",
    );
    expect(
      formatDtcgValue('shadow', {
        color: { colorSpace: 'oklch', components: [0, 0, 0], alpha: 0.05 },
        offsetX: { value: 0, unit: 'px' },
        offsetY: { value: 1, unit: 'px' },
        blur: { value: 2, unit: 'px' },
        spread: { value: 0, unit: 'px' },
      }),
    ).toBe('0 1px 2px 0 oklch(0 0 0 / 0.05)');
  });

  it('parses the oklch() the editor writes', () => {
    expect(parseOklch('oklch(0.99 0 0)')).toEqual({
      colorSpace: 'oklch',
      components: [0.99, 0, 0],
    });
    expect(parseOklch('oklch(98.5% 0.01 20 / 50%)')).toEqual({
      colorSpace: 'oklch',
      components: [0.985, 0.01, 20],
      alpha: 0.5,
    });
    expect(() => parseOklch('#ffffff')).toThrow(/oklch/);
  });

  it('maps names and aliases like the tokens pipeline', () => {
    expect(cssNameToPath('--color-gray-50')).toEqual(['color', 'gray', '50']);
    expect(cssNameToPath('--sidebar-ring')).toEqual(['sidebar-ring']);
    expect(aliasToCssName('{radius.base}')).toBe('--radius-base');
  });
});
