import type { Meta, StoryObj } from '@storybook/react';

import type { ChartConfig } from '../chart/chart';
import type { ChartDatum } from '../chart/types';
import { BarChart } from './bar-chart';

/**
 * # BarChart
 *
 * A recharts bar chart wired to Gremorie's design tokens through the shadcn
 * `chart` primitive (`ChartContainer`). One `<Bar>` per `config` entry, colored
 * `var(--color-<key>)`; for a single categorical series, give each row a `fill`
 * and the bars take those colors.
 *
 * ## Anatomy
 *
 * - **ChartContainer** — responsive frame + injects `--color-<key>` from `config`.
 * - **CartesianGrid** — horizontal rules (vertical when `horizontal`).
 * - **XAxis / YAxis** — category + value axes (axes swap when `horizontal`).
 * - **Bar** — one per series; rounded corners; optional `LabelList`.
 * - **ChartTooltip** — hover card (`ChartTooltipContent`).
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `data` * | `ChartDatum[]` | — | Tabular rows. Per-bar color: add `fill` to each row. |
 * | `config` * | `ChartConfig` | — | Field → `{ label, color }`. One entry = one series. |
 * | `xKey` * | `string` | — | Category field. |
 * | `stacked` | `boolean` | `false` | Stack series instead of grouping. |
 * | `horizontal` | `boolean` | `false` | Horizontal bars. |
 * | `showLabels` | `boolean` | `false` | Draw the value on each bar. |
 * | `tooltip` | `boolean` | `true` | Hover tooltip. |
 * | `radius` | `number` | `8` | Bar corner radius. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--chart-1` … `--chart-5` | Series / per-bar colors |
 * | `--border` | Grid lines |
 * | `--muted-foreground` | Axis labels |
 * | `--background` / `--foreground` | Tooltip surface + text |
 */
const meta = {
  title: 'Layout & display/Data/Bar',
  component: BarChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    stacked: { control: 'boolean' },
    horizontal: { control: 'boolean' },
    yAxis: { control: 'boolean' },
    showLabels: { control: 'boolean' },
    tooltip: { control: 'boolean' },
    radius: { control: { type: 'range', min: 0, max: 16, step: 1 } },
  },
  decorators: [
    (Story) => (
      <div className="w-[28rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BarChart>;

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

const DEPTS: ChartDatum[] = [
  { department: 'Marketing', rating: 4.37, fill: 'var(--chart-1)' },
  { department: 'Product', rating: 4.12, fill: 'var(--chart-2)' },
  { department: 'Support', rating: 3.94, fill: 'var(--chart-3)' },
  { department: 'Sales', rating: 3.76, fill: 'var(--chart-4)' },
  { department: 'Finance', rating: 3.72, fill: 'var(--chart-5)' },
];

const SINGLE: ChartConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
};
const MULTI: ChartConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' },
};
const RATING: ChartConfig = { rating: { label: 'Rating' } };

/** A single series. */
export const Default: Story = {
  args: { data: MONTHS, config: SINGLE, xKey: 'month' },
};

/** Two series grouped side by side. */
export const Multiple: Story = {
  args: { data: MONTHS, config: MULTI, xKey: 'month' },
};

/** Two series stacked — only the outer corners of the stack are rounded. */
export const Stacked: Story = {
  args: { data: MONTHS, config: MULTI, xKey: 'month', stacked: true },
};

/** Y axis hidden — the compact look the chart artifact embeds. */
export const NoYAxis: Story = {
  args: { data: MONTHS, config: SINGLE, xKey: 'month', yAxis: false },
};

/** Per-bar categorical colors (each row has a `fill`). */
export const Categorical: Story = {
  args: { data: DEPTS, config: RATING, xKey: 'department' },
};

/** Horizontal layout. */
export const Horizontal: Story = {
  args: { data: DEPTS, config: RATING, xKey: 'department', horizontal: true },
};

/** Value labels drawn on each bar. */
export const WithLabels: Story = {
  args: { data: MONTHS, config: SINGLE, xKey: 'month', showLabels: true },
};

/** Tooltip off — static chart. */
export const NoTooltip: Story = {
  args: { data: MONTHS, config: SINGLE, xKey: 'month', tooltip: false },
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
