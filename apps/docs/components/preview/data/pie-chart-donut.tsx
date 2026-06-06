'use client';

import { PieChart, type ChartConfig, type ChartDatum } from '@gremorie/rx-data';

// Categorical (pie / radial): one chart token per row via `fill`.
const browserData: ChartDatum[] = [
  { browser: 'Chrome', visitors: 275, fill: 'var(--chart-1)' },
  { browser: 'Safari', visitors: 200, fill: 'var(--chart-2)' },
  { browser: 'Firefox', visitors: 187, fill: 'var(--chart-3)' },
  { browser: 'Edge', visitors: 173, fill: 'var(--chart-4)' },
  { browser: 'Other', visitors: 90, fill: 'var(--chart-5)' },
];

const browserConfig: ChartConfig = {
  visitors: { label: 'Visitors' },
  Chrome: { label: 'Chrome' },
  Safari: { label: 'Safari' },
  Firefox: { label: 'Firefox' },
  Edge: { label: 'Edge' },
  Other: { label: 'Other' },
};

export function PieChartDonutPreview() {
  return (
    <PieChart
      data={browserData}
      config={browserConfig}
      nameKey="browser"
      dataKey="visitors"
      donut
    />
  );
}
