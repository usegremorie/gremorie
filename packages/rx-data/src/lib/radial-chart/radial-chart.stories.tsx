import type { Meta, StoryObj } from "@storybook/react";

import type { Datum } from "../headless/types";
import { RadialChart } from "./radial-chart";

/**
 * RadialChart — styled radial bar chart. One concentric ring per data row
 * (`nameKey`), each sweep proportional to its `valueKey`. Ring colors cycle
 * the `--chart-1…5` tokens (categorical).
 */
const meta = {
  title: "Layout & display/Data/Radial",
  component: RadialChart,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[24rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadialChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const DATA: Datum[] = [
  { browser: "Chrome", visitors: 275 },
  { browser: "Safari", visitors: 200 },
  { browser: "Firefox", visitors: 187 },
  { browser: "Edge", visitors: 173 },
  { browser: "Other", visitors: 90 },
];

export const Default: Story = {
  args: { data: DATA, nameKey: "browser", valueKey: "visitors" },
};
