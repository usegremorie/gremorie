import type { Meta, StoryObj } from '@storybook/angular';
import { RadialChart } from './radial-chart';
import type { Datum } from '../headless/types';

const DATA: Datum[] = [
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
        <radial-chart [data]="data" [nameKey]="nameKey" [valueKey]="valueKey" />
      </div>
    `,
  }),
  args: { data: DATA, nameKey: 'browser', valueKey: 'visitors' },
};

export default meta;
type Story = StoryObj<RadialChart>;

export const Default: Story = {};
