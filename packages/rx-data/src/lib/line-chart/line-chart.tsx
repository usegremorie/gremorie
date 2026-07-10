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
import { ChartDataTable, seriesViews } from '../chart/chart-data-table';
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
  const series = seriesViews(config, keys);
  const ariaLabel = `Line chart of ${series
    .map((s) => s.labelText)
    .join(', ')} by ${xKey}`;

  return (
    <>
      <ChartContainer
        role="img"
        aria-label={ariaLabel}
        config={config}
        className={cn(
          'flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-card-foreground',
          className,
        )}
      >
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
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width="auto"
            />
          ) : null}
          {tooltip ? (
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
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
      <ChartDataTable
        caption={ariaLabel}
        labelKey={xKey}
        columns={series}
        data={data}
      />
    </>
  );
}
