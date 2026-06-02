'use client';

import { cn } from '@gremorie/rx-core';
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
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

export interface LineChartProps {
  /** Tabular rows. */
  data: readonly ChartDatum[];
  /** Maps each value field to a label + color. One entry per series. */
  config: ChartConfig;
  /** Category field (x axis). */
  xKey: string;
  /** Curve interpolation (recharts `type`). */
  type?: 'natural' | 'monotone' | 'linear' | 'step';
  /** Show a dot at each point. */
  dots?: boolean;
  /** Show the numeric Y axis. */
  yAxis?: boolean;
  /** Hover tooltip. */
  tooltip?: boolean;
  className?: string;
}

/**
 * Line chart — recharts + the shadcn `chart` primitives. One `<Line>` per
 * `config` entry, stroked with `var(--color-<key>)`.
 *
 * @example
 * ```tsx
 * <LineChart data={data} config={config} xKey="month" />
 * ```
 */
export function LineChart({
  data,
  config,
  xKey,
  type = 'natural',
  dots = false,
  yAxis = true,
  tooltip = true,
  className,
}: LineChartProps) {
  const keys = Object.keys(config).filter((k) => k !== xKey);

  return (
    <ChartContainer config={config} className={cn(className)}>
      <RechartsLineChart
        accessibilityLayer
        data={data as ChartDatum[]}
        margin={{ left: yAxis ? 0 : 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        {yAxis ? (
          <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
        ) : null}
        {tooltip ? (
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel={keys.length <= 1} />}
          />
        ) : null}
        {keys.map((key) => (
          <Line
            key={key}
            dataKey={key}
            type={type}
            stroke={`var(--color-${key})`}
            strokeWidth={2}
            dot={dots}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );
}
