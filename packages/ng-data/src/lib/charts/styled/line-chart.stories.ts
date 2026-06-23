import type { Meta, StoryObj } from '@storybook/angular';
import { LineChart } from './line-chart';
import type { ChartConfig, ChartDatum } from '../headless/types';

const DATA: ChartDatum[] = [
  { month: 'Jan', sales: 186, profit: 80 },
  { month: 'Feb', sales: 305, profit: 200 },
  { month: 'Mar', sales: 237, profit: 120 },
  { month: 'Apr', sales: 173, profit: 90 },
  { month: 'May', sales: 209, profit: 130 },
  { month: 'Jun', sales: 264, profit: 140 },
];

const CONFIG: ChartConfig = {
  sales: { label: 'Sales', color: 'var(--chart-1)' },
  profit: { label: 'Profit', color: 'var(--chart-2)' },
};

const meta: Meta<LineChart> = {
  title: 'Charts/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 640px;">
        <line-chart
          [data]="data"
          [config]="config"
          [xKey]="xKey"
          [type]="type"
          [dots]="dots"
          [yAxis]="yAxis"
          [tooltip]="tooltip"
        />
      </div>
    `,
  }),
  args: {
    data: DATA,
    config: CONFIG,
    xKey: 'month',
    type: 'natural',
    dots: false,
    yAxis: true,
    tooltip: true,
  },
};

export default meta;
type Story = StoryObj<LineChart>;

export const Default: Story = {};
export const SingleSeries: Story = {
  args: { config: { sales: { label: 'Sales', color: 'var(--chart-1)' } } },
};
export const WithDots: Story = { args: { dots: true } };
export const Linear: Story = { args: { type: 'linear' } };
export const Step: Story = { args: { type: 'step' } };
export const NoAxis: Story = { args: { yAxis: false } };

// Shared with the React `Workbench` story (rx-data) — keep byte-identical so the
// dual-framework workbench renders the same use case on both sides.
const WORKBENCH_DATA: ChartDatum[] = [
  { month: 'Jan', sales: 186, profit: 80 },
  { month: 'Feb', sales: 305, profit: 200 },
  { month: 'Mar', sales: 237, profit: 120 },
  { month: 'Apr', sales: 173, profit: 90 },
  { month: 'May', sales: 209, profit: 130 },
  { month: 'Jun', sales: 264, profit: 140 },
];

const WORKBENCH_CONFIG: ChartConfig = {
  sales: { label: 'Sales', color: 'var(--chart-1)' },
  profit: { label: 'Profit', color: 'var(--chart-2)' },
};

/**
 * Workbench preset: monthly sales vs. profit, top-aligned at a fixed 28rem width
 * so the dual-framework workbench renders the IDENTICAL use case as the React
 * `Workbench` story. Keep both in sync.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 28rem; max-width: 100%;">
        <line-chart
          [data]="data"
          [config]="config"
          [xKey]="xKey"
          [type]="type"
          [dots]="dots"
          [yAxis]="yAxis"
          [tooltip]="tooltip"
        />
      </div>
    `,
  }),
  args: {
    data: WORKBENCH_DATA,
    config: WORKBENCH_CONFIG,
    xKey: 'month',
    type: 'natural',
    dots: false,
    yAxis: true,
    tooltip: true,
  },
};
