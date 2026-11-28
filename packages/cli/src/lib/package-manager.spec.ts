import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { detectPackageManager } from './package-manager.js';

describe('detectPackageManager', () => {
  let dir: string;
  const agent = process.env.npm_config_user_agent;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'gremorie-pm-'));
    delete process.env.npm_config_user_agent;
  });
  afterEach(() => {
    if (agent === undefined) delete process.env.npm_config_user_agent;
    else process.env.npm_config_user_agent = agent;
  });

  it.each([
    ['pnpm-lock.yaml', 'pnpm'],
    ['yarn.lock', 'yarn'],
    ['bun.lock', 'bun'],
    ['bun.lockb', 'bun'],
    ['package-lock.json', 'npm'],
  ])('reads %s as %s', (lockfile, pm) => {
    writeFileSync(join(dir, lockfile), '');
    expect(detectPackageManager(dir)).toBe(pm);
  });

  it('prefers the packageManager field of package.json', () => {
    writeFileSync(join(dir, 'package-lock.json'), '');
    writeFileSync(
      join(dir, 'package.json'),
      JSON.stringify({ packageManager: 'pnpm@9.1.0' }),
    );
    expect(detectPackageManager(dir)).toBe('pnpm');
  });

  it('walks up to the workspace root, as in a monorepo app', () => {
    writeFileSync(join(dir, 'yarn.lock'), '');
    const app = join(dir, 'apps', 'web');
    mkdirSync(app, { recursive: true });
    writeFileSync(join(app, 'package.json'), '{}');
    expect(detectPackageManager(app)).toBe('yarn');
  });

  it('falls back to the user agent, then to npm', () => {
    process.env.npm_config_user_agent = 'bun/1.2.0 npm/? node/v22';
    expect(detectPackageManager(dir)).toBe('bun');
    delete process.env.npm_config_user_agent;
    expect(detectPackageManager(dir)).toBe('npm');
  });
});
