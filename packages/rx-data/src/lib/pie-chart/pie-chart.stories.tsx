import type { Meta, StoryObj } from '@storybook/react';

import type { ChartConfig } from '../chart/chart';
import type { ChartDatum } from '../chart/types';
import { PieChart } from './pie-chart';

/**
 * # PieChart
 *
 * A recharts pie / donut chart wired to Gremorie's design tokens through the
 * shadcn `chart` primitive (`ChartContainer`). Slice colors come from each row's
 * `fill`; `config` supplies the labels shown in the tooltip.
 *
 * ## Anatomy
 *
 * ```text
 * PieChart                          recharts pie / donut on the shadcn chart primitive
 * └─ ChartContainer                 responsive square frame + tooltip label config
 *    └─ RechartsPieChart            recharts pie surface
 *       ├─ ChartTooltip             hover card
 *       │  └─ ChartTooltipContent   themed tooltip body
 *       └─ Pie                      one slice per row (nameKey + dataKey); innerRadius for donut
 *          └─ LabelList             optional slice labels (showLabels)
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `data` * | `ChartDatum[]` | — | One row per slice. Add `fill` for slice color. |
 * | `nameKey` * | `string` | — | Slice label field. |
 * | `dataKey` * | `string` | — | Numeric value field. |
 * | `config` | `ChartConfig` | `{}` | Slice name → `{ label }` (tooltip labels). |
 * | `donut` | `boolean` | `false` | Render a donut (inner radius). |
 * | `showLabels` | `boolean` | `false` | Draw the slice label. |
 * | `tooltip` | `boolean` | `true` | Hover tooltip. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--chart-1` … `--chart-5` | Slice colors (row `fill`) |
 * | `--background` / `--foreground` | Tooltip surface + text |
 */
const meta = {
  title: 'Layout & display/Data/Pie Chart',
  component: PieChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    donut: { control: 'boolean' },
    showLabels: { control: 'boolean' },
    tooltip: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="w-[20rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PieChart>;

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

/** A solid pie. */
export const Default: Story = {
  args: {
    data: BROWSERS,
    config: CONFIG,
    nameKey: 'browser',
    dataKey: 'visitors',
  },
};

/** Donut variant. */
export const Donut: Story = {
  args: {
    data: BROWSERS,
    config: CONFIG,
    nameKey: 'browser',
    dataKey: 'visitors',
    donut: true,
  },
};

/** With slice labels. */
export const WithLabels: Story = {
  args: {
    data: BROWSERS,
    config: CONFIG,
    nameKey: 'browser',
    dataKey: 'visitors',
    showLabels: true,
  },
};
