"use client";

import { cn } from "@gremorie/rx-core";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../chart/chart";
import type { ChartDatum } from "../chart/types";

export interface BarChartProps {
  /** Tabular rows. For per-bar colors, give each row a `fill` (e.g. `var(--chart-1)`). */
  data: readonly ChartDatum[];
  /** Maps each value field to a label + color. One entry per series. */
  config: ChartConfig;
  /** Category field (the X axis, or the Y axis when `horizontal`). */
  xKey: string;
  /** Stack the series instead of grouping them side by side. */
  stacked?: boolean;
  /** Render horizontal bars (recharts `layout="vertical"`). */
  horizontal?: boolean;
  /** Draw the value on top of (or beside) each bar. */
  showLabels?: boolean;
  /** Hover tooltip. */
  tooltip?: boolean;
  /** Corner radius of the bars. */
  radius?: number;
  className?: string;
}

/**
 * Bar chart — recharts + the shadcn `chart` primitives. Renders one `<Bar>` per
 * `config` entry (colored `var(--color-<key>)`); for a single categorical
 * series give each row its own `fill` and the bars take those colors.
 *
 * @example
 * ```tsx
 * <BarChart data={data} config={{ desktop: { label: "Desktop", color: "var(--chart-1)" } }} xKey="month" />
 * ```
 */
export function BarChart({
  data,
  config,
  xKey,
  stacked = false,
  horizontal = false,
  showLabels = false,
  tooltip = true,
  radius = 8,
  className,
}: BarChartProps) {
  const keys = Object.keys(config).filter((k) => k !== xKey);
  const single = keys.length <= 1;
  const perRowFill = single && data.some((d) => "fill" in d);

  return (
    <ChartContainer config={config} className={cn(className)}>
      <RechartsBarChart
        accessibilityLayer
        data={data as ChartDatum[]}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={showLabels && !horizontal ? { top: 20 } : undefined}
      >
        <CartesianGrid vertical={horizontal} horizontal={!horizontal} />
        {horizontal ? (
          <>
            <YAxis
              dataKey={xKey}
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <XAxis dataKey={keys[0]} type="number" hide />
          </>
        ) : (
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
        )}
        {tooltip ? (
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel={perRowFill} />}
          />
        ) : null}
        {keys.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            fill={`var(--color-${key})`}
            radius={radius}
            stackId={stacked ? "a" : undefined}
          >
            {perRowFill
              ? data.map((d, idx) => (
                  <Cell
                    key={idx}
                    fill={(d.fill as string) ?? `var(--color-${key})`}
                  />
                ))
              : null}
            {showLabels && (single || i === keys.length - 1) ? (
              <LabelList
                position={horizontal ? "right" : "top"}
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            ) : null}
          </Bar>
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
}
