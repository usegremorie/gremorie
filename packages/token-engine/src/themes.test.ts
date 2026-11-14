import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * Integration guard over the published token source in @gremorie/tokens. Keeps
 * the brand layer from creeping back and the tweakcn contract complete.
 */
const here = dirname(fileURLToPath(import.meta.url));
const tokensDir = join(here, '../../tokens/styles');
const themesDir = join(tokensDir, 'themes');
const theme = readFileSync(join(tokensDir, 'theme.css'), 'utf8');

const BRAND_THEMES = [
  'claude',
  'chatgpt',
  'gemini',
  'perplexity',
  'mistral',
  'purple',
] as const;

describe('@gremorie/tokens theme.css', () => {
  it('has no semantic brand token', () => {
    expect(theme).not.toMatch(/--brand\b/);
  });

  it('ships the brand primitive ramp the comparison scheme points at', () => {
    // The ramp is a primitive, not the brand layer this file guards against:
    // --chart-cmp-highlight resolves through it, so it has to exist here.
    for (const step of [50, 500, 600, 950]) {
      expect(theme).toContain(`--color-brand-${step}:`);
    }
    expect(theme).toContain('--chart-cmp-highlight:');
  });

  it('defines the typography tokens', () => {
    expect(theme).toContain('--font-sans');
    expect(theme).toContain('--font-serif');
    expect(theme).toContain('--font-mono');
  });

  it('defines the sidebar and shadow tokens', () => {
    expect(theme).toContain('--sidebar:');
    expect(theme).toContain('--shadow-md:');
  });
});

describe('@gremorie/tokens brand themes', () => {
  it('ships exactly the six brand theme files', () => {
    const files = readdirSync(themesDir)
      .filter((f) => f.endsWith('.css'))
      .sort();
    expect(files).toEqual([
      'chatgpt.css',
      'claude.css',
      'gemini.css',
      'mistral.css',
      'perplexity.css',
      'purple.css',
    ]);
  });

  it.each(BRAND_THEMES)(
    'theme %s defines a light block, a dark block, and primary',
    (name) => {
      const css = readFileSync(join(themesDir, `${name}.css`), 'utf8');
      expect(css).toContain(`[data-theme='${name}']`);
      expect(css).toContain(`[data-theme='${name}'].dark`);
      expect(css).toMatch(/--primary:/);
    },
  );
});

describe('every theme switcher offers every theme', () => {
  const root = join(here, '../../..');
  it.each([
    'packages/rx-ai/.storybook/preview.ts',
    'packages/ng-ai/.storybook/preview.ts',
    'apps/workbench/src/app.tsx',
    'apps/docs/components/landing/assistant-showcase.tsx',
    'apps/docs/components/semantic-color-data.ts',
  ])('%s lists the purple theme', (file) => {
    expect(readFileSync(join(root, file), 'utf8')).toMatch(/['"]purple['"]/);
  });

  it('the workbench stylesheet imports the purple theme', () => {
    expect(
      readFileSync(join(root, 'apps/workbench/src/styles.css'), 'utf8'),
    ).toContain("themes/purple.css'");
  });
});
