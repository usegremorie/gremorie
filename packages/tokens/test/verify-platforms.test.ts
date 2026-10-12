import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { PACKAGE_ROOT } from './support/paths.ts';

describe('verify-platforms', () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const dir of dirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('leaves no temporary directory behind', () => {
    const temp = mkdtempSync(join(tmpdir(), 'verify-platforms-test-'));
    dirs.push(temp);
    // No compiler on the PATH and none required: the run only skips, so the
    // test needs neither dist/ nor kotlinc and swiftc.
    const env: NodeJS.ProcessEnv = {
      ...process.env,
      PATH: temp,
      Path: temp,
      TMP: temp,
      TEMP: temp,
      TMPDIR: temp,
    };
    delete env.REQUIRE_PLATFORM_COMPILERS;
    const result = spawnSync(
      process.execPath,
      [join(PACKAGE_ROOT, 'pipeline/verify-platforms.ts')],
      {
        env,
        encoding: 'utf8',
      },
    );
    expect(result.status, result.stderr).toBe(0);
    expect(result.stderr).toMatch(/Kotlin: skipped/);
    expect(readdirSync(temp)).toEqual([]);
  });
});
