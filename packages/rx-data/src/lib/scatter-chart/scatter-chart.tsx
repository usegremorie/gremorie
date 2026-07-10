'use client';

import { cn } from '@gremorie/rx-core';
import {
  CartesianGrid,
  Scatter,
  ScatterChart as RechartsScatterChart,
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

export interface ScatterChartProps {
  /** Tabular rows. */
  data: readonly ChartDatum[];
  /** Maps each Y value field to a label + color. One entry per series. */
  config: ChartConfig;
  /** Numeric X field (linear axis). */
  xKey: string;
  /** Show the numeric Y axis. */
  yAxis?: boolean;
  /** Hover tooltip. */
  tooltip?: boolean;
  className?: string;
}

/**
 * Scatter chart — recharts + the shadcn `chart` primitives. Each `config` entry
 * is a numeric Y series plotted against the numeric `xKey`. (shadcn ships no
 * scatter block; this follows the same composition pattern as the others.)
 *
 * @example
 * ```tsx
 * <ScatterChart data={data} config={config} xKey="weight" />
 * ```
 */
export function ScatterChart({
  data,
  config,
  xKey,
  yAxis = true,
  tooltip = true,
  className,
}: ScatterChartProps) {
  const keys = Object.keys(config).filter((k) => k !== xKey);
  const series = seriesViews(config, keys);
  const ariaLabel = `Scatter chart of ${series
    .map((s) => s.labelText)
    .join(', ')} against ${xKey}`;

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
        <RechartsScatterChart
          data={data as ChartDatum[]}
          margin={{ left: yAxis ? 0 : 12, right: 12, top: 8, bottom: 8 }}
        >
          <CartesianGrid />
          <XAxis
            dataKey={xKey}
            type="number"
            name={xKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width="auto"
            hide={!yAxis}
          />
          {tooltip ? (
            <ChartTooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={<ChartTooltipContent />}
            />
          ) : null}
          {keys.map((key) => (
            <Scatter
              key={key}
              name={key}
              data={data as ChartDatum[]}
              dataKey={key}
              fill={`var(--color-${key})`}
            />
          ))}
        </RechartsScatterChart>
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
