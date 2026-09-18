import type { Meta, StoryObj } from '@storybook/angular';
import { RadarChart } from './radar-chart';
import type { ChartConfig, ChartDatum } from '../headless/types';

// Values are set so no series dominates: each one leads on some spokes and
// trails on others, so the polygons cross instead of nesting. A radar whose
// series nest tells you nothing the same numbers in a table would not.
const DATA: ChartDatum[] = [
  { metric: 'Speed', sales: 120, profit: 90, forecast: 104 },
  { metric: 'Quality', sales: 98, profit: 130, forecast: 112 },
  { metric: 'Comfort', sales: 86, profit: 70, forecast: 118 },
  { metric: 'Safety', sales: 99, profit: 110, forecast: 78 },
  { metric: 'Price', sales: 85, profit: 60, forecast: 124 },
  { metric: 'Design', sales: 65, profit: 125, forecast: 96 },
];

// Categorical slots in fixed order — chart-1, then 2, then 3. Never cycled and
// never reordered: a series keeps its hue when the set changes, so the reader's
// colour memory survives a filter.
const CONFIG: ChartConfig = {
  sales: { label: 'Sales', color: 'var(--chart-1)' },
  profit: { label: 'Profit', color: 'var(--chart-2)' },
  forecast: { label: 'Forecast', color: 'var(--chart-3)' },
};

const meta: Meta<RadarChart> = {
  title: 'Layout & display/Data/Radar Chart',
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
          [fill]="fill"
          [dots]="dots"
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
    fill: 'auto',
    dots: false,
    tooltip: true,
  },
};

export default meta;
type Story = StoryObj<RadarChart>;

export const Default: Story = {};
export const CircleGrid: Story = { args: { gridType: 'circle' } };
/** Three series with the fill forced on — lightened to 0.2 so the stack reads. */
export const Filled: Story = { args: { fill: 'on' } };
/** A dot on every vertex; the hovered spoke's grows. */
export const Dots: Story = { args: { dots: true } };
export const SingleSeries: Story = {
  args: { config: { sales: { label: 'Sales', color: 'var(--chart-1)' } } },
};

// Shared with the React `Workbench` story (rx-data) — keep byte-identical so the
// dual-framework workbench renders the same use case on both sides.
const WORKBENCH_DATA: ChartDatum[] = [
  { trait: 'Speed', you: 120, team: 110, fleet: 86 },
  { trait: 'Reliability', you: 98, team: 130, fleet: 105 },
  { trait: 'Comfort', you: 86, team: 100, fleet: 128 },
  { trait: 'Safety', you: 99, team: 90, fleet: 118 },
  { trait: 'Efficiency', you: 85, team: 120, fleet: 95 },
  { trait: 'Range', you: 65, team: 85, fleet: 112 },
];

const WORKBENCH_CONFIG: ChartConfig = {
  you: { label: 'You', color: 'var(--chart-1)' },
  team: { label: 'Team', color: 'var(--chart-2)' },
  fleet: { label: 'Fleet', color: 'var(--chart-3)' },
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
          [fill]="fill"
          [dots]="dots"
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
