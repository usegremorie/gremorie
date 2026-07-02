import type { Meta, StoryObj } from '@storybook/angular';
import { RadarChart } from './radar-chart';
import type { ChartConfig, ChartDatum } from '../headless/types';

const DATA: ChartDatum[] = [
  { metric: 'Speed', sales: 120, profit: 90 },
  { metric: 'Quality', sales: 98, profit: 130 },
  { metric: 'Comfort', sales: 86, profit: 70 },
  { metric: 'Safety', sales: 99, profit: 110 },
  { metric: 'Price', sales: 85, profit: 60 },
  { metric: 'Design', sales: 65, profit: 125 },
];

const CONFIG: ChartConfig = {
  sales: { label: 'Sales', color: 'var(--chart-1)' },
  profit: { label: 'Profit', color: 'var(--chart-2)' },
};

const meta: Meta<RadarChart> = {
  title: 'Charts/RadarChart',
  component: RadarChart,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 360px;">
        <radar-chart
          [data]="data"
          [config]="config"
          [xKey]="xKey"
          [gridType]="gridType"
          [tooltip]="tooltip"
        />
      </div>
    `,
  }),
  args: {
    data: DATA,
    config: CONFIG,
    xKey: 'metric',
    gridType: 'polygon',
    tooltip: true,
  },
};

export default meta;
type Story = StoryObj<RadarChart>;

export const Default: Story = {};
export const CircleGrid: Story = { args: { gridType: 'circle' } };
export const SingleSeries: Story = {
  args: { config: { sales: { label: 'Sales', color: 'var(--chart-1)' } } },
};

// Shared with the React `Workbench` story (rx-data) — keep byte-identical so the
// dual-framework workbench renders the same use case on both sides.
const WORKBENCH_DATA: ChartDatum[] = [
  { trait: 'Speed', you: 120, team: 110 },
  { trait: 'Reliability', you: 98, team: 130 },
  { trait: 'Comfort', you: 86, team: 100 },
  { trait: 'Safety', you: 99, team: 90 },
  { trait: 'Efficiency', you: 85, team: 120 },
  { trait: 'Range', you: 65, team: 85 },
];

const WORKBENCH_CONFIG: ChartConfig = {
  you: { label: 'You', color: 'var(--chart-1)' },
  team: { label: 'Team', color: 'var(--chart-2)' },
};

/**
 * Workbench preset: skill traits you vs. team across shared spokes, top-aligned
 * at a fixed 28rem width so the dual-framework workbench renders the IDENTICAL
 * use case as the React `Workbench` story. Keep both in sync.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 100%;">
        <radar-chart
          [data]="data"
          [config]="config"
          [xKey]="xKey"
          [gridType]="gridType"
          [tooltip]="tooltip"
        />
      </div>
    `,
  }),
  args: {
    data: WORKBENCH_DATA,
    config: WORKBENCH_CONFIG,
    xKey: 'trait',
    gridType: 'polygon',
    tooltip: true,
  },
};
