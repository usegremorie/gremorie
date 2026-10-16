import { describe, expect, it } from 'vitest';
import {
  collectDeclarations,
  compareCss,
  normalizeValue,
  skeleton,
} from '../pipeline/compare.ts';
import { fmt } from '../pipeline/format-number.ts';

describe('fmt', () => {
  it.each([
    [0.971, '0.971'],
    [97.1 / 100, '0.971'],
    [0.75 * 0.6, '0.45'],
    [17.38, '17.38'],
    [0, '0'],
    [-0, '0'],
    [-1e-9, '0'],
    [308.300001, '308.300001'],
  ])('%s → %s', (n, s) => {
    expect(fmt(n)).toBe(s);
  });
});

describe('normalizeValue', () => {
  it.each([
    ['oklch(97.1% 0.013 17.38)', 'oklch(0.971 0.013 17.38)'],
    ['oklch(0.971 0.013 17.380)', 'oklch(0.971 0.013 17.38)'],
    ['oklch(1 0 0 / 10%)', 'oklch(1 0 0 / 0.1)'],
    ['oklch(1 0 0/0.1)', 'oklch(1 0 0 / 0.1)'],
    ['oklch(\n    1 0 0\n  )', 'oklch(1 0 0)'],
    ['oklch(0.5 0.1 20 / 1)', 'oklch(0.5 0.1 20)'],
    ["'Inter', ui-sans-serif,system-ui", 'Inter, ui-sans-serif, system-ui'],
    ['"Times New Roman", serif', 'Times New Roman, serif'],
    ['var( --radius-base )', 'var(--radius-base)'],
    ['calc(var(--radius-base) * 0.6)', 'calc(var(--radius-base) * 0.6)'],
    [
      '\n    0 1px 3px 0 oklch(0 0 0 / 0.08), 0 1px 2px -1px oklch(0 0 0 / 0.08)',
      '0 1px 3px 0 oklch(0 0 0 / 0.08), 0 1px 2px -1px oklch(0 0 0 / 0.08)',
    ],
    ['0.625rem /* c */', '0.625rem'],
    ['oklch(0.5 50% 20)', 'oklch(0.5 0.2 20)'],
    ['oklch(0.5 0.1 20deg)', 'oklch(0.5 0.1 20)'],
    ['oklch(0.5 0.1 20 / 100%)', 'oklch(0.5 0.1 20)'],
    ['oklch(0.5 0.1 0.5turn)', 'oklch(0.5 0.1 0.5turn)'],
    ['oklch(0.5 0.1 none)', 'oklch(0.5 0.1 none)'],
    ['oklch(0.5 0.1 20 0.3)', 'oklch(0.5 0.1 20 0.3)'],
    ['oklch(0.5 0.1)', 'oklch(0.5 0.1)'],
    ['oklch(0.5 0.1 xdeg)', 'oklch(0.5 0.1 xdeg)'],
    ['oklch(0.5 0.1 nonedeg)', 'oklch(0.5 0.1 nonedeg)'],
    ['oklch(0.5 0.1 deg)', 'oklch(0.5 0.1 deg)'],
  ])('%j → %s', (raw, expected) => {
    expect(normalizeValue(raw)).toBe(expected);
  });

  it.each([
    ['lightness', 'oklch(60% 0.1 20)', 'oklch(0.61 0.1 20)'],
    ['hue units', 'oklch(0.5 0.1 20deg)', 'oklch(0.5 0.1 90deg)'],
    ['hue in turns', 'oklch(0.5 0.1 0.1turn)', 'oklch(0.5 0.1 0.2turn)'],
    ['a non-numeric deg hue', 'oklch(0.5 0.1 nonedeg)', 'oklch(0.5 0.1 none)'],
    ['chroma percent', 'oklch(0.5 50% 20)', 'oklch(0.5 0.5 20)'],
    ['alpha percent', 'oklch(0.5 0.1 20 / 100%)', 'oklch(0.5 0.1 20 / 0.99)'],
    ['a fourth channel', 'oklch(0.5 0.1 20 0.3)', 'oklch(0.5 0.1 20)'],
    ['an empty channel list', 'oklch()', 'oklch(0 0 0)'],
    ['a nested function', 'oklch(calc(0.5) 0.1 20)', 'oklch(calc(0.6) 0.1 20)'],
  ])('keeps different %s apart', (_label, a, b) => {
    expect(normalizeValue(a)).not.toBe(normalizeValue(b));
  });
});

const sample = `/* header */
@import './themes/a.css';
@custom-variant dark (&:where(.dark, .dark *));
@theme {
  --color-a-50: oklch(98% 0 0); /* #fafafa */
}
:root {
  --x: var(--color-a-50);
}
:root[data-theme="t"].dark {
  --x: oklch(0.1 0 0);
}
@theme inline {
  --color-x: var(--x);
}
@layer base {
  * { border-color: var(--x); }
}
`;

describe('collectDeclarations', () => {
  it('maps every token block, normalizing selectors and values', () => {
    expect(collectDeclarations(sample)).toEqual(
      new Map([
        ['@theme', new Map([['--color-a-50', 'oklch(0.98 0 0)']])],
        [':root', new Map([['--x', 'var(--color-a-50)']])],
        [":root[data-theme='t'].dark", new Map([['--x', 'oklch(0.1 0 0)']])],
        ['@theme inline', new Map([['--color-x', 'var(--x)']])],
      ]),
    );
  });
});

describe('collectDeclarations with !important', () => {
  it('keeps the !important flag in the value', () => {
    expect(
      collectDeclarations(':root { --a: red !important; --b: red; }'),
    ).toEqual(
      new Map([
        [
          ':root',
          new Map([
            ['--a', 'red !important'],
            ['--b', 'red'],
          ]),
        ],
      ]),
    );
  });
});

describe('skeleton', () => {
  it('keeps the top-level order and the non-token CSS, without comments', () => {
    expect(skeleton(sample)).toEqual([
      "@import './themes/a.css'",
      '@custom-variant dark (&:where(.dark,.dark *))',
      '@theme{}',
      ':root{}',
      ":root[data-theme='t'].dark{}",
      '@theme inline{}',
      '@layer base{*{border-color:var(--x);}}',
    ]);
  });
});

describe('compareCss', () => {
  const reformatted = sample
    .replace('oklch(98% 0 0)', 'oklch(0.98 0 0)')
    .replace('/* header */', '/* another header */')
    .replace('"t"', "'t'");

  it('finds nothing when only formatting and comments change', () => {
    expect(compareCss('f.css', sample, reformatted)).toEqual([]);
  });

  it('reports a changed, a missing and an extra token', () => {
    const generated = reformatted
      .replace('--x: oklch(0.1 0 0);', '--x: oklch(0.2 0 0);\n  --y: red;')
      .replace('--color-x: var(--x);', '');
    expect(compareCss('f.css', sample, generated)).toEqual([
      {
        file: 'f.css',
        kind: 'changed',
        selector: ":root[data-theme='t'].dark",
        prop: '--x',
        expected: 'oklch(0.1 0 0)',
        actual: 'oklch(0.2 0 0)',
      },
      {
        file: 'f.css',
        kind: 'extra',
        selector: ":root[data-theme='t'].dark",
        prop: '--y',
        actual: 'red',
      },
      {
        file: 'f.css',
        kind: 'missing',
        selector: '@theme inline',
        prop: '--color-x',
        expected: 'var(--x)',
      },
    ]);
  });

  it('reports a missing and an extra selector', () => {
    const generated = reformatted.replace(
      ":root[data-theme='t'].dark",
      '.other',
    );
    const kinds = compareCss('f.css', sample, generated).map((d) => d.kind);
    expect(kinds).toEqual(['missing-selector', 'extra-selector', 'skeleton']);
  });

  it('reports a skeleton change outside the token blocks', () => {
    const generated = reformatted.replace('border-color', 'outline-color');
    expect(compareCss('f.css', sample, generated)).toEqual([
      {
        file: 'f.css',
        kind: 'skeleton',
        selector: '#6',
        expected: '@layer base{*{border-color:var(--x);}}',
        actual: '@layer base{*{outline-color:var(--x);}}',
      },
    ]);
  });

  it('reports every skeleton mismatch, not only the first', () => {
    const generated = reformatted
      .replace('(&:where(.dark, .dark *))', '(&:where(.night, .night *))')
      .replace('border-color', 'outline-color');
    expect(
      compareCss('f.css', sample, generated).map((d) => d.selector),
    ).toEqual(['#1', '#6']);
  });

  it('accepts an allowed extra import and an allowed extra selector', () => {
    const generated = reformatted
      .replace(
        "@import './themes/a.css';",
        "@import './themes/a.css';\n@import './themes/b.css';",
      )
      .concat("\n:root[data-theme='b'] { --x: blue; }\n");
    expect(
      compareCss('f.css', sample, generated, {
        allowExtraImports: ['./themes/b.css'],
        allowExtraSelectors: [":root[data-theme='b']"],
      }),
    ).toEqual([]);
  });

  it('applies an intentional change instead of reporting it', () => {
    const generated = reformatted.replace('oklch(0.98 0 0)', 'oklch(0.97 0 0)');
    expect(
      compareCss('f.css', sample, generated, {
        intentional: [
          {
            file: 'f.css',
            selector: '@theme',
            prop: '--color-a-50',
            to: 'oklch(97% 0 0)',
            reason: 'test',
          },
        ],
      }),
    ).toEqual([]);
  });
});
