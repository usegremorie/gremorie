import type { Meta, StoryObj } from '@storybook/angular';
import { PieChart } from './pie-chart';
import type { ChartDatum } from '../headless/types';

const DATA: ChartDatum[] = [
  { browser: 'Chrome', visitors: 275 },
  { browser: 'Safari', visitors: 200 },
  { browser: 'Firefox', visitors: 187 },
  { browser: 'Edge', visitors: 173 },
  { browser: 'Other', visitors: 90 },
];

const meta: Meta<PieChart> = {
  title: 'Charts/PieChart',
  component: PieChart,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 360px;">
        <pie-chart
          [data]="data"
          [nameKey]="nameKey"
          [dataKey]="dataKey"
          [donut]="donut"
          [showLabels]="showLabels"
          [tooltip]="tooltip"
        />
      </div>
    `,
  }),
  args: {
    data: DATA,
    nameKey: 'browser',
    dataKey: 'visitors',
    donut: false,
    showLabels: false,
    tooltip: true,
  },
};

export default meta;
type Story = StoryObj<PieChart>;

export const Pie: Story = {};
export const Donut: Story = { args: { donut: true } };
export const WithLabels: Story = { args: { showLabels: true } };
