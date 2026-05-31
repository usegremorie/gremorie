import type { Meta, StoryObj } from "@storybook/react";

import type { ChartConfig, Datum } from "../headless/types";
import { BarChart } from "./bar-chart";

/**
 * # BarChart
 *
 * The styled bar chart over the headless engine — **framework-agnostic** in
 * spirit (same shape in the React and Angular editions; only the syntax
 * differs). This is the primitive the **Chart artifact embeds**: edit it here
 * and the artifact reflects the change.
 *
 * ## Anatomy
 *
 * - **Frame** — the responsive `<svg>` (headless `ChartFrame`).
 * - **Grid** — faint horizontal rules.
 * - **Bars** — top-rounded; colored by **series** (one color per field) or
 *   **categorical** (each bar a `--chart-n`).
 * - **Axes** — X labels always; Y optional (`axis`).
 * - **Tooltip** — hover cursor band + a card (category · color dot · label ·
 *   value).
 * - **Chrome** — optional card border / surface / padding (`chrome`); turn it
 *   off to embed (the artifact does).
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `data` * | `Datum[]` | — | Tabular rows. |
 * | `config` * | `ChartConfig` | — | Field → `{ label, color }`. One entry = one series. |
 * | `xKey` * | `string` | — | Category field (x axis). |
 * | `colorMode` | `"series" \| "categorical"` | `"series"` | Per-series vs per-bar colors. |
 * | `tooltip` | `boolean` | `true` | Hover tooltip + cursor band. |
 * | `axis` | `"xy" \| "x" \| "none"` | `"xy"` | Which axes to draw. |
 * | `barRadius` | `number` | `4` | Top-corner radius. |
 * | `chrome` | `boolean` | `true` | Card border / surface / padding. |
 * | `formatValue` | `(n: number) => string` | `toLocaleString` | Tooltip value format. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--chart-1` … `--chart-5` | Bar colors (categorical) + config colors |
 * | `--border` / `--card` | Chrome border + surface |
 * | `--muted-foreground` | Axis labels, grid lines |
 * | `--background` / `--foreground` | Tooltip surface + text |
 */
const meta = {
  title: "Charts/Bar",
  component: BarChart,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    colorMode: { control: "inline-radio", options: ["series", "categorical"] },
    axis: { control: "inline-radio", options: ["xy", "x", "none"] },
    tooltip: { control: "boolean" },
    chrome: { control: "boolean" },
    barRadius: { control: { type: "range", min: 0, max: 12, step: 1 } },
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

const MONTHS: Datum[] = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 173, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

const DEPTS: Datum[] = [
  { department: "Marketing", rating: 4.37 },
  { department: "Product", rating: 4.12 },
  { department: "Support", rating: 3.94 },
  { department: "Sales", rating: 3.76 },
  { department: "Finance", rating: 3.72 },
  { department: "Ops", rating: 3.58 },
];

const SINGLE: ChartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
};
const MULTI: ChartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
};
const RATING: ChartConfig = {
  rating: { label: "Rating", color: "var(--chart-1)" },
};

/** A single series with both axes and the hover tooltip. */
export const Default: Story = {
  args: { data: MONTHS, config: SINGLE, xKey: "month" },
};

/** Two series grouped side-by-side. Hover shows both. */
export const Multiple: Story = {
  args: { data: MONTHS, config: MULTI, xKey: "month" },
};

/** Each bar a categorical token, no Y axis — the shadcn look. */
export const Categorical: Story = {
  args: {
    data: DEPTS,
    config: RATING,
    xKey: "department",
    colorMode: "categorical",
    axis: "x",
  },
};

/** No chrome — exactly how the Chart artifact embeds it. */
export const Embedded: Story = {
  args: {
    data: DEPTS,
    config: RATING,
    xKey: "department",
    colorMode: "categorical",
    axis: "x",
    chrome: false,
  },
  decorators: [
    (Story) => (
      <div className="w-[26rem] max-w-full rounded-xl border bg-card p-4">
        <Story />
      </div>
    ),
  ],
};

/** Tooltip off — static chart. */
export const NoTooltip: Story = {
  args: { data: MONTHS, config: SINGLE, xKey: "month", tooltip: false },
};
