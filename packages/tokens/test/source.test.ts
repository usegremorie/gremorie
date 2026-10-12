import { describe, expect, it } from 'vitest';
import {
  BUILD_EXTENSION,
  type DtcgGroup,
  type DtcgToken,
} from '../pipeline/model.ts';
import {
  composeTokens,
  createSource,
  flatten,
  loadSource,
  validateSource,
} from '../pipeline/source.ts';
import { getPath } from '../pipeline/tree.ts';
import { PACKAGE_ROOT } from './support/paths.ts';

const color = (l: number) => ({
  $type: 'color',
  $value: { colorSpace: 'oklch', components: [l, 0, 0] },
});
const base = (): Record<string, DtcgGroup> => ({
  'primitive/color.json': {
    color: { gray: { '50': color(0.98), '900': color(0.2) } },
  },
  'primitive/radius.json': {
    radius: {
      base: { $type: 'dimension', $value: { value: 0.5, unit: 'rem' } },
    },
  },
  'semantic/light.json': {
    background: { $type: 'color', $value: '{color.gray.50}' },
    foreground: { $type: 'color', $value: '{color.gray.900}' },
    'card-foreground': { $type: 'color', $value: '{foreground}' },
  },
  'semantic/dark.json': {
    background: { $type: 'color', $value: '{color.gray.900}' },
  },
});

describe('flatten', () => {
  it('walks groups, skips $ keys and inherits a group $type', () => {
    const flat = flatten(
      { $type: 'color', a: { b: { $value: '{x}' } }, $description: 'd' },
      'f.json',
    );
    expect(flat).toEqual([
      {
        path: ['a', 'b'],
        token: { $value: '{x}', $type: 'color' },
        file: 'f.json',
      },
    ]);
  });
});

describe('validateSource', () => {
  it('accepts a small valid source', () => {
    expect(validateSource(createSource(base(), ['default']))).toEqual([]);
  });

  it('rejects a broken alias, a type mismatch and an unknown type', () => {
    const files = base();
    (files['semantic/light.json'] as DtcgGroup).ring = {
      $type: 'color',
      $value: '{color.gray.400}',
    };
    (files['semantic/light.json'] as DtcgGroup).border = {
      $type: 'dimension',
      $value: '{color.gray.50}',
    };
    (files['semantic/light.json'] as DtcgGroup).weird = {
      $type: 'gradient',
      $value: 'x',
    };
    expect(validateSource(createSource(files, ['default']))).toEqual([
      'semantic/light.json: ring points at {color.gray.400}, which does not exist',
      'semantic/light.json: border is dimension but {color.gray.50} is color',
      'semantic/light.json: weird has unsupported $type gradient',
    ]);
  });

  it('rejects an orphan override and a name collision', () => {
    const files = base();
    (files['semantic/dark.json'] as DtcgGroup).brand = color(0.5);
    (files['semantic/light.json'] as DtcgGroup)['radius-base'] = {
      $type: 'dimension',
      $value: { value: 1, unit: 'rem' },
    };
    expect(validateSource(createSource(files, ['default']))).toEqual([
      '--radius-base is declared by both radius.base (primitive/radius.json) and radius-base (semantic/light.json)',
      'semantic/dark.json: brand overrides nothing in the base layer',
    ]);
  });

  it('rejects a cycle', () => {
    const files = base();
    (files['semantic/light.json'] as DtcgGroup).a = {
      $type: 'color',
      $value: '{b}',
    };
    (files['semantic/light.json'] as DtcgGroup).b = {
      $type: 'color',
      $value: '{a}',
    };
    expect(validateSource(createSource(files, ['default']))).toContain(
      'default/light: reference cycle a → b → a',
    );
  });

  it('rejects a theme that overrides a token missing from the base', () => {
    const files = base();
    files['themes/claude.json'] = { light: { nope: color(0.4) }, dark: {} };
    expect(validateSource(createSource(files, ['default', 'claude']))).toEqual([
      'themes/claude.json: nope overrides nothing in the base layer',
    ]);
  });

  it('rejects an override that changes the type of its base token', () => {
    const files = base();
    (files['semantic/dark.json'] as DtcgGroup).foreground = {
      $type: 'dimension',
      $value: { value: 1, unit: 'rem' },
    };
    expect(validateSource(createSource(files, ['default']))).toEqual([
      'semantic/dark.json: foreground is dimension but the base token is color',
    ]);
  });

  it('reports a base-layer cycle once across every theme and mode', () => {
    const files = base();
    (files['semantic/light.json'] as DtcgGroup).a = {
      $type: 'color',
      $value: '{b}',
    };
    (files['semantic/light.json'] as DtcgGroup).b = {
      $type: 'color',
      $value: '{a}',
    };
    files['themes/claude.json'] = { light: {}, dark: {} };
    const problems = validateSource(createSource(files, ['default', 'claude']));
    expect(problems.filter((p) => p.includes('reference cycle'))).toEqual([
      'default/light: reference cycle a → b → a',
    ]);
  });

  it('reports a path with several invalid segments once', () => {
    const files = base();
    (files['semantic/light.json'] as DtcgGroup).Bad = {
      Worse: color(0.5),
    };
    expect(validateSource(createSource(files, ['default']))).toEqual([
      'semantic/light.json: Bad.Worse has an invalid name',
    ]);
  });

  it('rejects a token whose path is also a group in another file', () => {
    const files = base();
    files['themes/claude.json'] = {
      light: { foreground: { strong: color(0.1) } },
      dark: {},
    };
    expect(validateSource(createSource(files, ['default', 'claude']))).toEqual([
      'themes/claude.json: foreground.strong overrides nothing in the base layer',
      'themes/claude.json: foreground.strong is nested under foreground, a token in semantic/light.json',
    ]);
  });

  it('accepts the real source', () => {
    expect(validateSource(loadSource(PACKAGE_ROOT))).toEqual([]);
  });
});

describe('composeTokens', () => {
  const files = base();
  files['themes/claude.json'] = {
    light: { foreground: color(0.1) },
    dark: { background: color(0.3) },
  };
  const source = createSource(files, ['default', 'claude']);
  const meta = (tree: DtcgGroup, path: string[]) =>
    ((getPath(tree, path) as DtcgToken).$extensions ?? {})[BUILD_EXTENSION];

  it('stacks base, dark, theme light and theme dark, as the CSS cascade does', () => {
    const tree = composeTokens(source, 'claude', 'dark');
    expect(meta(tree, ['background'])).toMatchObject({ layer: 'theme-dark' });
    expect(meta(tree, ['foreground'])).toMatchObject({ layer: 'theme-light' });
    expect(meta(tree, ['card-foreground'])).toMatchObject({
      layer: 'semantic-light',
      file: 'semantic/light.json',
    });
    expect(meta(tree, ['color', 'gray', '50'])).toMatchObject({
      layer: 'primitive',
    });
  });

  it('leaves the theme out of the default theme and dark out of light', () => {
    const tree = composeTokens(source, 'default', 'light');
    expect(meta(tree, ['background'])).toMatchObject({
      layer: 'semantic-light',
    });
    expect(meta(tree, ['foreground'])).toMatchObject({
      layer: 'semantic-light',
    });
  });

  it('never mutates the source', () => {
    composeTokens(source, 'claude', 'dark');
    expect((files['semantic/light.json'] as DtcgGroup).background).toEqual({
      $type: 'color',
      $value: '{color.gray.50}',
    });
  });
});
