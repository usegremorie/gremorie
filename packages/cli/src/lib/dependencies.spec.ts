import { describe, expect, it } from 'vitest';

import {
  installSteps,
  missingDependencies,
  runInstall,
  type Runner,
} from './dependencies.js';

describe('missingDependencies', () => {
  const pkg = {
    dependencies: { react: '^19.0.0' },
    devDependencies: { typescript: '^5.0.0' },
    peerDependencies: { '@angular/core': '^21.0.0' },
  };

  it('skips bare names already declared in any block', () => {
    expect(
      missingDependencies(
        ['react', 'typescript', '@angular/core', 'culori'],
        pkg,
      ),
    ).toEqual(['culori']);
  });

  it('keeps an explicit version even when the package is declared', () => {
    expect(missingDependencies(['react@19.2.0'], pkg)).toEqual([
      'react@19.2.0',
    ]);
  });

  it('dedupes by name and prefers the explicit version', () => {
    expect(
      missingDependencies(['culori', 'culori@4.0.2', 'culori'], {}),
    ).toEqual(['culori@4.0.2']);
  });

  it('handles scoped names with and without a version', () => {
    expect(
      missingDependencies(['@gremorie/color', '@gremorie/color@0.12.0'], {}),
    ).toEqual(['@gremorie/color@0.12.0']);
  });

  it('works without a package.json', () => {
    expect(missingDependencies(['culori'], null)).toEqual(['culori']);
  });

  it('rejects a name that would be read as a flag', () => {
    expect(() => missingDependencies(['--registry=evil'], {})).toThrow(
      /cannot start with "-"/,
    );
  });
});

describe('installSteps', () => {
  it.each([
    ['npm', ['install', '--no-audit', '--no-fund', '--', 'a']],
    ['pnpm', ['add', '--', 'a']],
    ['yarn', ['add', '--', 'a']],
    ['bun', ['add', '--', 'a']],
  ] as const)('%s: dependencies', (pm, args) => {
    expect(installSteps(pm, ['a'], [])).toMatchObject([{ command: pm, args }]);
  });

  it.each([
    ['npm', ['install', '--no-audit', '--no-fund', '-D', '--', 'b']],
    ['pnpm', ['add', '-D', '--', 'b']],
    ['yarn', ['add', '-D', '--', 'b']],
    ['bun', ['add', '-d', '--', 'b']],
  ] as const)('%s: dev dependencies in their own step', (pm, args) => {
    expect(installSteps(pm, ['a'], ['b'])[1]).toMatchObject({
      command: pm,
      args,
    });
  });

  it('has no step when nothing is missing', () => {
    expect(installSteps('npm', [], [])).toEqual([]);
  });
});

describe('runInstall', () => {
  const steps = installSteps('pnpm', ['a'], ['b']);

  it('runs every step in the project folder', () => {
    const calls: string[] = [];
    const run: Runner = (command, args, cwd) => {
      calls.push(`${cwd}: ${command} ${args.join(' ')}`);
      return { ok: true };
    };
    expect(runInstall(steps, '/app', run)).toEqual({ ok: true });
    expect(calls).toEqual(['/app: pnpm add -- a', '/app: pnpm add -D -- b']);
  });

  it('passes on why the package manager did not start', () => {
    const run: Runner = () => ({ ok: false, error: 'spawnSync bun ENOENT' });
    expect(runInstall(steps, '/app', run)).toMatchObject({
      ok: false,
      error: 'spawnSync bun ENOENT',
    });
  });

  it('stops at the first failure and returns the commands still to run', () => {
    const run: Runner = () => ({ ok: false });
    expect(runInstall(steps, '/app', run)).toEqual({
      ok: false,
      manual: ['pnpm add a', 'pnpm add -D b'],
    });
  });
});
