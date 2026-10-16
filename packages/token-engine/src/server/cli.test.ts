import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const cli = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '../../bin/cli.mjs'),
  'utf8',
);

describe('the CLI server', () => {
  it('listens on the loopback address only', () => {
    expect(cli).toMatch(/serve\(\s*\{[^}]*hostname: '127\.0\.0\.1'/);
  });
});
