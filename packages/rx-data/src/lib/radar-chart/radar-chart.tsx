'use client';

import { cn } from '@gremorie/rx-core';
import {
  PolarAngleAxis,
  PolarRadiusAxis,
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

/**
 * Roughly how wide a character is at the 10px label size. Measuring text means
 * rendering it; this is close enough to turn a pixel budget into a character
 * budget, and matches the Angular edition's constant so both wrap alike.
 */
const CHAR_WIDTH = 5.5;
const LINE_HEIGHT = 11;

/** Break a label on word boundaries — SVG text does not wrap on its own. */
function wrapLabel(label: string, maxChars: number): string[] {
  if (maxChars <= 0 || label.length <= maxChars) return [label];
  const lines: string[] = [];
  let line = '';
  for (const word of label.split(/\s+/)) {
    if (!line) line = word;
    else if (line.length + 1 + word.length <= maxChars) line += ` ${word}`;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

type PolarTickProps = {
  x?: number;
  y?: number;
  textAnchor?: 'start' | 'middle' | 'end' | 'inherit';
  payload?: { value?: string | number };
};

/**
 * A PolarAngleAxis tick that wraps. recharts already anchors by side; it just
 * draws the label as a single run, so an eleven-spoke chart with sentence-long
 * category names overlaps itself.
 */
function wrappedTick(width: number) {
  const maxChars = Math.floor(width / CHAR_WIDTH);
  return function WrappedTick({ x, y, textAnchor, payload }: PolarTickProps) {
    const lines = wrapLabel(String(payload?.value ?? ''), maxChars);
    const shift = (-(lines.length - 1) * LINE_HEIGHT) / 2;
    return (
      <text
        x={x}
        y={y}
        textAnchor={textAnchor}
        dominantBaseline="middle"
        className="fill-muted-foreground text-[10px]"
      >
        {lines.map((line, i) => (
          <tspan key={line} x={x} dy={i === 0 ? shift : LINE_HEIGHT}>
            {line}
          </tspan>
        ))}
      </text>
    );
  };
}

/**
 * A PolarRadiusAxis tick nudged off the vertical. Left centred, recharts draws
 * the outermost value directly under the spoke label above it — `100` lands on
 * `Speed`. The Angular edition offsets by the same 6px.
 */
function RadiusTick({ x, y, payload }: PolarTickProps) {
  return (
    <text
      x={(x ?? 0) - 6}
      y={y}
      textAnchor="end"
      dominantBaseline="middle"
      className="fill-muted-foreground text-[10px]"
    >
      {Number(payload?.value ?? 0).toLocaleString()}
    </text>
  );
}

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
  /**
   * Top of the radial scale. Pinned by default so two charts are read against
   * one ruler: with a derived scale someone whose best score is 70 fills the
   * plot exactly like someone who scored 100. Raise it for data that goes past
   * 100, or the polygons draw outside the outer ring.
   */
  max?: number;
  /** Number of grid rings, and of ticks on the radius axis. */
  ticks?: number;
  /**
   * Wrap spoke labels to this width in pixels. Omit and each label is one run,
   * which a long one at the side of the circle draws halfway across the plot.
   */
  labelWidth?: number;
  /** Label each ring with its value, up the vertical axis. */
  radiusAxis?: boolean;
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
  max = 100,
  ticks = 4,
  labelWidth,
  radiusAxis = false,
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
          <PolarAngleAxis
            dataKey={xKey}
            /* Default 8 leaves the outermost radius tick sitting on the spoke
               label above it — `100` lands on `Speed`. 18 clears it, and the
               Angular edition places its labels at the same distance. */
            tickSize={18}
            // recharts types `tick` narrowly; a component is valid at runtime.
            tick={
              labelWidth
                ? (wrappedTick(labelWidth) as unknown as boolean)
                : undefined
            }
          />
          {/* The radius axis drives the grid: recharts derives PolarGrid's
              rings from its ticks, so `ticks` controls both. It is always
              mounted — `tick={false}` keeps the ring count without drawing the
              numbers — otherwise `domain` and `ticks` would silently do
              nothing unless `radiusAxis` were on. */}
          <PolarRadiusAxis
            domain={[0, max]}
            /* Explicit ticks rather than a count: `tickCount` includes zero,
               which puts a `0` on the centre point where there is no ring to
               label, and the Angular edition — whose rings start at 1/n — has
               none. Listing them keeps both editions on the same values. */
            ticks={
              Array.from(
                { length: Math.max(1, Math.floor(ticks)) },
                (_, i) => ((i + 1) * max) / Math.max(1, Math.floor(ticks)),
              ) as unknown as never
            }
            angle={90}
            axisLine={false}
            // recharts types `tick` narrowly; a component is valid at runtime.
            tick={radiusAxis ? (RadiusTick as unknown as boolean) : false}
          />
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
