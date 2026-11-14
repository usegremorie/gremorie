import { describe, expect, it } from 'vitest';
import { toHex } from '../pipeline/color.ts';
import { buildCss } from '../pipeline/build.ts';
import { loadRoleMap, M3_ROLES } from '../pipeline/m3.ts';
import { THEMES, type ThemeId } from '../pipeline/model.ts';
import { buildPlatformModel, camel } from '../pipeline/platforms/model.ts';
import { loadSource } from '../pipeline/source.ts';
import { PACKAGE_ROOT } from './support/paths.ts';

const source = loadSource(PACKAGE_ROOT);
const { runs } = await buildCss(source);
const model = buildPlatformModel(
  runs,
  loadRoleMap(PACKAGE_ROOT),
  source.themes,
  '0.0.0-test',
);

const themeOf = (name: string) => {
  const theme = model.themes[name];
  if (!theme) throw new Error(`No theme ${name} in the model`);
  return theme;
};

describe('platform model', () => {
  it('names semantic colours in camelCase', () => {
    expect(camel('sidebar-primary-foreground')).toBe(
      'sidebarPrimaryForeground',
    );
    expect(camel('chart-cat-1')).toBe('chartCat1');
  });

  it('covers every theme and mode, with the same keys everywhere', () => {
    expect(model.themeNames).toEqual([...THEMES]);
    const keys = Object.keys(themeOf('default').light.colors).sort();
    expect(keys).toContain('primaryForeground');
    expect(keys).not.toContain('shadowSm');
    for (const theme of THEMES) {
      for (const mode of ['light', 'dark'] as const) {
        expect(Object.keys(themeOf(theme)[mode].colors).sort()).toEqual(keys);
        expect(Object.keys(themeOf(theme)[mode].m3)).toEqual([...M3_ROLES]);
      }
    }
  });

  it('follows the CSS cascade in a named theme in dark mode', () => {
    const chatgptDark = themeOf('chatgpt').dark;
    expect(chatgptDark.colors.background?.hex).toBe(
      toHex({ colorSpace: 'oklch', components: [0.248, 0, 0] }),
    );
    expect(chatgptDark.radius.base).toBe(12); // 0.75rem from the chatgpt light block
    expect(chatgptDark.colors.cardForeground).toEqual(
      chatgptDark.colors.foreground,
    );
    expect(themeOf('claude').dark.fontFamily.serif[0]).toBe('Tiempos Headline');
    expect(themeOf('claude').light.radius.sm).toBe(4.8); // 0.5rem * 0.6
  });

  it('records where each M3 role comes from', () => {
    expect(model.m3Sources.onPrimary).toBe('--primary-foreground');
    expect(model.m3Sources.surfaceContainer).toBe('derived');
  });

  it('refuses a theme id that is not a code identifier', () => {
    expect(() =>
      buildPlatformModel(
        runs,
        loadRoleMap(PACKAGE_ROOT),
        ['my-brand' as ThemeId],
        '0.0.0-test',
      ),
    ).toThrow(/Theme id "my-brand" must match \^\[a-z\]/);
  });
});
