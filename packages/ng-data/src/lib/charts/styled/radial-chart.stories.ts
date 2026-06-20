import type { Meta, StoryObj } from '@storybook/angular';
import { RadialChart } from './radial-chart';
import type { ChartDatum } from '../headless/types';

const DATA: ChartDatum[] = [
  { browser: 'Chrome', visitors: 275 },
  { browser: 'Safari', visitors: 200 },
  { browser: 'Firefox', visitors: 187 },
  { browser: 'Edge', visitors: 173 },
  { browser: 'Other', visitors: 90 },
];

const meta: Meta<RadialChart> = {
  title: 'Charts/RadialChart',
  component: RadialChart,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 360px;">
        <radial-chart
          [data]="data"
          [nameKey]="nameKey"
          [dataKey]="dataKey"
          [tooltip]="tooltip"
        />
      </div>
    `,
  }),
  args: { data: DATA, nameKey: 'browser', dataKey: 'visitors', tooltip: true },
};

export default meta;
type Story = StoryObj<RadialChart>;

export const Default: Story = {};
export const NoTooltip: Story = { args: { tooltip: false } };
