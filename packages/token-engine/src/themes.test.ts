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
] as const;

describe('@gremorie/tokens theme.css', () => {
  it('has no leftover brand tokens', () => {
    expect(theme).not.toMatch(/--brand\b/);
    expect(theme).not.toMatch(/--color-brand-/);
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
  it('ships exactly the five brand theme files', () => {
    const files = readdirSync(themesDir)
      .filter((f) => f.endsWith('.css'))
      .sort();
    expect(files).toEqual([
      'chatgpt.css',
      'claude.css',
      'gemini.css',
      'mistral.css',
      'perplexity.css',
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
