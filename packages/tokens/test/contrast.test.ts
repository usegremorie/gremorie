import { describe, expect, it } from 'vitest';
import {
  checkContrast,
  loadDeviations,
  matches,
} from '../pipeline/contrast.ts';
import { runAll } from '../pipeline/run.ts';
import { loadSource } from '../pipeline/source.ts';
import { PACKAGE_ROOT } from './support/paths.ts';

const runs = await runAll(loadSource(PACKAGE_ROOT));
const results = [...runs.values()].flatMap(checkContrast);
const failing = results.filter((r) => r.ratio < r.min);
const deviations = loadDeviations(PACKAGE_ROOT).filter(
  (d) => d.scheme === undefined,
);
const label = (r: {
  theme: string;
  mode: string;
  background: string;
  foreground: string;
}) => `${r.theme}/${r.mode} ${r.foreground} on ${r.background}`;

describe('contrast, WCAG 2.2 AA', () => {
  it('checks every pair in every theme and mode', () => {
    expect(results.length).toBe(runs.size * 16);
  });

  it('lists every failing pair as a deviation, at its measured ratio', () => {
    for (const f of failing) {
      const d = deviations.find((x) => matches(x, f));
      expect(d, `${label(f)} is ${f.ratio}:1, under ${f.min}:1`).toBeDefined();
      expect(Math.abs((d?.ratio ?? 0) - f.ratio), label(f)).toBeLessThanOrEqual(
        0.02,
      );
    }
  });

  it('keeps no stale deviation', () => {
    for (const d of deviations) {
      expect(
        failing.some((f) => matches(d, f)),
        `${label(d)} passes now`,
      ).toBe(true);
    }
  });

  it('gives every deviation a reason', () => {
    for (const d of deviations) {
      expect(d.reason.length, label(d)).toBeGreaterThan(20);
    }
  });

  it('has no deviation in the purple theme', () => {
    expect(failing.filter((f) => f.theme === 'purple').map(label)).toEqual([]);
    expect(deviations.filter((d) => d.theme === 'purple')).toEqual([]);
  });
});
