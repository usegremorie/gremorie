import type { Meta, StoryObj } from "@storybook/react";

import type { ChartConfig, Datum } from "../headless/types";
import { ScatterChart } from "./scatter-chart";

/**
 * ScatterChart — styled scatter chart. `xKey` is a numeric field (linear X
 * axis); each `config` entry is a numeric Y series with a label + token color.
 */
const meta = {
  title: "Charts/Scatter",
  component: ScatterChart,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[28rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScatterChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const DATA: Datum[] = [
  { weight: 55, height: 162 },
  { weight: 62, height: 168 },
  { weight: 68, height: 171 },
  { weight: 70, height: 175 },
  { weight: 74, height: 177 },
  { weight: 78, height: 180 },
  { weight: 85, height: 184 },
  { weight: 92, height: 188 },
];

export const Default: Story = {
  args: {
    data: DATA,
    config: {
      height: { label: "Height (cm)", color: "var(--chart-1)" },
    } satisfies ChartConfig,
    xKey: "weight",
  },
};
