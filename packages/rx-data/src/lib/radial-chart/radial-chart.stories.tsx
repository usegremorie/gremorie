import type { Meta, StoryObj } from '@storybook/react';

import type { ChartConfig } from '../chart/chart';
import type { ChartDatum } from '../chart/types';
import { RadialChart } from './radial-chart';

/**
 * # RadialChart
 *
 * A recharts radial bar chart wired to Gremorie's design tokens through the
 * shadcn `chart` primitive (`ChartContainer`). One concentric bar per row; bar
 * colors come from each row's `fill`.
 *
 * ## Anatomy
 *
 * - **ChartContainer** — responsive square frame + tooltip label config.
 * - **PolarGrid** — circular grid.
 * - **RadialBar** — one bar per row (`dataKey`), with a faint background track.
 * - **ChartTooltip** — hover card (`ChartTooltipContent`).
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `data` * | `ChartDatum[]` | — | One row per bar. Add `fill` for bar color. |
 * | `nameKey` * | `string` | — | Category label field. |
 * | `dataKey` * | `string` | — | Numeric value field. |
 * | `config` | `ChartConfig` | `{}` | Category name → `{ label }` (tooltip labels). |
 * | `tooltip` | `boolean` | `true` | Hover tooltip. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--chart-1` … `--chart-5` | Bar colors (row `fill`) |
 * | `--muted` | Background track |
 * | `--background` / `--foreground` | Tooltip surface + text |
 */
const meta = {
  title: 'Layout & display/Data/Radial',
  component: RadialChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: { tooltip: { control: 'boolean' } },
  decorators: [
    (Story) => (
      <div className="w-[20rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadialChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const BROWSERS: ChartDatum[] = [
  { browser: 'Chrome', visitors: 275, fill: 'var(--chart-1)' },
  { browser: 'Safari', visitors: 200, fill: 'var(--chart-2)' },
  { browser: 'Firefox', visitors: 187, fill: 'var(--chart-3)' },
  { browser: 'Edge', visitors: 173, fill: 'var(--chart-4)' },
  { browser: 'Other', visitors: 90, fill: 'var(--chart-5)' },
];

const CONFIG: ChartConfig = {
  visitors: { label: 'Visitors' },
  Chrome: { label: 'Chrome' },
  Safari: { label: 'Safari' },
  Firefox: { label: 'Firefox' },
  Edge: { label: 'Edge' },
  Other: { label: 'Other' },
};

/** Concentric bars, one per row. */
export const Default: Story = {
  args: {
    data: BROWSERS,
    config: CONFIG,
    nameKey: 'browser',
    dataKey: 'visitors',
  },
};

// Shared with the Angular `Workbench` story (ng-data) — keep this data array
// byte-identical so the dual-framework workbench renders the same use case on
// both sides. (Angular has no `config` input; colors come from each row `fill`.)
const WORKBENCH_DATA: ChartDatum[] = [
  { browser: 'Chrome', visitors: 275, fill: 'var(--chart-1)' },
  { browser: 'Safari', visitors: 200, fill: 'var(--chart-2)' },
  { browser: 'Firefox', visitors: 187, fill: 'var(--chart-3)' },
  { browser: 'Edge', visitors: 173, fill: 'var(--chart-4)' },
  { browser: 'Other', visitors: 90, fill: 'var(--chart-5)' },
];

/**
 * Workbench preset: visitors by browser, top-aligned (layout `padded`) at a
 * fixed 28rem width so the dual-framework workbench renders the IDENTICAL use
 * case as the Angular `Workbench` story. Keep both in sync.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[28rem] max-w-full">
        <Story />
      </div>
    ),
  ],
  args: {
    data: WORKBENCH_DATA,
    config: CONFIG,
    nameKey: 'browser',
    dataKey: 'visitors',
  },
};
