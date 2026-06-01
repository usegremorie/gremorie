#!/usr/bin/env node
/**
 * Publishes the Gremorie packages to npm.
 *
 * The two editions build to DIFFERENT locations, so they publish from
 * different directories:
 *   - Angular (@gremorie/ng-*): ng-packagr output at `dist/packages/<name>`
 *     (that folder holds the correct generated package.json + FESM bundle).
 *   - React (@gremorie/rx-*) and the CLI: in-package `dist/` shipped via the
 *     package's own `files` field, so they publish from `packages/<name>`.
 *
 * Private packages (registry generator, eslint-config, tsconfig, token-engine,
 * apps) are skipped automatically.
 *
 * Usage:
 *   node scripts/release.mjs            # real publish (needs npm auth)
 *   node scripts/release.mjs --dry-run  # pack + report only, no upload, no auth
 *
 * Build the libraries BEFORE running this (the `release` npm script does it).
 */
import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DRY = process.argv.includes('--dry-run');
const root = process.cwd();
const pkgsDir = join(root, 'packages');

const targets = [];
for (const dir of readdirSync(pkgsDir)) {
  const manifest = join(pkgsDir, dir, 'package.json');
  if (!existsSync(manifest)) continue;
  const pkg = JSON.parse(readFileSync(manifest, 'utf8'));
  if (pkg.private) continue;
  if (!pkg.name?.startsWith('@gremorie/')) continue;

  // Angular libs (ng-packagr) publish from their dist output; detect them by
  // the presence of an ng-package.json. Everything else (React + CLI) ships
  // its in-package dist via `files` and publishes from source.
  const isAngular = existsSync(join(pkgsDir, dir, 'ng-package.json'));
  const publishDir = isAngular
    ? join('dist', 'packages', dir) // ng-packagr output
    : join('packages', dir); // in-package dist via `files`
  targets.push({ name: pkg.name, version: pkg.version, dir: publishDir });
}

targets.sort((a, b) => a.name.localeCompare(b.name));

console.log(
  `\nGremorie release — ${targets.length} package(s)${DRY ? ' (DRY RUN, nothing is uploaded)' : ''}:\n`,
);

let failed = 0;
for (const t of targets) {
  const full = join(root, t.dir);
  if (!existsSync(join(full, 'package.json'))) {
    console.error(
      `  ✗ ${t.name}: build output missing at ${t.dir} — build the libraries first.`,
    );
    failed++;
    continue;
  }
  console.log(`  • ${t.name}@${t.version}  ←  ${t.dir}`);
  const cmd = `npm publish "${full}" --access public${DRY ? ' --dry-run' : ''}`;
  try {
    execSync(cmd, { stdio: DRY ? 'ignore' : 'inherit' });
  } catch (err) {
    console.error(`    ✗ failed: ${err.message}`);
    failed++;
  }
}

console.log(
  `\n${DRY ? 'Dry run complete — nothing was published.' : 'Publish complete.'}` +
    (failed ? ` (${failed} issue(s))` : ''),
);
process.exitCode = failed ? 1 : 0;
