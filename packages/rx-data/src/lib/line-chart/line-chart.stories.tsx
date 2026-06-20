import type { Meta, StoryObj } from '@storybook/react';

import type { ChartConfig } from '../chart/chart';
import type { ChartDatum } from '../chart/types';
import { LineChart } from './line-chart';

/**
 * # LineChart
 *
 * A recharts line chart wired to Gremorie's design tokens through the shadcn
 * `chart` primitive (`ChartContainer`). One `<Line>` per `config` entry, stroked
 * with `var(--color-<key>)`.
 *
 * ## Anatomy
 *
 * ```text
 * LineChart                       styled wrapper; one Line per config entry
 * └─ ChartContainer               responsive frame; injects --color-<key> from config
 *    ├─ CartesianGrid             horizontal rules
 *    ├─ XAxis                     category axis
 *    ├─ YAxis                     numeric axis (optional, yAxis)
 *    ├─ ChartTooltip              hover card
 *    │  └─ ChartTooltipContent    token-styled tooltip body
 *    └─ Line                      one per series; 2px stroke; optional dots
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `data` * | `ChartDatum[]` | — | Tabular rows. |
 * | `config` * | `ChartConfig` | — | Field → `{ label, color }`. One entry = one series. |
 * | `xKey` * | `string` | — | Category field. |
 * | `type` | `"natural" \| "monotone" \| "linear" \| "step"` | `"natural"` | Curve interpolation. |
 * | `dots` | `boolean` | `false` | Show a dot at each point. |
 * | `tooltip` | `boolean` | `true` | Hover tooltip. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--chart-1` … `--chart-5` | Line strokes |
 * | `--border` | Grid lines |
 * | `--muted-foreground` | Axis labels |
 * | `--background` / `--foreground` | Tooltip surface + text |
 */
const meta = {
  title: 'Layout & display/Data/Line Chart',
  component: LineChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    dots: { control: 'boolean' },
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
} satisfies Meta<typeof LineChart>;

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

/** A single line. */
export const Default: Story = {
  args: { data: MONTHS, config: SINGLE, xKey: 'month' },
};

/** Two lines. */
export const Multiple: Story = {
  args: { data: MONTHS, config: MULTI, xKey: 'month' },
};

/** With dot markers. */
export const Dots: Story = {
  args: { data: MONTHS, config: SINGLE, xKey: 'month', dots: true },
};

/** Linear interpolation. */
export const Linear: Story = {
  args: { data: MONTHS, config: SINGLE, xKey: 'month', type: 'linear' },
};
