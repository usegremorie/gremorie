import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PACKAGE_ROOT } from './support/paths.ts';

describe('the npm tarball', () => {
  it('ships the licence and the notice, then cleans up the copies', () => {
    const out = execSync('npm pack --dry-run --json', {
      cwd: PACKAGE_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const [pack] = JSON.parse(out.slice(out.indexOf('['))) as {
      files: { path: string }[];
    }[];
    const paths = (pack?.files ?? []).map((f) => f.path);
    expect(paths).toContain('LICENSE');
    expect(paths).toContain('NOTICE.md');
    expect(existsSync(join(PACKAGE_ROOT, 'LICENSE'))).toBe(false);
    expect(existsSync(join(PACKAGE_ROOT, 'NOTICE.md'))).toBe(false);
  }, 60_000);
});
