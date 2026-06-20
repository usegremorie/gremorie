import type { Meta, StoryObj } from '@storybook/angular';
import { BarChart } from './bar-chart';
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

const BROWSERS: ChartDatum[] = [
  { browser: 'Chrome', visitors: 275, fill: 'var(--chart-1)' },
  { browser: 'Safari', visitors: 200, fill: 'var(--chart-2)' },
  { browser: 'Firefox', visitors: 187, fill: 'var(--chart-3)' },
  { browser: 'Edge', visitors: 173, fill: 'var(--chart-4)' },
  { browser: 'Other', visitors: 90, fill: 'var(--chart-5)' },
];

const meta: Meta<BarChart> = {
  title: 'Charts/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 640px;">
        <bar-chart
          [data]="data"
          [config]="config"
          [xKey]="xKey"
          [stacked]="stacked"
          [horizontal]="horizontal"
          [yAxis]="yAxis"
          [showLabels]="showLabels"
          [tooltip]="tooltip"
          [radius]="radius"
        />
      </div>
    `,
  }),
  args: {
    data: DATA,
    config: CONFIG,
    xKey: 'month',
    stacked: false,
    horizontal: false,
    yAxis: true,
    showLabels: false,
    tooltip: true,
    radius: 8,
  },
};

export default meta;
type Story = StoryObj<BarChart>;

export const Default: Story = {};

export const SingleSeries: Story = {
  args: { config: { sales: { label: 'Sales', color: 'var(--chart-1)' } } },
};

export const Stacked: Story = { args: { stacked: true } };

export const Horizontal: Story = { args: { horizontal: true } };

export const StackedHorizontal: Story = {
  args: { stacked: true, horizontal: true },
};

export const WithLabels: Story = {
  args: {
    config: { sales: { label: 'Sales', color: 'var(--chart-1)' } },
    showLabels: true,
  },
};

export const PerBarColors: Story = {
  args: {
    data: BROWSERS,
    config: { visitors: { label: 'Visitors' } },
    xKey: 'browser',
  },
};

export const NoAxisNoTooltip: Story = {
  args: { yAxis: false, tooltip: false },
};
