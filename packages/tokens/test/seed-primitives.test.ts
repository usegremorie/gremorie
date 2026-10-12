import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PRIMITIVE_FILES, type DtcgGroup } from '../pipeline/model.ts';
import {
  cleanComment,
  readBlocks,
  seedPrimitives,
} from '../pipeline/seed/from-css.ts';
import { getPath } from '../pipeline/tree.ts';
import { REFERENCE_DIR } from './support/paths.ts';

const css = readFileSync(join(REFERENCE_DIR, 'theme.css'), 'utf8');
const seeded = seedPrimitives(css);
const at = (file: string, ...path: string[]) =>
  getPath(seeded[file] as DtcgGroup, path);

describe('cleanComment', () => {
  it('drops stars, rules and dashes, keeps paragraphs', () => {
    expect(cleanComment('─── 1. PRIMITIVES ─────')).toBe('1. PRIMITIVES');
    expect(
      cleanComment(
        '*\n   * The default is indigo \u2014 a hue.\n   *\n   * Second.',
      ),
    ).toBe('The default is indigo, a hue.\n\nSecond.');
  });
});

describe('readBlocks', () => {
  it('attaches a preceding comment and a same-line comment to the token', () => {
    const blocks = readBlocks(css);
    const theme = blocks.find((b) => b.key === '@theme');
    const gray0 = theme?.decls.find((d) => d.prop === '--color-gray-0');
    expect(gray0?.description).toBe(
      '1. PRIMITIVES\n\npure white, elevated surfaces (card/popover) on light',
    );
    const red100 = theme?.decls.find((d) => d.prop === '--color-red-100');
    expect(red100?.description).toBeUndefined(); // a bare hex comment is dropped
    const red50 = theme?.decls.find((d) => d.prop === '--color-red-50');
    expect(red50?.description).toMatch(/^Full canonical red scale/);
  });
});

describe('seedPrimitives', () => {
  it('writes the five primitive files', () => {
    expect(Object.keys(seeded).sort()).toEqual(
      Object.keys(PRIMITIVE_FILES).sort(),
    );
  });

  it('keeps every colour primitive of 0.8.0', () => {
    const count = (css.match(/^\s*--color-[a-z]+-\d+:/gm) ?? []).length;
    const colors = (seeded['primitive/color.json'] as DtcgGroup)
      .color as DtcgGroup;
    let seen = 0;
    for (const ramp of Object.values(colors)) {
      if (typeof ramp === 'object' && ramp !== null) {
        seen += Object.keys(ramp).filter((k) => !k.startsWith('$')).length;
      }
    }
    expect(seen).toBe(count);
  });

  it('writes oklch colour objects, with descriptions where 0.8.0 had prose', () => {
    expect(at('primitive/color.json', 'color', 'red', '100')).toEqual({
      $type: 'color',
      $value: { colorSpace: 'oklch', components: [0.936, 0.032, 17.717] },
    });
    expect(at('primitive/color.json', 'color', 'clay', '500')).toEqual({
      $type: 'color',
      $value: { colorSpace: 'oklch', components: [0.672, 0.131, 38.76] },
      $description: 'brand',
    });
    expect(
      (
        at('primitive/color.json', 'color', 'amber', '500') as {
          $description: string;
        }
      ).$description,
    ).toMatch(/^76\.9% quantises/);
  });

  it('keeps the radius scale as a derivation of radius.base', () => {
    expect(at('primitive/radius.json', 'radius', 'sm')).toEqual({
      $type: 'dimension',
      $value: { value: 0.375, unit: 'rem' },
      $extensions: {
        'com.gremorie.derive': { from: '{radius.base}', multiply: 0.6 },
      },
    });
    expect(at('primitive/radius.json', 'radius', 'lg')).toEqual({
      $type: 'dimension',
      $value: '{radius.base}',
    });
  });

  it('keeps 0em in the CSS extension, with a valid DTCG value', () => {
    expect(at('primitive/spacing.json', 'tracking', 'normal')).toEqual({
      $type: 'dimension',
      $value: { value: 0, unit: 'rem' },
      $extensions: { 'com.gremorie.css': { value: '0em' } },
    });
  });

  it('reads fonts as lists and shadows from :root', () => {
    expect(
      (at('primitive/font.json', 'font', 'sans') as { $value: unknown }).$value,
    ).toEqual(['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']);
    const sm = at('primitive/shadow.json', 'shadow-sm') as { $value: unknown };
    expect(Array.isArray(sm.$value) && sm.$value.length).toBe(2);
  });

  it('carries no em dash or en dash into any description', () => {
    expect(JSON.stringify(seeded)).not.toMatch(/[\u2013\u2014]/);
  });
});
