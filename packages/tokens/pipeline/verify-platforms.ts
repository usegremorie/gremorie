import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Compiles dist/compose against stubs of the Compose signatures (kotlinc) and
 * parses dist/swift (swiftc -parse; Linux has no SwiftUI). Each step skips when
 * its compiler is missing, unless REQUIRE_PLATFORM_COMPILERS=1 (the CI).
 */
const root = fileURLToPath(new URL('../', import.meta.url));
const required = process.env.REQUIRE_PLATFORM_COMPILERS === '1';
const shell = process.platform === 'win32';
const has = (cmd: string) =>
  spawnSync(cmd, ['-version'], { shell, stdio: 'ignore' }).status === 0;
let failed = false;

function step(name: string, cmd: string, args: string[]): void {
  if (!has(cmd)) {
    if (required) {
      console.error(
        `${name}: ${cmd} not found, and REQUIRE_PLATFORM_COMPILERS=1`,
      );
      failed = true;
    } else {
      console.warn(`${name}: skipped, ${cmd} not found`);
    }
    return;
  }
  const result = spawnSync(cmd, args, { shell, stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`${name}: failed`);
    failed = true;
  } else {
    console.log(`${name}: ok`);
  }
}

const tempDirs: string[] = [];
const tempDir = (prefix: string): string => {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
};

try {
  step('Kotlin', 'kotlinc', [
    join(root, 'pipeline/verify/stubs/Color.kt'),
    join(root, 'pipeline/verify/stubs/Material3.kt'),
    join(root, 'dist/compose/GremorieColorSchemes.kt'),
    '-d',
    tempDir('gremorie-kotlin-'),
  ]);
  step('Swift', 'swiftc', [
    '-parse',
    join(root, 'dist/swift/GremorieTokens.swift'),
  ]);
} finally {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
}
if (failed) process.exit(1);
