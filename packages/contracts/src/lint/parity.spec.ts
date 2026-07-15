import { describe, it, expect } from 'vitest';
import { resolve } from 'node:path';
import { checkParity } from './parity';
import { extractReactProps, extractAngularInputs } from './introspect';
import { chartArtifact, CONTRACTS } from '../index';

describe('checkParity (logic)', () => {
  it('passes when rx and ng expose the contract props (honouring adapts)', () => {
    const rx = chartArtifact.props
      .filter((p) => !p.adapts?.rx)
      .map((p) => p.name);
    const ng = chartArtifact.props
      .filter((p) => !p.adapts?.ng)
      .map((p) => p.name);
    expect(checkParity(chartArtifact, { rx, ng }).ok).toBe(true);
  });

  it('flags a prop missing on the ng side', () => {
    const rx = chartArtifact.props
      .filter((p) => !p.adapts?.rx)
      .map((p) => p.name);
    const ng = chartArtifact.props
      .filter((p) => !p.adapts?.ng && p.name !== 'type')
      .map((p) => p.name);
    const res = checkParity(chartArtifact, { rx, ng });
    expect(res.ok).toBe(false);
    expect(res.missingInNg).toContain('type');
  });

  it('flags a code prop missing from the contract', () => {
    const rx = [
      ...chartArtifact.props.filter((p) => !p.adapts?.rx).map((p) => p.name),
      'mystery',
    ];
    const ng = chartArtifact.props
      .filter((p) => !p.adapts?.ng)
      .map((p) => p.name);
    const res = checkParity(chartArtifact, { rx, ng });
    expect(res.ok).toBe(false);
    expect(res.notInContract).toContain('mystery');
  });
});

/** Maps each contract to its real React props interface + Angular component class. */
const SOURCE_MAP: Record<
  string,
  { rx: { file: string; sym: string }; ng: { file: string; sym: string } }
> = {
  'chart-artifact': {
    rx: {
      file: '../rx-artifacts/src/lib/chart-artifact/chart-artifact.tsx',
      sym: 'ChartArtifactProps',
    },
    ng: {
      file: '../ng-artifacts/src/lib/chart-artifact/chart-artifact.ts',
      sym: 'ChartArtifact',
    },
  },
  'area-chart': {
    rx: {
      file: '../rx-data/src/lib/area-chart/area-chart.tsx',
      sym: 'AreaChartProps',
    },
    ng: {
      file: '../ng-data/src/lib/charts/styled/area-chart.ts',
      sym: 'AreaChart',
    },
  },
  'bar-chart': {
    rx: {
      file: '../rx-data/src/lib/bar-chart/bar-chart.tsx',
      sym: 'BarChartProps',
    },
    ng: {
      file: '../ng-data/src/lib/charts/styled/bar-chart.ts',
      sym: 'BarChart',
    },
  },
  'line-chart': {
    rx: {
      file: '../rx-data/src/lib/line-chart/line-chart.tsx',
      sym: 'LineChartProps',
    },
    ng: {
      file: '../ng-data/src/lib/charts/styled/line-chart.ts',
      sym: 'LineChart',
    },
  },
  'scatter-chart': {
    rx: {
      file: '../rx-data/src/lib/scatter-chart/scatter-chart.tsx',
      sym: 'ScatterChartProps',
    },
    ng: {
      file: '../ng-data/src/lib/charts/styled/scatter-chart.ts',
      sym: 'ScatterChart',
    },
  },
  'pie-chart': {
    rx: {
      file: '../rx-data/src/lib/pie-chart/pie-chart.tsx',
      sym: 'PieChartProps',
    },
    ng: {
      file: '../ng-data/src/lib/charts/styled/pie-chart.ts',
      sym: 'PieChart',
    },
  },
  'radar-chart': {
    rx: {
      file: '../rx-data/src/lib/radar-chart/radar-chart.tsx',
      sym: 'RadarChartProps',
    },
    ng: {
      file: '../ng-data/src/lib/charts/styled/radar-chart.ts',
      sym: 'RadarChart',
    },
  },
  'radial-chart': {
    rx: {
      file: '../rx-data/src/lib/radial-chart/radial-chart.tsx',
      sym: 'RadialChartProps',
    },
    ng: {
      file: '../ng-data/src/lib/charts/styled/radial-chart.ts',
      sym: 'RadialChart',
    },
  },
};

describe('parity on real sources (drift gate)', () => {
  for (const contract of CONTRACTS) {
    const src = SOURCE_MAP[contract.name];
    if (!src) continue;
    it(`${contract.name}: rx props == ng inputs == contract`, () => {
      const rx = extractReactProps(
        resolve(process.cwd(), src.rx.file),
        src.rx.sym,
      );
      const ng = extractAngularInputs(
        resolve(process.cwd(), src.ng.file),
        src.ng.sym,
      );
      const res = checkParity(contract, { rx, ng });
      if (!res.ok)
        console.warn(`${contract.name} parity diff:`, JSON.stringify(res));
      expect(res.ok).toBe(true);
    });
  }
});
