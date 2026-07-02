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

// Shared with the React `Workbench` story (rx-data) — keep this data array
// byte-identical so the dual-framework workbench renders the same use case on
// both sides. Each row `fill` colors a slice (matches React's per-row fill).
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
    data: WORKBENCH_DATA,
    nameKey: 'browser',
    dataKey: 'visitors',
    donut: false,
    showLabels: false,
    tooltip: true,
  },
};
