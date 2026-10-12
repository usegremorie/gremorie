import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { DtcgGroup } from '../pipeline/model.ts';
import { seedTheme } from '../pipeline/seed/from-css.ts';
import { REFERENCE_DIR } from './support/paths.ts';

const seed = (theme: 'claude' | 'chatgpt') =>
  seedTheme(
    readFileSync(join(REFERENCE_DIR, 'themes', `${theme}.css`), 'utf8'),
    theme,
  );

describe('seedTheme', () => {
  it('splits the light and dark blocks and keeps the header as $description', () => {
    const claude = seed('claude');
    expect(claude.$description).toMatch(/^Claude theme: warm clay/);
    const light = claude.light as DtcgGroup;
    expect(light.primary).toMatchObject({
      $type: 'color',
      $value: '{color.clay.500}',
    });
    expect((light.primary as { $description: string }).$description).toMatch(
      /^Intentional 3\.0:1 pair/,
    );
    expect((light.radius as DtcgGroup).base).toEqual({
      $type: 'dimension',
      $value: { value: 0.5, unit: 'rem' },
    });
    expect((light.font as DtcgGroup).serif).toMatchObject({
      $value: ['Tiempos Headline', 'Georgia', 'Times New Roman', 'serif'],
    });
    expect(light.$description).toMatch(/categorical chart scale/);
  });

  it('keeps a theme shadow override in the theme file', () => {
    const light = seed('chatgpt').light as DtcgGroup;
    expect(light['shadow-md']).toMatchObject({ $type: 'shadow' });
  });
});
