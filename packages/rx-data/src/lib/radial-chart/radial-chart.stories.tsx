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
 * ```text
 * ChartContainer                     responsive square frame + tooltip label config
 * └─ RadialBarChart                  recharts polar plot area
 *    ├─ ChartTooltip                 hover card
 *    │  └─ ChartTooltipContent       themed tooltip body
 *    ├─ PolarGrid                    circular grid
 *    └─ RadialBar                    one bar per row, with a faint background track
 * ```
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
  title: 'Layout & display/Data/Radial Chart',
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
