'use client';

import {
  RadarChart,
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

export function RadarChartPreview() {
  // These counts run to 305, past the 100 the scale is pinned at by default.
  // `auto` is the right answer for a range like this one, which has no natural
  // ceiling — a hardcoded top would need revisiting every time the data moves.
  return (
    <RadarChart
      data={monthlyData}
      config={monthlyConfig}
      xKey="month"
      max="auto"
    />
  );
}
