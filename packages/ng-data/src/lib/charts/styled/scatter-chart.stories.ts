import type { Meta, StoryObj } from '@storybook/angular';
import { ScatterChart } from './scatter-chart';
import type { ChartConfig, Datum } from '../headless/types';

const DATA: Datum[] = [
  { x: 12, weight: 40 },
  { x: 25, weight: 95 },
  { x: 38, weight: 60 },
  { x: 47, weight: 130 },
  { x: 58, weight: 85 },
  { x: 70, weight: 160 },
  { x: 82, weight: 110 },
];

const CONFIG: ChartConfig = {
  weight: { label: 'Weight', color: 'var(--chart-1)' },
};

const meta: Meta<ScatterChart> = {
  title: 'Charts/ScatterChart',
  component: ScatterChart,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 640px;">
        <scatter-chart [data]="data" [config]="config" [xKey]="xKey" />
      </div>
    `,
  }),
  args: { data: DATA, config: CONFIG, xKey: 'x' },
};

export default meta;
type Story = StoryObj<ScatterChart>;

export const Default: Story = {};
