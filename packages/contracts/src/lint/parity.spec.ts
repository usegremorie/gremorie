import { describe, it, expect } from 'vitest';
import { resolve } from 'node:path';
import { checkParity } from './parity';
import { extractReactProps, extractAngularInputs } from './introspect';
import { chartArtifact } from '../index';

describe('checkParity (logic)', () => {
  it('passes when rx and ng expose the contract props (honouring adapts)', () => {
    const rx = chartArtifact.props.filter((p) => !p.adapts?.rx).map((p) => p.name);
    const ng = chartArtifact.props.filter((p) => !p.adapts?.ng).map((p) => p.name);
    expect(checkParity(chartArtifact, { rx, ng }).ok).toBe(true);
  });

  it('flags a prop missing on the ng side', () => {
    const rx = chartArtifact.props.filter((p) => !p.adapts?.rx).map((p) => p.name);
    const ng = chartArtifact.props
      .filter((p) => !p.adapts?.ng && p.name !== 'type')
      .map((p) => p.name);
    const res = checkParity(chartArtifact, { rx, ng });
    expect(res.ok).toBe(false);
    expect(res.missingInNg).toContain('type');
  });

  it('flags a code prop missing from the contract', () => {
    const rx = [...chartArtifact.props.filter((p) => !p.adapts?.rx).map((p) => p.name), 'mystery'];
    const ng = chartArtifact.props.filter((p) => !p.adapts?.ng).map((p) => p.name);
    const res = checkParity(chartArtifact, { rx, ng });
    expect(res.ok).toBe(false);
    expect(res.notInContract).toContain('mystery');
  });
});

describe('parity on the real chart-artifact (drift gate)', () => {
  const RX = resolve(
    process.cwd(),
    '../rx-artifacts/src/lib/chart-artifact/chart-artifact.tsx',
  );
  const NG = resolve(
    process.cwd(),
    '../ng-artifacts/src/lib/chart-artifact/chart-artifact.ts',
  );

  it('extracts the real props/inputs with core props present in both', () => {
    const rx = extractReactProps(RX, 'ChartArtifactProps');
    const ng = extractAngularInputs(NG, 'ChartArtifact');
    expect(rx.length).toBeGreaterThan(5);
    expect(ng.length).toBeGreaterThan(5);
    for (const core of ['title', 'data', 'type', 'categoryKey', 'valueKey']) {
      expect(rx).toContain(core);
      expect(ng).toContain(core);
    }
    const res = checkParity(chartArtifact, { rx, ng });
    if (!res.ok) console.warn('chart-artifact parity diff:', JSON.stringify(res));
    expect(res.ok).toBe(true);
  });
});
