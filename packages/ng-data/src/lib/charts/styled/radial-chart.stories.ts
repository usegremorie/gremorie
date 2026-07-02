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

// Shared with the React `Workbench` story (rx-data) — keep this data array
// byte-identical so the dual-framework workbench renders the same use case on
// both sides. Each row `fill` colors a bar (matches React's per-row fill).
const WORKBENCH_DATA: ChartDatum[] = [
  { browser: 'Chrome', visitors: 275, fill: 'var(--chart-1)' },
  { browser: 'Safari', visitors: 200, fill: 'var(--chart-2)' },
  { browser: 'Firefox', visitors: 187, fill: 'var(--chart-3)' },
  { browser: 'Edge', visitors: 173, fill: 'var(--chart-4)' },
  { browser: 'Other', visitors: 90, fill: 'var(--chart-5)' },
];

/**
 * Workbench preset: visitors by browser, top-aligned at a fixed 28rem width so
 * the dual-framework workbench renders the IDENTICAL use case as the React
 * `Workbench` story. Keep both in sync.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 100%;">
        <radial-chart
          [data]="data"
          [nameKey]="nameKey"
          [dataKey]="dataKey"
          [tooltip]="tooltip"
        />
      </div>
    `,
  }),
  args: {
    data: WORKBENCH_DATA,
    nameKey: 'browser',
    dataKey: 'visitors',
    tooltip: true,
  },
};
