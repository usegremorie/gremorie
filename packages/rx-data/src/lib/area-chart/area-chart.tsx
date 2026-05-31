"use client";

import { cn } from "@gremorie/rx-core";
import { Area, AreaChart as RechartsAreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../chart/chart";
import type { ChartDatum } from "../chart/types";

export interface AreaChartProps {
  /** Tabular rows. */
  data: readonly ChartDatum[];
  /** Maps each value field to a label + color. One entry per series. */
  config: ChartConfig;
  /** Category field (x axis). */
  xKey: string;
  /** Stack the series. */
  stacked?: boolean;
  /** Curve interpolation (recharts `type`). */
  type?: "natural" | "monotone" | "linear" | "step";
  /** Hover tooltip. */
  tooltip?: boolean;
  className?: string;
}

/**
 * Area chart — recharts + the shadcn `chart` primitives. One `<Area>` per
 * `config` entry, filled with `var(--color-<key>)`.
 *
 * @example
 * ```tsx
 * <AreaChart data={data} config={config} xKey="month" stacked />
 * ```
 */
export function AreaChart({
  data,
  config,
  xKey,
  stacked = false,
  type = "natural",
  tooltip = true,
  className,
}: AreaChartProps) {
  const keys = Object.keys(config).filter((k) => k !== xKey);

  return (
    <ChartContainer config={config} className={cn(className)}>
      <RechartsAreaChart
        accessibilityLayer
        data={data as ChartDatum[]}
        margin={{ left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} />
        {tooltip ? (
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator={keys.length > 1 ? "dot" : "line"} />}
          />
        ) : null}
        {keys.map((key) => (
          <Area
            key={key}
            dataKey={key}
            type={type}
            fill={`var(--color-${key})`}
            fillOpacity={0.4}
            stroke={`var(--color-${key})`}
            stackId={stacked ? "a" : undefined}
          />
        ))}
      </RechartsAreaChart>
    </ChartContainer>
  );
}
