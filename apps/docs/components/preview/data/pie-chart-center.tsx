'use client';

import { PieChart } from '@gremorie/rx-data';

// Four categories on the categorical chart palette, with the total in the hole.
const DATA = [
  { category: 'Housing', amount: 1450, fill: 'var(--chart-cat-1)' },
  { category: 'Groceries', amount: 620, fill: 'var(--chart-cat-2)' },
  { category: 'Transport', amount: 380, fill: 'var(--chart-cat-3)' },
  { category: 'Leisure', amount: 790, fill: 'var(--chart-cat-4)' },
];

export function PieChartCenterPreview() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <PieChart
        centerLabel="81% of $4,000 budget"
        centerValue="$3,240"
        config={{ amount: { label: 'Spent' } }}
        data={DATA}
        dataKey="amount"
        donut
        nameKey="category"
      />
    </div>
  );
}
