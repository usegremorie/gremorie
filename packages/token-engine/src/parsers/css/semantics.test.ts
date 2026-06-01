import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import { parseSemantics } from './semantics.js';

const css = readFileSync(
  join(__dirname, '__fixtures__/semantics-themes.css'),
  'utf8',
);

describe('parseSemantics', () => {
  const tokens = parseSemantics(css, 'semantics-themes.css');

  it('extracts :root default light semantics', () => {
    const bg = tokens.find(
      (t) =>
        t.theme === 'default' &&
        t.mode === 'light' &&
        t.name === '--background',
    );
    expect(bg).toBeDefined();
    expect(bg!.value).toEqual({
      kind: 'reference',
      targetName: '--color-gray-50',
    });
  });

  it('extracts literal value when not a var(...)', () => {
    const primary = tokens.find(
      (t) =>
        t.theme === 'default' && t.mode === 'light' && t.name === '--primary',
    );
    expect(primary!.value).toEqual({
      kind: 'literal',
      raw: 'oklch(0.5 0.2 30)',
    });
  });

  it('extracts .dark as default dark mode', () => {
    const bg = tokens.find(
      (t) =>
        t.theme === 'default' && t.mode === 'dark' && t.name === '--background',
    );
    expect(bg).toBeDefined();
  });

  it('extracts [data-theme=...] light variants', () => {
    const bg = tokens.find(
      (t) =>
        t.theme === 'amber-minimal' &&
        t.mode === 'light' &&
        t.name === '--background',
    );
    expect(bg).toBeDefined();
  });

  it('extracts [data-theme=...].dark variants', () => {
    const bg = tokens.find(
      (t) =>
        t.theme === 'amber-minimal' &&
        t.mode === 'dark' &&
        t.name === '--background',
    );
    expect(bg).toBeDefined();
  });

  it('handles comma-separated multi-selector rules (`:root, [data-theme="default"]`)', () => {
    // Both :root and [data-theme="default"] target the same theme+mode.
    // Parser should yield one set of tokens classified as default/light.
    const radius = tokens.find(
      (t) =>
        t.theme === 'default' && t.mode === 'light' && t.name === '--radius',
    );
    expect(radius).toBeDefined();
    expect(radius!.value).toEqual({ kind: 'literal', raw: '0.625rem' });
  });

  it('handles multi-selector dark variant (`:root.dark, [data-theme="default"].dark`)', () => {
    // The :root.dark fragment in the multi-selector should classify as default/dark.
    // Multiple default/dark --background entries may exist (from different fixture blocks);
    // assert at least one carries the neutral-950 value from the multi-selector rule.
    const darkBgs = tokens.filter(
      (t) =>
        t.theme === 'default' && t.mode === 'dark' && t.name === '--background',
    );
    expect(darkBgs.length).toBeGreaterThanOrEqual(1);
    const fromMultiSelector = darkBgs.find(
      (t) =>
        t.value.kind === 'reference' &&
        t.value.targetName === '--color-neutral-950',
    );
    expect(fromMultiSelector).toBeDefined();
  });

  it('skips --color-* declarations inside a matching rule (those are primitives, not semantics)', () => {
    const colorish = tokens.find((t) => t.name.startsWith('--color-'));
    expect(colorish).toBeUndefined();
  });
});
