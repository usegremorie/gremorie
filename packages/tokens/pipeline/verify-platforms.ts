import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Compiles dist/compose against stubs of the Compose signatures (kotlinc) and
 * typechecks dist/swift against a stub SwiftUI module (swiftc; Linux has no
 * SwiftUI). Each step skips when its compiler is missing, unless
 * REQUIRE_PLATFORM_COMPILERS=1 (the CI).
 */
const root = fileURLToPath(new URL('../', import.meta.url));
const required = process.env.REQUIRE_PLATFORM_COMPILERS === '1';
const shell = process.platform === 'win32';
const has = (cmd: string) =>
  spawnSync(cmd, ['-version'], { shell, stdio: 'ignore' }).status === 0;
let failed = false;

/** Runs each command in turn; the step fails at the first that fails. */
function step(name: string, cmd: string, runs: string[][]): void {
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
  for (const args of runs) {
    const result = spawnSync(cmd, args, { shell, stdio: 'inherit' });
    if (result.status !== 0) {
      console.error(`${name}: failed`);
      failed = true;
      return;
    }
  }
  console.log(`${name}: ok`);
}

const tempDirs: string[] = [];
const tempDir = (prefix: string): string => {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
};

try {
  const stubs = join(root, 'pipeline/verify/stubs');
  step('Kotlin', 'kotlinc', [
    [
      join(stubs, 'Color.kt'),
      join(stubs, 'Material3.kt'),
      join(root, 'dist/compose/GremorieColorSchemes.kt'),
      '-d',
      tempDir('gremorie-kotlin-'),
    ],
  ]);
  const swiftModules = tempDir('gremorie-swift-');
  step('Swift', 'swiftc', [
    [
      '-emit-module',
      '-parse-as-library',
      '-module-name',
      'SwiftUI',
      '-emit-module-path',
      join(swiftModules, 'SwiftUI.swiftmodule'),
      join(stubs, 'SwiftUI.swift'),
    ],
    [
      '-typecheck',
      '-I',
      swiftModules,
      join(root, 'dist/swift/GremorieTokens.swift'),
    ],
  ]);
} finally {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
}
if (failed) process.exit(1);
