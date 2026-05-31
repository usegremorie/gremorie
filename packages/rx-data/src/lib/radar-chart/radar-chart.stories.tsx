import type { Meta, StoryObj } from "@storybook/react";

import type { ChartConfig, Datum } from "../headless/types";
import { RadarChart } from "./radar-chart";

/**
 * RadarChart — styled radar chart. Each data row (`xKey`) becomes a spoke;
 * each `config` entry is a polygon series with a label + token color.
 */
const meta = {
  title: "Charts/Radar",
  component: RadarChart,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[26rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const DATA: Datum[] = [
  { metric: "Speed", current: 120, target: 110 },
  { metric: "Power", current: 98, target: 130 },
  { metric: "Range", current: 86, target: 100 },
  { metric: "Agility", current: 99, target: 90 },
  { metric: "Armor", current: 85, target: 120 },
  { metric: "Stealth", current: 65, target: 85 },
];

export const Default: Story = {
  args: {
    data: DATA,
    config: { current: { label: "Current", color: "var(--chart-1)" } },
    xKey: "metric",
  },
};

export const Multiple: Story = {
  args: {
    data: DATA,
    config: {
      current: { label: "Current", color: "var(--chart-1)" },
      target: { label: "Target", color: "var(--chart-2)" },
    } satisfies ChartConfig,
    xKey: "metric",
  },
};
