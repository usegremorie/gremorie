import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { detectDtcgProject, detectRegistryProject } from './detect.js';

describe('detectRegistryProject', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tokens-detect-'));

  it('returns null when not a registry-compatible project', () => {
    mkdirSync(dir, { recursive: true });
    expect(detectRegistryProject(dir)).toBeNull();
    rmSync(dir, { recursive: true, force: true });
  });

  it('detects by components.json and finds globals.css', () => {
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, 'components.json'),
      JSON.stringify({
        tailwind: { css: 'src/styles/globals.css' },
      }),
    );
    mkdirSync(join(dir, 'src/styles'), { recursive: true });
    writeFileSync(join(dir, 'src/styles/globals.css'), ':root {}');

    const result = detectRegistryProject(dir);
    expect(result).not.toBeNull();
    expect(result?.globalsCss).toBe('src/styles/globals.css');
    rmSync(dir, { recursive: true, force: true });
  });
});

describe('detectDtcgProject', () => {
  it('finds the Gremorie monorepo by its token source and pipeline', () => {
    const dir = mkdtempSync(join(tmpdir(), 'tokens-detect-dtcg-'));
    mkdirSync(join(dir, 'packages/tokens/tokens/primitive'), {
      recursive: true,
    });
    mkdirSync(join(dir, 'packages/tokens/pipeline'), { recursive: true });
    expect(detectDtcgProject(dir)).toBeNull();
    writeFileSync(
      join(dir, 'packages/tokens/tokens/primitive/color.json'),
      '{}',
    );
    writeFileSync(join(dir, 'packages/tokens/pipeline/build.ts'), '');
    expect(detectDtcgProject(dir)).toEqual({
      root: dir,
      packageDir: join(dir, 'packages/tokens'),
      tokensDir: join(dir, 'packages/tokens/tokens'),
    });
    rmSync(dir, { recursive: true, force: true });
  });
});
