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
 * - **ChartContainer** — responsive frame + injects `--color-<key>` from `config`.
 * - **CartesianGrid** — horizontal rules.
 * - **XAxis** — category axis.
 * - **Line** — one per series; 2px stroke; optional dots.
 * - **ChartTooltip** — hover card (`ChartTooltipContent`).
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
  title: 'Layout & display/Data/Line',
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

// Shared with the Angular `Workbench` story (ng-data) — keep byte-identical so
// the dual-framework workbench renders the same use case on both sides.
const WORKBENCH_DATA: ChartDatum[] = [
  { month: 'Jan', sales: 186, profit: 80 },
  { month: 'Feb', sales: 305, profit: 200 },
  { month: 'Mar', sales: 237, profit: 120 },
  { month: 'Apr', sales: 173, profit: 90 },
  { month: 'May', sales: 209, profit: 130 },
  { month: 'Jun', sales: 264, profit: 140 },
];

const WORKBENCH_CONFIG: ChartConfig = {
  sales: { label: 'Sales', color: 'var(--chart-1)' },
  profit: { label: 'Profit', color: 'var(--chart-2)' },
};

/**
 * Workbench preset: monthly sales vs. profit, top-aligned (layout `padded`) at a
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
  args: { data: WORKBENCH_DATA, config: WORKBENCH_CONFIG, xKey: 'month' },
};
