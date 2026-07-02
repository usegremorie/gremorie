import type { Meta, StoryObj } from '@storybook/angular';
import { ScatterChart } from './scatter-chart';
import type { ChartConfig, ChartDatum } from '../headless/types';

const DATA: ChartDatum[] = [
  { x: 12, weight: 40, height: 60 },
  { x: 25, weight: 95, height: 110 },
  { x: 38, weight: 60, height: 75 },
  { x: 47, weight: 130, height: 95 },
  { x: 58, weight: 85, height: 140 },
  { x: 70, weight: 160, height: 120 },
  { x: 82, weight: 110, height: 165 },
];

const CONFIG: ChartConfig = {
  weight: { label: 'Weight', color: 'var(--chart-1)' },
};

const TWO: ChartConfig = {
  weight: { label: 'Weight', color: 'var(--chart-1)' },
  height: { label: 'Height', color: 'var(--chart-2)' },
};

const meta: Meta<ScatterChart> = {
  title: 'Charts/ScatterChart',
  component: ScatterChart,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 640px;">
        <scatter-chart
          [data]="data"
          [config]="config"
          [xKey]="xKey"
          [yAxis]="yAxis"
          [tooltip]="tooltip"
        />
      </div>
    `,
  }),
  args: { data: DATA, config: CONFIG, xKey: 'x', yAxis: true, tooltip: true },
};

export default meta;
type Story = StoryObj<ScatterChart>;

export const Default: Story = {};
export const TwoSeries: Story = { args: { config: TWO } };
export const NoAxis: Story = { args: { yAxis: false } };

// Shared with the React `Workbench` story (rx-data) — keep byte-identical so the
// dual-framework workbench renders the same use case on both sides.
const WORKBENCH_DATA: ChartDatum[] = [
  { size: 90, price: 180 },
  { size: 120, price: 250 },
  { size: 180, price: 410 },
  { size: 200, price: 460 },
  { size: 260, price: 590 },
  { size: 320, price: 720 },
];

const WORKBENCH_CONFIG: ChartConfig = {
  price: { label: 'Price ($k)', color: 'var(--chart-1)' },
};

/**
 * Workbench preset: listing size vs. price, top-aligned at a fixed 28rem width
 * so the dual-framework workbench renders the IDENTICAL use case as the React
 * `Workbench` story. Keep both in sync.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 100%;">
        <scatter-chart
          [data]="data"
          [config]="config"
          [xKey]="xKey"
          [yAxis]="yAxis"
          [tooltip]="tooltip"
        />
      </div>
    `,
  }),
  args: {
    data: WORKBENCH_DATA,
    config: WORKBENCH_CONFIG,
    xKey: 'size',
    yAxis: true,
    tooltip: true,
  },
};
