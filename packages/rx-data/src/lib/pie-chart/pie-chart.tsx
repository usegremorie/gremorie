"use client";

import { cn } from "@gremorie/rx-core";
import { LabelList, Pie, PieChart as RechartsPieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../chart/chart";
import type { ChartDatum } from "../chart/types";

export interface PieChartProps {
  /** Tabular rows. Give each row a `fill` (e.g. `var(--color-chrome)`) for slice colors. */
  data: readonly ChartDatum[];
  /** Slice label field. */
  nameKey: string;
  /** Numeric value field. */
  dataKey: string;
  /** Optional label/color map (powers the tooltip labels). */
  config?: ChartConfig;
  /** Render as a donut. */
  donut?: boolean;
  /** Draw the slice label inside each slice. */
  showLabels?: boolean;
  /** Hover tooltip. */
  tooltip?: boolean;
  className?: string;
}

/**
 * Pie / donut chart — recharts + the shadcn `chart` primitives. Slice colors
 * come from each row's `fill`. Pass `donut` for a donut.
 *
 * @example
 * ```tsx
 * <PieChart data={data} nameKey="browser" dataKey="visitors" donut />
 * ```
 */
export function PieChart({
  data,
  nameKey,
  dataKey,
  config = {},
  donut = false,
  showLabels = false,
  tooltip = true,
  className,
}: PieChartProps) {
  return (
    <ChartContainer
      config={config}
      className={cn("mx-auto aspect-square max-h-[250px]", className)}
    >
      <RechartsPieChart>
        {tooltip ? (
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey={nameKey} hideLabel />}
          />
        ) : null}
        <Pie
          data={data as ChartDatum[]}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius={donut ? 60 : 0}
          labelLine={false}
        >
          {showLabels ? (
            <LabelList
              dataKey={nameKey}
              className="fill-background"
              stroke="none"
              fontSize={12}
            />
          ) : null}
        </Pie>
      </RechartsPieChart>
    </ChartContainer>
  );
}
