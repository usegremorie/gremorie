"use client";

import { cn } from "@gremorie/rx-core";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RechartsRadarChart,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../chart/chart";
import type { ChartDatum } from "../chart/types";

export interface RadarChartProps {
  /** Tabular rows — one spoke per row. */
  data: readonly ChartDatum[];
  /** Maps each value field to a label + color. One entry per series. */
  config: ChartConfig;
  /** Spoke (angle) field. */
  xKey: string;
  /** Grid shape. */
  gridType?: "polygon" | "circle";
  /** Hover tooltip. */
  tooltip?: boolean;
  className?: string;
}

/**
 * Radar chart — recharts + the shadcn `chart` primitives. One `<Radar>` per
 * `config` entry over a shared angular axis (`xKey`).
 *
 * @example
 * ```tsx
 * <RadarChart data={data} config={config} xKey="month" />
 * ```
 */
export function RadarChart({
  data,
  config,
  xKey,
  gridType = "polygon",
  tooltip = true,
  className,
}: RadarChartProps) {
  const keys = Object.keys(config).filter((k) => k !== xKey);
  const single = keys.length <= 1;

  return (
    <ChartContainer
      config={config}
      className={cn("mx-auto aspect-square max-h-[250px]", className)}
    >
      <RechartsRadarChart data={data as ChartDatum[]}>
        {tooltip ? (
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        ) : null}
        <PolarAngleAxis dataKey={xKey} />
        <PolarGrid gridType={gridType} />
        {keys.map((key) => (
          <Radar
            key={key}
            dataKey={key}
            fill={`var(--color-${key})`}
            fillOpacity={single ? 0.6 : 0}
            stroke={`var(--color-${key})`}
            strokeWidth={single ? 0 : 2}
          />
        ))}
      </RechartsRadarChart>
    </ChartContainer>
  );
}
