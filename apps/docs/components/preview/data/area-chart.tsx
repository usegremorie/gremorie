'use client';

import {
  AreaChart,
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

const monthlyConfig: ChartConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' },
};

export function AreaChartPreview() {
  return (
    <AreaChart data={monthlyData} config={monthlyConfig} xKey="month" stacked />
  );
}
