import type { Meta, StoryObj } from '@storybook/angular';
import { BarChart } from './bar-chart';
import type { ChartConfig, Datum } from '../headless/types';

const DATA: Datum[] = [
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

const meta: Meta<BarChart> = {
  title: 'Charts/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 640px;">
        <bar-chart [data]="data" [config]="config" [xKey]="xKey" />
      </div>
    `,
  }),
  args: { data: DATA, config: CONFIG, xKey: 'month' },
};

export default meta;
type Story = StoryObj<BarChart>;

export const Default: Story = {};
export const SingleSeries: Story = {
  args: { config: { sales: { label: 'Sales', color: 'var(--chart-1)' } } },
};
