"use client";

import { cn } from "@gremorie/rx-core";
import {
  PolarGrid,
  RadialBar,
  RadialBarChart as RechartsRadialBarChart,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../chart/chart";
import type { ChartDatum } from "../chart/types";

export interface RadialChartProps {
  /** Tabular rows. Give each row a `fill` (e.g. `var(--color-chrome)`) for bar colors. */
  data: readonly ChartDatum[];
  /** Category label field. */
  nameKey: string;
  /** Numeric value field. */
  dataKey: string;
  /** Optional label/color map (powers the tooltip labels). */
  config?: ChartConfig;
  /** Hover tooltip. */
  tooltip?: boolean;
  className?: string;
}

/**
 * Radial bar chart — recharts + the shadcn `chart` primitives. One concentric
 * bar per row; colors come from each row's `fill`.
 *
 * @example
 * ```tsx
 * <RadialChart data={data} nameKey="browser" dataKey="visitors" />
 * ```
 */
export function RadialChart({
  data,
  nameKey,
  dataKey,
  config = {},
  tooltip = true,
  className,
}: RadialChartProps) {
  return (
    <ChartContainer
      config={config}
      className={cn("mx-auto aspect-square max-h-[250px]", className)}
    >
      <RechartsRadialBarChart data={data as ChartDatum[]} innerRadius={30} outerRadius={110}>
        {tooltip ? (
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel nameKey={nameKey} />}
          />
        ) : null}
        <PolarGrid gridType="circle" />
        <RadialBar dataKey={dataKey} background />
      </RechartsRadialBarChart>
    </ChartContainer>
  );
}
