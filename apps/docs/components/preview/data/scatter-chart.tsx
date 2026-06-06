'use client';

import {
  ScatterChart,
  type ChartConfig,
  type ChartDatum,
} from '@gremorie/rx-data';

const scatterData: ChartDatum[] = [
  { weight: 60, height: 165 },
  { weight: 72, height: 178 },
  { weight: 55, height: 160 },
  { weight: 90, height: 185 },
  { weight: 68, height: 172 },
  { weight: 80, height: 180 },
];

const scatterConfig: ChartConfig = {
  height: { label: 'Height (cm)', color: 'var(--chart-1)' },
};

export function ScatterChartPreview() {
  return (
    <ScatterChart data={scatterData} config={scatterConfig} xKey="weight" />
  );
}
