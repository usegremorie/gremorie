'use client';

import { ChartArtifact } from '@gremorie/rx-artifacts';
import { TrendingUpIcon } from 'lucide-react';

const data = [
  { channel: 'Organic', visitors: 4200 },
  { channel: 'Referral', visitors: 3100 },
  { channel: 'Social', visitors: 2400 },
  { channel: 'Email', visitors: 1800 },
  { channel: 'Paid', visitors: 1200 },
];

export function ChartArtifactPreview() {
  return (
    <ChartArtifact
      title="Visitors by channel"
      description="Last 30 days · toggle to inspect the table or download."
      icon={TrendingUpIcon}
      type="bar"
      data={data}
      categoryKey="channel"
      valueKey="visitors"
      categoryLabel="Channel"
      valueLabel="Visitors"
      fileName="visitors-by-channel"
    />
  );
}
