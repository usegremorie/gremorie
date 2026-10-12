import { describe, expect, it } from 'vitest';
import type { DtcgGroup } from '../pipeline/model.ts';
import {
  applyDerive,
  resolvedCss,
  runTheme,
  type Run,
  type RunToken,
} from '../pipeline/run.ts';
import { createSource } from '../pipeline/source.ts';

const files = (): Record<string, DtcgGroup> => ({
  'primitive/color.json': {
    color: {
      gray: {
        '50': {
          $type: 'color',
          $value: { colorSpace: 'oklch', components: [0.98, 0, 0] },
        },
      },
    },
  },
  'primitive/radius.json': {
    radius: {
      base: { $type: 'dimension', $value: { value: 0.625, unit: 'rem' } },
      sm: {
        $type: 'dimension',
        $value: { value: 0.375, unit: 'rem' },
        $extensions: {
          'com.gremorie.derive': { from: '{radius.base}', multiply: 0.6 },
        },
      },
    },
  },
  'semantic/light.json': {
    background: {
      $type: 'color',
      $value: '{color.gray.50}',
      $description: 'page',
    },
  },
  'semantic/dark.json': {},
  'themes/claude.json': {
    light: {
      radius: {
        base: { $type: 'dimension', $value: { value: 0.5, unit: 'rem' } },
      },
    },
    dark: {},
  },
});

const token = (run: Run, name: string): RunToken => {
  const found = run.byName.get(name);
  if (!found) throw new Error(`${name} is missing from the run`);
  return found;
};

describe('runTheme', () => {
  it('resolves aliases through Style Dictionary and keeps the original', async () => {
    const { run } = await runTheme(
      createSource(files(), ['default', 'claude']),
      'default',
      'light',
    );
    const bg = token(run, '--background');
    expect(bg).toMatchObject({
      layer: 'semantic-light',
      file: 'semantic/light.json',
      type: 'color',
      original: '{color.gray.50}',
      value: { colorSpace: 'oklch', components: [0.98, 0, 0] },
      description: 'page',
    });
    expect(resolvedCss(bg)).toBe('oklch(0.98 0 0)');
  });

  it('recomputes a derived radius from the theme base', async () => {
    const { run } = await runTheme(
      createSource(files(), ['default', 'claude']),
      'claude',
      'dark',
    );
    expect(token(run, '--radius-sm').value).toEqual({
      value: 0.3,
      unit: 'rem',
    });
    expect(token(run, '--radius-base').layer).toBe('theme-light');
  });

  it('fails loudly on a broken reference', async () => {
    const broken = files();
    (broken['semantic/light.json'] as DtcgGroup).ring = {
      $type: 'color',
      $value: '{nope}',
    };
    await expect(
      runTheme(createSource(broken, ['default']), 'default', 'light'),
    ).rejects.toThrow();
  });
});

describe('applyDerive', () => {
  it('rejects a derivation from a token that is not a dimension', () => {
    const t = (
      path: string[],
      type: RunToken['type'],
      extra: Partial<RunToken> = {},
    ): RunToken => ({
      path,
      name: `--${path.join('-')}`,
      type,
      layer: 'primitive',
      file: 'f',
      order: 0,
      value: { colorSpace: 'oklch', components: [0, 0, 0] },
      original: '',
      ...extra,
    });
    expect(() =>
      applyDerive([
        t(['a'], 'color'),
        t(['b'], 'dimension', { derive: { from: '{a}', multiply: 2 } }),
      ]),
    ).toThrow(/not a dimension/);
  });
});
