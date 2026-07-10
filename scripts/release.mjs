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
 *   node scripts/release.mjs --allow-dirty  # skip the clean-tree guard (avoid)
 *
 * Build the libraries BEFORE running this (the `release` npm script does it).
 */
import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DRY = process.argv.includes('--dry-run');
const ALLOW_DIRTY = process.argv.includes('--allow-dirty');
const root = process.cwd();
const pkgsDir = join(root, 'packages');

// Refuse to publish from a dirty working tree. A real publish is irreversible
// (npm forbids republishing a version), so shipping uncommitted local edits
// means the registry no longer matches any commit. --dry-run is exempt, and
// --allow-dirty is the explicit escape hatch.
if (!DRY && !ALLOW_DIRTY) {
  const status = execSync('git status --porcelain', {
    encoding: 'utf8',
  }).trim();
  if (status) {
    console.error(
      '\n✗ Refusing to publish: the git working tree is not clean.\n' +
        '  Commit or stash your changes first, or pass --allow-dirty to override.\n\n' +
        status +
        '\n',
    );
    process.exit(1);
  }
}

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
  // Provenance requires OIDC, which only exists in CI. Enabling it locally
  // would make `npm publish` fail, so it is opt-in via the CI environment.
  // When a publish workflow runs this on GitHub Actions (with
  // `permissions: id-token: write`), every package ships a signed provenance
  // attestation for free.
  const provenance = !DRY && process.env.GITHUB_ACTIONS === 'true';
  const cmd =
    `npm publish "${full}" --access public` +
    (DRY ? ' --dry-run' : '') +
    (provenance ? ' --provenance' : '');
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
