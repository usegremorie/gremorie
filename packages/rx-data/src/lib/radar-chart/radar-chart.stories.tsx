import type { Meta, StoryObj } from "@storybook/react";

import type { ChartConfig } from "../chart/chart";
import type { ChartDatum } from "../chart/types";
import { RadarChart } from "./radar-chart";

/**
 * # RadarChart
 *
 * A recharts radar chart wired to Gremorie's design tokens through the shadcn
 * `chart` primitive (`ChartContainer`). One `<Radar>` polygon per `config` entry
 * over a shared angular axis (`xKey`).
 *
 * ## Anatomy
 *
 * - **ChartContainer** — responsive square frame + injects `--color-<key>`.
 * - **PolarAngleAxis** — spoke labels (`xKey`).
 * - **PolarGrid** — polygon or circular grid (`gridType`).
 * - **Radar** — one polygon per series.
 * - **ChartTooltip** — hover card (`ChartTooltipContent`).
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `data` * | `ChartDatum[]` | — | One row per spoke. |
 * | `config` * | `ChartConfig` | — | Field → `{ label, color }`. One entry = one series. |
 * | `xKey` * | `string` | — | Spoke (angle) field. |
 * | `gridType` | `"polygon" \| "circle"` | `"polygon"` | Grid shape. |
 * | `tooltip` | `boolean` | `true` | Hover tooltip. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--chart-1` … `--chart-5` | Polygon fill + stroke |
 * | `--border` | Grid + spokes |
 * | `--muted-foreground` | Spoke labels |
 */
const meta = {
  title: "Layout & display/Data/Radar",
  component: RadarChart,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    gridType: { control: "inline-radio", options: ["polygon", "circle"] },
    tooltip: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="w-[22rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const METRICS: ChartDatum[] = [
  { metric: "Speed", current: 120, target: 110 },
  { metric: "Power", current: 98, target: 130 },
  { metric: "Range", current: 86, target: 100 },
  { metric: "Agility", current: 99, target: 90 },
  { metric: "Armor", current: 85, target: 120 },
  { metric: "Stealth", current: 65, target: 85 },
];

const SINGLE: ChartConfig = {
  current: { label: "Current", color: "var(--chart-1)" },
};
const MULTI: ChartConfig = {
  current: { label: "Current", color: "var(--chart-1)" },
  target: { label: "Target", color: "var(--chart-2)" },
};

/** A single filled polygon. */
export const Default: Story = {
  args: { data: METRICS, config: SINGLE, xKey: "metric" },
};

/** Two series (outlined). */
export const Multiple: Story = {
  args: { data: METRICS, config: MULTI, xKey: "metric" },
};

/** Circular grid. */
export const CircleGrid: Story = {
  args: { data: METRICS, config: SINGLE, xKey: "metric", gridType: "circle" },
};
