import { describe, expect, it } from 'vitest';
import { cssText, renderBlock, wrapComment } from '../pipeline/css.ts';
import type { RunToken } from '../pipeline/run.ts';

const token = (over: Partial<RunToken>): RunToken => ({
  path: ['x'],
  name: '--x',
  type: 'color',
  layer: 'semantic-light',
  file: 'semantic/light.json',
  order: 0,
  value: { colorSpace: 'oklch', components: [0.5, 0.1, 20] },
  original: { colorSpace: 'oklch', components: [0.5, 0.1, 20] },
  ...over,
});

describe('cssText', () => {
  it('writes an alias as var(), a derivation as calc(), raw CSS as is', () => {
    expect(cssText(token({ original: '{color.gray.50}' }))).toBe(
      'var(--color-gray-50)',
    );
    expect(
      cssText(
        token({
          type: 'dimension',
          derive: { from: '{radius.base}', multiply: 0.6 },
        }),
      ),
    ).toBe('calc(var(--radius-base) * 0.6)');
    expect(cssText(token({ type: 'dimension', cssValue: '0em' }))).toBe('0em');
    expect(cssText(token({}))).toBe('oklch(0.5 0.1 20)');
  });
});

describe('wrapComment', () => {
  it('wraps paragraphs into a starred block', () => {
    expect(wrapComment('one two three\n\nfour', '  ', 20)).toBe(
      ['  /*', '   * one two three', '   *', '   * four', '   */'].join('\n'),
    );
  });
  it('defuses a comment terminator inside the text', () => {
    expect(wrapComment('a */ b', '')).toContain('a * / b');
  });
});

describe('renderBlock', () => {
  it('orders by source order and adds descriptions and hex comments', () => {
    const block = renderBlock(
      '@theme',
      [
        token({ name: '--b', order: 2 }),
        token({ name: '--a', order: 1, description: 'first' }),
      ],
      undefined,
      true,
    );
    expect(block).toBe(
      [
        '@theme {',
        '  /*',
        '   * first',
        '   */',
        '  --a: oklch(0.5 0.1 20); /* #944a4b */',
        '  --b: oklch(0.5 0.1 20); /* #944a4b */',
        '}',
      ].join('\n'),
    );
  });
});
