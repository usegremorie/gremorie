import type { Meta, StoryObj } from "@storybook/react";

import { ChartTooltipContent } from "./chart-tooltip";

/**
 * # ChartTooltipContent
 *
 * The floating card a chart shows on hover. Pure presentational (no
 * positioning, no hover wiring) — a styled chart (e.g. `BarChart`) positions
 * it at the hovered point. This is **the exact tooltip `BarChart` renders**;
 * edit it here and the charts reflect it.
 *
 * ## Anatomy
 *
 * - **Label** — optional header (usually the hovered category).
 * - **Items** — one row each: a color **swatch** · a **label** · a **value**.
 *
 * ## Props
 *
 * | Prop | Type | Description |
 * | --- | --- | --- |
 * | `label` | `ReactNode` | Header line (omit for a header-less tooltip). |
 * | `items` | `{ label, value, color? }[]` | Rows — one per series. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--background` / `--border` | Card surface + border |
 * | `--foreground` | Label + value text |
 * | `--muted-foreground` | Series label |
 * | `--chart-1` … `--chart-5` | Swatch colors |
 */
const meta = {
  title: "Layout & display/Data/Tooltip",
  component: ChartTooltipContent,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ChartTooltipContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A single series — the most common case (one value per category). */
export const Single: Story = {
  args: {
    label: "February",
    items: [{ label: "Desktop", value: "305", color: "var(--chart-1)" }],
  },
};

/** Multiple series — one row per series, each with its color. */
export const Multiple: Story = {
  args: {
    label: "February",
    items: [
      { label: "Desktop", value: "305", color: "var(--chart-1)" },
      { label: "Mobile", value: "200", color: "var(--chart-2)" },
      { label: "Tablet", value: "98", color: "var(--chart-3)" },
    ],
  },
};

/** Categorical — the swatch matches the hovered bar's color. */
export const Categorical: Story = {
  args: {
    label: "Marketing",
    items: [{ label: "Rating", value: "4.37", color: "var(--chart-1)" }],
  },
};

/** Formatted values (currency). */
export const Currency: Story = {
  args: {
    label: "Organic",
    items: [{ label: "Revenue", value: "$48,200", color: "var(--chart-1)" }],
  },
};

/** No header — just the value rows. */
export const NoLabel: Story = {
  args: {
    items: [
      { label: "Visitors", value: "1,204", color: "var(--chart-2)" },
    ],
  },
};

/** No swatch — text-only rows. */
export const NoSwatch: Story = {
  args: {
    label: "Q3 2024",
    items: [
      { label: "Sessions", value: "12,480" },
      { label: "Conversions", value: "1,036" },
    ],
  },
};
