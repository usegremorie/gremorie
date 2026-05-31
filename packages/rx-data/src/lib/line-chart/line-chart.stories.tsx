import type { Meta, StoryObj } from "@storybook/react";

import type { ChartConfig, Datum } from "../headless/types";
import { LineChart } from "./line-chart";

/**
 * LineChart — styled line chart over the headless chart engine. `data`, a
 * `config` mapping each value field to a label + token color, and the `xKey`
 * category. One line per `config` entry.
 */
const meta = {
  title: "Layout & display/Data/Line",
  component: LineChart,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
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

const DATA: Datum[] = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 173, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

export const Default: Story = {
  args: {
    data: DATA,
    config: { desktop: { label: "Desktop", color: "var(--chart-1)" } },
    xKey: "month",
  },
};

export const Multiple: Story = {
  args: {
    data: DATA,
    config: {
      desktop: { label: "Desktop", color: "var(--chart-1)" },
      mobile: { label: "Mobile", color: "var(--chart-2)" },
    } satisfies ChartConfig,
    xKey: "month",
  },
};
