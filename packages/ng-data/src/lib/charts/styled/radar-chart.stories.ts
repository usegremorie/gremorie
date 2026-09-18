import type { Meta, StoryObj } from '@storybook/angular';
import { RadarChart } from './radar-chart';
import type { ChartConfig, ChartDatum } from '../headless/types';

// Values are set so no series dominates: each one leads on some spokes and
// trails on others, so the polygons cross instead of nesting. A radar whose
// series nest tells you nothing the same numbers in a table would not.
const DATA: ChartDatum[] = [
  { metric: 'Speed', sales: 82, profit: 61, forecast: 71 },
  { metric: 'Quality', sales: 66, profit: 88, forecast: 76 },
  { metric: 'Comfort', sales: 58, profit: 47, forecast: 80 },
  { metric: 'Safety', sales: 67, profit: 74, forecast: 53 },
  { metric: 'Price', sales: 57, profit: 41, forecast: 84 },
  { metric: 'Design', sales: 44, profit: 85, forecast: 65 },
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
          [max]="max"
          [ticks]="ticks"
          [radiusAxis]="radiusAxis"
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
    max: 100,
    ticks: 10,
    radiusAxis: false,
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
/**
 * The competency-review shape: a pinned 0-100 scale with a ring every ten, so
 * two people's charts are read against the same ruler. Without `domain` the
 * scale follows the data and a top score of 70 fills the plot exactly like a
 * top score of 100.
 */
export const ScoredScale: Story = {
  args: { max: 100, ticks: 10, radiusAxis: true, dots: true },
};
export const SingleSeries: Story = {
  args: { config: { sales: { label: 'Sales', color: 'var(--chart-1)' } } },
};

// Shared with the React `Workbench` story (rx-data) — keep byte-identical so the
// dual-framework workbench renders the same use case on both sides.
const WORKBENCH_DATA: ChartDatum[] = [
  { trait: 'Speed', you: 82, team: 74, fleet: 58 },
  { trait: 'Reliability', you: 66, team: 88, fleet: 71 },
  { trait: 'Comfort', you: 58, team: 68, fleet: 87 },
  { trait: 'Safety', you: 67, team: 61, fleet: 80 },
  { trait: 'Efficiency', you: 57, team: 81, fleet: 64 },
  { trait: 'Range', you: 44, team: 57, fleet: 76 },
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
          [max]="max"
          [ticks]="ticks"
          [radiusAxis]="radiusAxis"
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
