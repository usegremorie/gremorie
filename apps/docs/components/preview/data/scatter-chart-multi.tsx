'use client';

import {
  ScatterChart,
  type ChartConfig,
  type ChartDatum,
} from '@gremorie/rx-data';

const scatterMultiData: ChartDatum[] = [
  { weight: 60, height: 165, target: 170 },
  { weight: 72, height: 178, target: 176 },
  { weight: 55, height: 160, target: 168 },
  { weight: 90, height: 185, target: 184 },
  { weight: 68, height: 172, target: 174 },
  { weight: 80, height: 180, target: 181 },
];

const scatterMultiConfig: ChartConfig = {
  height: { label: 'Height (cm)', color: 'var(--chart-1)' },
  target: { label: 'Target (cm)', color: 'var(--chart-2)' },
};

export function ScatterChartMultiPreview() {
  return (
    <ScatterChart
      data={scatterMultiData}
      config={scatterMultiConfig}
      xKey="weight"
    />
  );
}
