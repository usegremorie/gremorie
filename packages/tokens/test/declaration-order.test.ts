import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { collectDeclarations } from '../pipeline/compare.ts';
import { INTENTIONAL } from './support/intentional.ts';
import { PACKAGE_ROOT, REFERENCE_DIR } from './support/paths.ts';

const FILES = [
  'theme.css',
  ...readdirSync(join(REFERENCE_DIR, 'themes'))
    .filter((f) => f.endsWith('.css'))
    .map((f) => `themes/${f}`),
];

describe('every block keeps the 0.8.0 declaration order', () => {
  it.each(FILES)('%s', (file) => {
    const reference = collectDeclarations(
      readFileSync(join(REFERENCE_DIR, file), 'utf8'),
    );
    const generated = collectDeclarations(
      readFileSync(join(PACKAGE_ROOT, 'styles', file), 'utf8'),
    );
    for (const [selector, decls] of reference) {
      const keys = [...(generated.get(selector)?.keys() ?? [])];
      // The 0.8.0 declarations keep their order...
      expect(
        keys.filter((k) => decls.has(k)),
        selector,
      ).toEqual([...decls.keys()]);
      // ...and a declaration added since is one declared on purpose for
      // this file and selector (reference/intentional-changes.json).
      const declared = new Set(
        INTENTIONAL.filter(
          (c) => c.file === file && c.selector === selector && c.to !== null,
        ).map((c) => c.prop),
      );
      expect(
        keys.filter((k) => !decls.has(k) && !declared.has(k)),
        `${selector}: undeclared additions`,
      ).toEqual([]);
    }
  });
});
