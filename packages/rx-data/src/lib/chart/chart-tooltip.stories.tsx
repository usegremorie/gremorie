import type { Meta, StoryObj } from '@storybook/react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from './chart';

/**
 * # Chart Tooltip
 *
 * `ChartTooltipContent` is the floating card the charts show on hover — the
 * shadcn chart tooltip, wired to Gremorie tokens. It reads the chart `config`
 * (via `useChart`) for labels/colors and renders the hovered series.
 *
 * It is **recharts-context-bound**: you pass it to a recharts `<Tooltip>`
 * (re-exported here as `ChartTooltip`) inside a `<ChartContainer>`. The stories
 * below pin the tooltip open with recharts' `defaultIndex` so every variation is
 * visible without hovering.
 *
 * ## Variations
 *
 * - **indicator** — `"dot"` (default) · `"line"` · `"dashed"` swatch style.
 * - **hideLabel** — drop the category header (used by single-series / categorical).
 * - **multiple series** — one row per series, each with its color.
 *
 * ## Props (the ones you'll set)
 *
 * | Prop | Type | Description |
 * | --- | --- | --- |
 * | `indicator` | `"dot" \| "line" \| "dashed"` | Swatch shape. |
 * | `hideLabel` | `boolean` | Hide the header line. |
 * | `hideIndicator` | `boolean` | Hide the color swatch. |
 * | `nameKey` / `labelKey` | `string` | Override which payload field maps to the config. |
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
  title: 'Layout & display/Data/Tooltip',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const DATA = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
];

const SINGLE: ChartConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
};
const MULTI: ChartConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' },
};

function BarDemo({
  config,
  ...content
}: {
  config: ChartConfig;
} & React.ComponentProps<typeof ChartTooltipContent>) {
  const keys = Object.keys(config);
  return (
    <ChartContainer config={config} className="h-[220px] w-[22rem]">
      <BarChart accessibilityLayer data={DATA}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <ChartTooltip
          defaultIndex={1}
          cursor={false}
          content={<ChartTooltipContent {...content} />}
        />
        {keys.map((k) => (
          <Bar key={k} dataKey={k} fill={`var(--color-${k})`} radius={6} />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

/** Default — dot indicator, with the category header. */
export const Dot: Story = {
  render: () => <BarDemo config={MULTI} />,
};

/** Line indicator. */
export const Line_: Story = {
  name: 'Line',
  render: () => <BarDemo config={MULTI} indicator="line" />,
};

/** Dashed indicator. */
export const Dashed: Story = {
  render: () => <BarDemo config={MULTI} indicator="dashed" />,
};

/** Single series with the header hidden (the categorical / shadcn look). */
export const HideLabel: Story = {
  render: () => <BarDemo config={SINGLE} hideLabel />,
};

/** No swatch — text-only rows. */
export const HideIndicator: Story = {
  render: () => <BarDemo config={MULTI} hideIndicator />,
};

/** On a line chart, pinned open. */
export const OnLineChart: Story = {
  render: () => (
    <ChartContainer config={MULTI} className="h-[220px] w-[22rem]">
      <LineChart accessibilityLayer data={DATA}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <ChartTooltip
          defaultIndex={1}
          cursor={false}
          content={<ChartTooltipContent />}
        />
        <Line
          dataKey="desktop"
          type="natural"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="mobile"
          type="natural"
          stroke="var(--color-mobile)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  ),
};
