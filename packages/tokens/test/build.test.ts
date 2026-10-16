import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildOutputs, findDrift } from '../pipeline/build.ts';
import { PACKAGE_ROOT } from './support/paths.ts';

const outputs = await buildOutputs(PACKAGE_ROOT);
const styles = Object.keys(outputs).filter((rel) => rel.startsWith('styles/'));

describe('committed CSS is what the build produces', () => {
  it('emits theme.css and one file per named theme', () => {
    expect(styles).toContain('styles/theme.css');
    expect(styles.length).toBeGreaterThanOrEqual(6);
  });

  it.each(styles)('%s is up to date (run nx build tokens)', (rel) => {
    expect(readFileSync(join(PACKAGE_ROOT, rel), 'utf8')).toBe(outputs[rel]);
  });

  it('has no stale or orphan file under styles/', () => {
    expect(findDrift(PACKAGE_ROOT, outputs)).toEqual([]);
  });

  it('marks theme.css as generated and imports every named theme', () => {
    const css = outputs['styles/theme.css'] ?? '';
    expect(css).toContain('GENERATED FILE');
    expect(css).toContain("@import './themes/claude.css';");
    expect(css).not.toMatch(/[\u2013\u2014]/);
  });
});

describe('findDrift', () => {
  it('reports stale, missing and orphan theme files', () => {
    const root = mkdtempSync(join(tmpdir(), 'gremorie-drift-'));
    mkdirSync(join(root, 'styles', 'themes'), { recursive: true });
    writeFileSync(join(root, 'styles', 'theme.css'), 'old');
    writeFileSync(join(root, 'styles', 'themes', 'ghost.css'), 'x');
    writeFileSync(join(root, 'styles', 'themes', 'notes.txt'), 'x');
    expect(
      findDrift(root, {
        'styles/theme.css': 'new',
        'styles/themes/claude.css': 'a',
      }),
    ).toEqual([
      'styles/theme.css',
      'styles/themes/claude.css',
      'styles/themes/ghost.css',
    ]);
  });
});

describe('published files', () => {
  it('ships the generated CSS but not the partials', () => {
    const pkg = JSON.parse(
      readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf8'),
    ) as { files: string[] };
    expect(pkg.files).toEqual(
      expect.arrayContaining(['styles/theme.css', 'styles/themes']),
    );
    expect(pkg.files).not.toContain('styles');
  });
});
