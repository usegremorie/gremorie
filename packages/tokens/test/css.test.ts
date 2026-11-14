import { describe, expect, it } from 'vitest';
import {
  cssText,
  placeAfter,
  renderBlock,
  wrapComment,
} from '../pipeline/css.ts';
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

describe('renderBlock spacing', () => {
  it('separates groups and described tokens with a blank line', () => {
    const block = renderBlock('@theme', [
      token({
        name: '--color-gray-50',
        path: ['color', 'gray', '50'],
        order: 1,
      }),
      token({
        name: '--color-gray-100',
        path: ['color', 'gray', '100'],
        order: 2,
      }),
      token({ name: '--color-red-50', path: ['color', 'red', '50'], order: 3 }),
      token({ name: '--a', path: ['a'], order: 4, description: 'about a' }),
      token({ name: '--b', path: ['b'], order: 5 }),
    ]);
    expect(block).toBe(
      [
        '@theme {',
        '  --color-gray-50: oklch(0.5 0.1 20);',
        '  --color-gray-100: oklch(0.5 0.1 20);',
        '',
        '  --color-red-50: oklch(0.5 0.1 20);',
        '',
        '  /*',
        '   * about a',
        '   */',
        '  --a: oklch(0.5 0.1 20);',
        '  --b: oklch(0.5 0.1 20);',
        '}',
      ].join('\n'),
    );
  });
});

describe('placeAfter', () => {
  it('moves the tokens of one file right after a named token', () => {
    const moved = placeAfter(
      [
        token({ name: '--s1', file: 'primitive/shadow.json', order: 0 }),
        token({ name: '--s2', file: 'primitive/shadow.json', order: 1 }),
        token({ name: '--x', order: 2 }),
        token({ name: '--y', order: 3 }),
      ],
      'primitive/shadow.json',
      '--x',
    );
    expect(
      [...moved].sort((a, b) => a.order - b.order).map((t) => t.name),
    ).toEqual(['--x', '--s1', '--s2', '--y']);
  });

  it('leaves a block without tokens of that file alone', () => {
    const tokens = [token({ name: '--x', order: 0 })];
    expect(placeAfter(tokens, 'primitive/shadow.json', '--y')).toEqual(tokens);
  });

  it('fails when the anchor is missing', () => {
    expect(() =>
      placeAfter(
        [token({ name: '--s1', file: 'primitive/shadow.json' })],
        'primitive/shadow.json',
        '--missing',
      ),
    ).toThrow(/--missing/);
  });
});
