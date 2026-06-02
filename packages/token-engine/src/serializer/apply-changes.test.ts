import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import { applyChanges } from './apply-changes.js';

const input = `/* Header comment */
@theme {
  /* gray scale */
  --color-gray-50: oklch(0.985 0 0);
  --color-gray-900: oklch(0.205 0 0);
}

:root {
  --background: var(--color-gray-50); /* trailing */
}
`;

describe('applyChanges', () => {
  it('returns identical string when no changes', () => {
    expect(applyChanges(input, 'g.css', [])).toBe(input);
  });

  it('updates a single primitive value, preserves everything else', () => {
    const out = applyChanges(input, 'g.css', [
      {
        kind: 'primitive-value',
        tokenName: '--color-gray-50',
        newValue: 'oklch(0.99 0 0)',
      },
    ]);
    expect(out).toContain('--color-gray-50: oklch(0.99 0 0)');
    expect(out).toContain('/* Header comment */');
    expect(out).toContain('/* gray scale */');
    expect(out).toContain('--color-gray-900: oklch(0.205 0 0)');
    expect(out).toContain('/* trailing */');
  });

  it('updates a semantic reference', () => {
    const out = applyChanges(input, 'g.css', [
      {
        kind: 'semantic-value',
        tokenName: '--background',
        theme: 'default',
        mode: 'light',
        newValue: { kind: 'reference', targetName: '--color-gray-900' },
      },
    ]);
    expect(out).toContain('--background: var(--color-gray-900)');
    expect(out).toContain('/* trailing */');
  });
});

describe('applyChanges — roundtrip against real KDS globals', () => {
  // From src/serializer → up 3 levels reaches packages/token-engine, then into kds/
  const kdsGlobals = join(__dirname, '../../../kds/src/styles/globals.css');

  it.skipIf(!existsSync(kdsGlobals))('byte-equal when no changes', () => {
    const css = readFileSync(kdsGlobals, 'utf8');
    expect(applyChanges(css, 'globals.css', [])).toBe(css);
  });

  it.skipIf(!existsSync(kdsGlobals))(
    'byte-equal when changes target tokens not in the file (proves postcss serialization is lossless)',
    () => {
      const css = readFileSync(kdsGlobals, 'utf8');
      // A change targeting a token that does not exist in the file — exercises
      // the full postcss.parse → walk → toString roundtrip without mutating
      // anything. This is the real lossless-serialization proof; the empty-array
      // test only exercises the short-circuit branch.
      const out = applyChanges(css, 'globals.css', [
        {
          kind: 'primitive-value',
          tokenName: '--this-token-does-not-exist',
          newValue: 'oklch(0 0 0)',
        },
      ]);
      expect(out).toBe(css);
    },
  );
});
