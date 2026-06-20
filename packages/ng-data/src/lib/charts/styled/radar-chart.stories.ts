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
  args: { data: DATA, config: CONFIG, xKey: 'metric', gridType: 'polygon', tooltip: true },
};

export default meta;
type Story = StoryObj<RadarChart>;

export const Default: Story = {};
export const CircleGrid: Story = { args: { gridType: 'circle' } };
export const SingleSeries: Story = {
  args: { config: { sales: { label: 'Sales', color: 'var(--chart-1)' } } },
};
