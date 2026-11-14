import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { probeKind, probeScript, probeTargets } from '../pipeline/dom-probe.ts';
import { REFERENCE_DIR } from './support/paths.ts';

describe('dom probe', () => {
  it.each([
    ['--radius-sm', 'length'],
    ['--spacing', 'length'],
    ['--font-sans', 'font'],
    ['--shadow', 'shadow'],
    ['--shadow-2xl', 'shadow'],
    ['--tracking-normal', 'letter-spacing'],
    ['--primary', 'color'],
    ['--color-gray-50', 'color'],
  ])('%s is probed as %s', (name, kind) => {
    expect(probeKind(name)).toBe(kind);
  });

  it('targets every token of the reference except the Tailwind wiring', () => {
    const targets = probeTargets([
      readFileSync(join(REFERENCE_DIR, 'theme.css'), 'utf8'),
    ]);
    const names = targets.map((t) => t.name);
    expect(names).toContain('--color-gray-0');
    expect(names).toContain('--sidebar-ring');
    expect(names).toContain('--shadow-md');
    expect(names).not.toContain('--color-background'); // @theme inline
    expect(new Set(names).size).toBe(names.length);
  });

  it('emits a script that compiles as a single expression', () => {
    const script = probeScript(
      [{ name: '--primary', kind: 'color' }],
      ['default', 'claude'],
    );
    expect(() => new Function(`return ${script}`)).not.toThrow();
    expect(script).toContain('"--primary"');
  });
});
