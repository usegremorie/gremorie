'use client';

import {
  RadarChart,
  type ChartConfig,
  type ChartDatum,
} from '@gremorie/rx-data';

// A competency review: every value is a 0-100 score, and the same nine
// dimensions are rated by three different sources.
const reviewData: ChartDatum[] = [
  { skill: 'Discovery', self: 82, manager: 74, peers: 68 },
  { skill: 'Prototyping', self: 74, manager: 66, peers: 71 },
  { skill: 'Visual craft', self: 66, manager: 79, peers: 83 },
  { skill: 'Product knowledge', self: 58, manager: 62, peers: 55 },
  { skill: 'Problem framing', self: 77, manager: 58, peers: 64 },
  { skill: 'Communication', self: 85, manager: 81, peers: 88 },
  { skill: 'Collaboration', self: 69, manager: 84, peers: 79 },
  { skill: 'Autonomy', self: 61, manager: 70, peers: 58 },
  { skill: 'Delivery', self: 73, manager: 67, peers: 76 },
];

const reviewConfig: ChartConfig = {
  self: { label: 'Self', color: 'var(--chart-1)' },
  manager: { label: 'Manager', color: 'var(--chart-2)' },
  peers: { label: 'Peers', color: 'var(--chart-3)' },
};

export function RadarChartScoredPreview() {
  return (
    <RadarChart
      data={reviewData}
      config={reviewConfig}
      xKey="skill"
      // Pinned, not derived: every review has to be read against the same
      // ruler, or someone whose best score is 70 looks identical to someone
      // who scored 100.
      max={100}
      ticks={10}
      radiusAxis
      // Nine spokes with two-word labels; without a width the longest is drawn
      // as one run and reaches back across the plot.
      labelWidth={90}
      dots
    />
  );
}
