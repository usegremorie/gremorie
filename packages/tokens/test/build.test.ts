import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildOutputs } from '../pipeline/build.ts';
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

  it('marks theme.css as generated and imports every named theme', () => {
    const css = outputs['styles/theme.css'] ?? '';
    expect(css).toContain('GENERATED FILE');
    expect(css).toContain("@import './themes/claude.css';");
    expect(css).not.toMatch(/[\u2013\u2014]/);
  });
});
