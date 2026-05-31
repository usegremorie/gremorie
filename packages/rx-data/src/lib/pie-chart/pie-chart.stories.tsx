import type { Meta, StoryObj } from "@storybook/react";

import type { Datum } from "../headless/types";
import { PieChart } from "./pie-chart";

/**
 * PieChart — styled pie / donut chart. `nameKey` is the slice label field,
 * `valueKey` the numeric value. Slice colors cycle the `--chart-1…5` tokens
 * automatically (categorical). Set `donut` for a donut.
 */
const meta = {
  title: "Charts/Pie",
  component: PieChart,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: { donut: { control: "boolean" } },
  decorators: [
    (Story) => (
      <div className="w-[24rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const DATA: Datum[] = [
  { browser: "Chrome", visitors: 275 },
  { browser: "Safari", visitors: 200 },
  { browser: "Firefox", visitors: 187 },
  { browser: "Edge", visitors: 173 },
  { browser: "Other", visitors: 90 },
];

export const Pie: Story = {
  args: { data: DATA, nameKey: "browser", valueKey: "visitors" },
};

export const Donut: Story = {
  args: { data: DATA, nameKey: "browser", valueKey: "visitors", donut: true },
};
