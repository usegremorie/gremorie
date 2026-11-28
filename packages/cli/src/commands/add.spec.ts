import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Runner } from '../lib/dependencies.js';
import type { RegistryClient, RegistryItem } from '../registry.js';
import { addCommand } from './add.js';

const item: RegistryItem = {
  name: 'rx-color-picker',
  type: 'registry:block',
  framework: 'rx',
  dependencies: ['culori', 'react'],
  devDependencies: ['@types/culori'],
  registryDependencies: [],
  files: [
    {
      path: 'src/lib/color-picker/color-picker.tsx',
      target: 'src/components/color-picker.tsx',
      type: 'registry:component',
      content: "import { cn } from '@gremorie/rx-core';\n",
    },
  ],
} as unknown as RegistryItem;

const client: RegistryClient = {
  baseUrl: 'memory://registry',
  fetchIndex: () => Promise.reject(new Error('unused')),
  fetchItem: () => Promise.resolve(item),
};

describe('gremorie add: dependencies', () => {
  let cwd: string;
  let calls: string[];
  const ok: Runner = (command, args) => {
    calls.push(`${command} ${args.join(' ')}`);
    return { ok: true };
  };

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), 'gremorie-add-'));
    writeFileSync(join(cwd, 'pnpm-lock.yaml'), '');
    writeFileSync(
      join(cwd, 'package.json'),
      JSON.stringify({ dependencies: { react: '^19.0.0' } }),
    );
    calls = [];
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    process.exitCode = undefined;
  });
  afterEach(() => {
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  const target = () => join(cwd, 'src/components/color-picker.tsx');

  it('installs only what the project lacks, dev dependencies apart', async () => {
    await addCommand(['rx-color-picker'], { cwd, client, runner: ok });
    expect(calls).toEqual([
      'pnpm add -- @gremorie/rx-core culori',
      'pnpm add -D -- @types/culori',
    ]);
    expect(existsSync(target())).toBe(true);
  });

  it('installs nothing when every dependency is declared', async () => {
    writeFileSync(
      join(cwd, 'package.json'),
      JSON.stringify({
        dependencies: {
          react: '^19',
          culori: '^4',
          '@gremorie/rx-core': '^0.11',
        },
        devDependencies: { '@types/culori': '^4' },
      }),
    );
    await addCommand(['rx-color-picker'], { cwd, client, runner: ok });
    expect(calls).toEqual([]);
  });

  it('--no-install writes the files and runs nothing', async () => {
    await addCommand(['rx-color-picker'], {
      cwd,
      client,
      runner: ok,
      install: false,
    });
    expect(calls).toEqual([]);
    expect(existsSync(target())).toBe(true);
  });

  it('--dry-run neither writes nor installs', async () => {
    await addCommand(['rx-color-picker'], {
      cwd,
      client,
      runner: ok,
      dryRun: true,
    });
    expect(calls).toEqual([]);
    expect(existsSync(target())).toBe(false);
  });

  it('a failed install keeps the files, prints the manual command and exits 1', async () => {
    const log = vi.mocked(console.log);
    await addCommand(['rx-color-picker'], {
      cwd,
      client,
      runner: () => ({ ok: false }),
    });
    expect(readFileSync(target(), 'utf-8')).toContain('@gremorie/rx-core');
    expect(process.exitCode).toBe(1);
    const printed = log.mock.calls.flat().join('\n');
    expect(printed).toContain('pnpm add @gremorie/rx-core culori');
    expect(printed).toContain('pnpm add -D @types/culori');
  });
});
