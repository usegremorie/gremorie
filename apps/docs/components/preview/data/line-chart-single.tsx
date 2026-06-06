'use client';

import {
  LineChart,
  type ChartConfig,
  type ChartDatum,
} from '@gremorie/rx-data';

const monthlyData: ChartDatum[] = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 173, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
];

const singleConfig: ChartConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
};

export function LineChartSinglePreview() {
  return <LineChart data={monthlyData} config={singleConfig} xKey="month" />;
}
