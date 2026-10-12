import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import tailwind from '@tailwindcss/postcss';
import postcss from 'postcss';
import { describe, expect, it } from 'vitest';
import { PACKAGE_ROOT } from './support/paths.ts';

describe('Tailwind v4 compiles the generated CSS', () => {
  it('produces utilities from the tokens', async () => {
    const from = join(PACKAGE_ROOT, 'test', 'fixtures', 'smoke.css');
    const result = await postcss([tailwind()]).process(
      readFileSync(from, 'utf8'),
      { from },
    );
    expect(result.css).toContain('.bg-primary');
    expect(result.css).toContain('.rounded-sm');
    expect(result.css).toContain('.bg-gray-500');
    expect(result.css).toMatch(/\.dark\\:bg-card/);
    expect(result.css).toContain('--color-gray-500');
  });
});
