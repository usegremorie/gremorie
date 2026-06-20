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
