import type { Meta, StoryObj } from "@storybook/react";

import type { ChartConfig, Datum } from "../headless/types";
import { BarChart } from "./bar-chart";

/**
 * BarChart — styled grouped bar chart over the headless chart engine.
 *
 * Pass tabular `data`, a serializable `config` mapping each value field to a
 * label + token color, and the `xKey` category. One `config` entry = one
 * series; multiple entries render side-by-side bars per category.
 *
 * Colors are chart tokens (`var(--chart-1)` … `var(--chart-5)`).
 */
const meta = {
  title: "Charts/Bar",
  component: BarChart,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
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

const DATA: Datum[] = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 173, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

const SINGLE: ChartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
};

const MULTI: ChartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
};

/** A single series. */
export const Default: Story = {
  args: { data: DATA, config: SINGLE, xKey: "month" },
};

/** Two series grouped side-by-side per category. */
export const Multiple: Story = {
  args: { data: DATA, config: MULTI, xKey: "month" },
};

/** Same data, a different token color. */
export const Tinted: Story = {
  args: {
    data: DATA,
    config: { desktop: { label: "Desktop", color: "var(--chart-3)" } },
    xKey: "month",
  },
};
