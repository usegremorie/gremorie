'use client';

import { cn } from '@gremorie/rx-core';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../chart/chart';
import type { ChartDatum } from '../chart/types';

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
  /** Show the numeric value axis (left Y when vertical, bottom X when horizontal). */
  yAxis?: boolean;
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
 * The primitive is **complete**: the numeric value axis is available via
 * `yAxis` (on by default), horizontal/stacked layouts, labels and per-bar
 * colors. Consumers (e.g. the chart artifact) turn options off as needed.
 *
 * @example
 * ```tsx
 * <BarChart data={data} config={{ desktop: { label: "Desktop", color: "var(--chart-1)" } }} xKey="month" />
 * <BarChart data={data} config={config} xKey="month" yAxis={false} stacked />
 * ```
 */
export function BarChart({
  data,
  config,
  xKey,
  stacked = false,
  horizontal = false,
  yAxis = true,
  showLabels = false,
  tooltip = true,
  radius = 8,
  className,
}: BarChartProps) {
  const keys = Object.keys(config).filter((k) => k !== xKey);
  const single = keys.length <= 1;
  const perRowFill = single && data.some((d) => 'fill' in d);

  /**
   * Round only the OUTER corners of a stack (so segments don't read as
   * separate pills). Single series → all four corners. Recharts radius array
   * is [topLeft, topRight, bottomRight, bottomLeft].
   */
  const segRadius = (i: number): number | [number, number, number, number] => {
    if (!stacked || single) return radius;
    if (horizontal) {
      if (i === 0) return [radius, 0, 0, radius]; // leftmost (stack base)
      if (i === keys.length - 1) return [0, radius, radius, 0]; // rightmost (stack top)
      return 0;
    }
    if (i === 0) return [0, 0, radius, radius]; // bottom of stack
    if (i === keys.length - 1) return [radius, radius, 0, 0]; // top of stack
    return 0;
  };

  return (
    <ChartContainer config={config} className={cn(className)}>
      <RechartsBarChart
        accessibilityLayer
        data={data as ChartDatum[]}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{
          top: showLabels && !horizontal ? 20 : 8,
          right: 12,
          left: yAxis && !horizontal ? 0 : 12,
          bottom: 0,
        }}
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
            <XAxis
              dataKey={keys[0]}
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              hide={!yAxis}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={xKey}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            {yAxis ? (
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={40}
              />
            ) : null}
          </>
        )}
        {tooltip ? (
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        ) : null}
        {keys.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            fill={`var(--color-${key})`}
            radius={segRadius(i)}
            stackId={stacked ? 'a' : undefined}
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
                position={horizontal ? 'right' : 'top'}
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
