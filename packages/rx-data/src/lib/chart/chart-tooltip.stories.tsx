import type { Meta, StoryObj } from '@storybook/react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import {
  ChartContainer,
  ChartContext,
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
 * It is **recharts-context-bound**: in a chart you pass it to a recharts
 * `<Tooltip>` (re-exported here as `ChartTooltip`) inside a `<ChartContainer>`.
 * The variant stories below render just the card (no chart) by supplying the
 * config through `ChartContext` and a fabricated `payload`; `OnLineChart` shows
 * it wired to a real chart.
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

const MULTI: ChartConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' },
};

// A fabricated recharts tooltip payload so the real `ChartTooltipContent` can
// be rendered standalone — the card only, no chart (parity with the Angular
// `<chart-tooltip-content>` stories). Colors are global chart tokens (they
// don't depend on ChartContainer's per-series `--color-*` vars).
const PAYLOAD = [
  { dataKey: 'desktop', name: 'desktop', value: 305, color: 'var(--chart-1)' },
  { dataKey: 'mobile', name: 'mobile', value: 200, color: 'var(--chart-2)' },
];
const ONE = [PAYLOAD[0]];

/**
 * Renders the real `ChartTooltipContent` in isolation: we provide the chart
 * config through `ChartContext` (instead of a `ChartContainer` + recharts tree)
 * and pin it open with `active` + a fabricated `payload`.
 */
function TooltipCard(props: React.ComponentProps<typeof ChartTooltipContent>) {
  return (
    <ChartContext.Provider value={{ config: MULTI }}>
      {/* inline-block so the card hugs its content instead of stretching to
          the story width (mirrors the Angular story wrapper). */}
      <div className="inline-block">
        <ChartTooltipContent
          active
          payload={PAYLOAD as never}
          label="February"
          {...props}
        />
      </div>
    </ChartContext.Provider>
  );
}

/** Default — dot indicator, with the category header. */
export const Dot: Story = {
  render: () => <TooltipCard />,
};

/** Line indicator. */
export const Line_: Story = {
  name: 'Line',
  render: () => <TooltipCard indicator="line" />,
};

/** Dashed indicator. */
export const Dashed: Story = {
  render: () => <TooltipCard indicator="dashed" />,
};

/** Single series with the header hidden (the categorical / shadcn look). */
export const HideLabel: Story = {
  render: () => <TooltipCard hideLabel payload={ONE as never} />,
};

/** No swatch — text-only rows. */
export const HideIndicator: Story = {
  render: () => <TooltipCard hideIndicator />,
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

/** Workbench — a single args-driven card (no chart, just the tooltip) the
 * dual-framework workbench drives via its controls (indicator / hideLabel /
 * hideIndicator). */
export const Workbench: Story = {
  args: { indicator: 'dot', hideLabel: false, hideIndicator: false },
  argTypes: {
    indicator: { control: 'inline-radio', options: ['dot', 'line', 'dashed'] },
    hideLabel: { control: 'boolean' },
    hideIndicator: { control: 'boolean' },
  },
  render: (args: {
    indicator?: 'dot' | 'line' | 'dashed';
    hideLabel?: boolean;
    hideIndicator?: boolean;
  }) => <TooltipCard {...args} />,
};
