'use client';

import { cn } from '@gremorie/rx-core';
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RechartsRadarChart,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../chart/chart';
import {
  ChartDataTable,
  ChartLegendList,
  paletteColor,
  seriesViews,
} from '../chart/chart-data-table';
import type { ChartDatum } from '../chart/types';

export type RadarFill = 'auto' | 'on' | 'off';

export interface RadarChartProps {
  /** Tabular rows — one spoke per row. */
  data: readonly ChartDatum[];
  /** Maps each value field to a label + color. One entry per series. */
  config: ChartConfig;
  /** Spoke (angle) field. */
  xKey: string;
  /** Grid shape. */
  gridType?: 'polygon' | 'circle';
  /**
   * Polygon fill. `auto` fills a lone series and outlines two or more: stacked
   * translucent fills turn muddy fast, so past one series the outline carries
   * the shape. `on` / `off` force it either way.
   */
  fill?: RadarFill;
  /**
   * Draw a dot at every vertex. The hovered spoke always gets a larger dot
   * regardless, so turning this on reads as the dots growing under the pointer.
   */
  dots?: boolean;
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
  gridType = 'polygon',
  fill = 'auto',
  dots = false,
  tooltip = true,
  className,
}: RadarChartProps) {
  const keys = Object.keys(config).filter((k) => k !== xKey);
  const single = keys.length <= 1;
  const filled = fill === 'on' || (fill === 'auto' && single);
  // A lone filled polygon can take a heavy 0.6 and carries its own edge, so it
  // needs no stroke; overlapping fills cannot, so forcing `on` past one series
  // drops to 0.2 and keeps the 2px outline doing the work.
  const fillOpacity = filled ? (single ? 0.6 : 0.2) : 0;
  const strokeWidth = filled && single ? 0 : 2;
  const series = seriesViews(config, keys);
  const ariaLabel = `Radar chart of ${series
    .map((s) => s.labelText)
    .join(', ')} by ${xKey}`;
  const legend = series.map((s, i) => ({
    name: s.header,
    color: config[s.key]?.color ?? paletteColor(i),
  }));

  return (
    <div
      data-slot="radar-chart"
      role="img"
      aria-label={ariaLabel}
      className={cn(
        'flex w-full flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground',
        className,
      )}
    >
      <ChartContainer
        config={config}
        className="mx-auto aspect-square max-h-[280px] w-full"
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
              fillOpacity={fillOpacity}
              dot={dots}
              stroke={`var(--color-${key})`}
              strokeWidth={strokeWidth}
            />
          ))}
        </RechartsRadarChart>
      </ChartContainer>
      <ChartLegendList items={legend} />
      <ChartDataTable
        caption={ariaLabel}
        labelKey={xKey}
        columns={series}
        data={data}
      />
    </div>
  );
}
