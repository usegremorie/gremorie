'use client';

import { cn } from '@gremorie/rx-core';
import { LabelList, Pie, PieChart as RechartsPieChart } from 'recharts';

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
} from '../chart/chart-data-table';
import type { ChartDatum } from '../chart/types';

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
  /** Big figure in the donut hole, e.g. a total. Needs `donut`. */
  centerValue?: string;
  /** Caption under `centerValue`, e.g. "spent this month". */
  centerLabel?: string;
  /** Draw the chart's own card frame. Turn off when it sits inside a Card. */
  framed?: boolean;
  /** Show the color legend. Turn off when the page already lists the slices. */
  legend?: boolean;
  className?: string;
}

/**
 * Pie / donut chart — recharts + the `chart` primitives. Slice colors
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
  centerValue,
  centerLabel,
  framed = true,
  legend: showLegend = true,
  className,
}: PieChartProps) {
  const ariaLabel = `${donut ? 'Donut' : 'Pie'} chart of ${dataKey} by ${nameKey}`;
  const legend = data.map((row, i) => ({
    name: String(row[nameKey]),
    color: row.fill ?? paletteColor(i),
  }));

  return (
    <div
      data-slot="pie-chart"
      role="img"
      aria-label={ariaLabel}
      className={cn(
        'flex w-full flex-col gap-3',
        framed &&
          'rounded-xl border border-border bg-card p-4 text-card-foreground',
        className,
      )}
    >
      <div className="relative">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[260px] w-full"
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
        {donut && (centerValue || centerLabel) ? (
          <div
            data-slot="pie-chart-center"
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center"
          >
            {centerValue ? (
              <span className="text-2xl font-semibold tabular-nums">
                {centerValue}
              </span>
            ) : null}
            {centerLabel ? (
              <span className="text-xs text-muted-foreground">
                {centerLabel}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
      {showLegend ? <ChartLegendList items={legend} /> : null}
      <ChartDataTable
        caption={ariaLabel}
        labelKey={nameKey}
        columns={[{ key: dataKey, header: dataKey }]}
        data={data}
      />
    </div>
  );
}
