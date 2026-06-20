import type { Meta, StoryObj } from '@storybook/react';

import type { ChartConfig } from '../chart/chart';
import type { ChartDatum } from '../chart/types';
import { AreaChart } from './area-chart';

/**
 * # AreaChart
 *
 * A recharts area chart wired to Gremorie's design tokens through the shadcn
 * `chart` primitive (`ChartContainer`). One `<Area>` per `config` entry, filled
 * with `var(--color-<key>)`.
 *
 * ## Anatomy
 *
 * ```text
 * ChartContainer                  responsive frame + injects --color-<key> from config
 * └─ AreaChart                    recharts area chart (accessibilityLayer)
 *    ├─ CartesianGrid             horizontal rules
 *    ├─ XAxis                     category axis
 *    ├─ YAxis                     numeric axis (when yAxis)
 *    ├─ ChartTooltip              hover card
 *    │  └─ ChartTooltipContent    tooltip body
 *    └─ Area                      one per series; 40% fill, full stroke
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `data` * | `ChartDatum[]` | — | Tabular rows. |
 * | `config` * | `ChartConfig` | — | Field → `{ label, color }`. One entry = one series. |
 * | `xKey` * | `string` | — | Category field. |
 * | `stacked` | `boolean` | `false` | Stack the series. |
 * | `type` | `"natural" \| "monotone" \| "linear" \| "step"` | `"natural"` | Curve interpolation. |
 * | `tooltip` | `boolean` | `true` | Hover tooltip. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--chart-1` … `--chart-5` | Series fill + stroke |
 * | `--border` | Grid lines |
 * | `--muted-foreground` | Axis labels |
 * | `--background` / `--foreground` | Tooltip surface + text |
 */
const meta = {
  title: 'Layout & display/Data/Area Chart',
  component: AreaChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    stacked: { control: 'boolean' },
    yAxis: { control: 'boolean' },
    tooltip: { control: 'boolean' },
    type: {
      control: 'inline-radio',
      options: ['natural', 'monotone', 'linear', 'step'],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[28rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const MONTHS: ChartDatum[] = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const SINGLE: ChartConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
};
const MULTI: ChartConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' },
};

/** A single filled series. */
export const Default: Story = {
  args: { data: MONTHS, config: SINGLE, xKey: 'month' },
};

/** Two series stacked. */
export const Stacked: Story = {
  args: { data: MONTHS, config: MULTI, xKey: 'month', stacked: true },
};

/** Linear interpolation. */
export const Linear: Story = {
  args: { data: MONTHS, config: SINGLE, xKey: 'month', type: 'linear' },
};

/** Step interpolation. */
export const Step: Story = {
  args: { data: MONTHS, config: SINGLE, xKey: 'month', type: 'step' },
};
