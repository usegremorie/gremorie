"use client";

import { useState } from "react";

import { cn } from "@gremorie/rx-core";

import { XAxis, YAxis } from "../headless/axis";
import { Bar } from "../headless/bar";
import { CartesianGrid } from "../headless/cartesian-grid";
import { useChart } from "../headless/chart-context";
import { ChartFrame } from "../headless/chart-frame";
import { colorAt } from "../headless/palette";
import { bandScale } from "../headless/scales";
import { barTopRoundedPath } from "../headless/shape";
import type { ChartConfig, Datum, Margin } from "../headless/types";

export type BarColorMode = "series" | "categorical";
export type BarAxis = "xy" | "x" | "none";

export interface BarChartProps {
  /** Tabular rows. */
  data: readonly Datum[];
  /** Maps each value field to a label + token color. One entry = one series. */
  config: ChartConfig;
  /** Category field (x axis). */
  xKey: string;
  /**
   * `series` (default) colors all bars of a field with its config color and
   * groups multiple series side-by-side. `categorical` colors each *bar* with
   * the next chart token (`--chart-1…5`) — best for a single series.
   */
  colorMode?: BarColorMode;
  /** Hover tooltip + cursor band. */
  tooltip?: boolean;
  /** Which axes to draw. `x` hides the Y axis (shadcn look); `none` hides both. */
  axis?: BarAxis;
  /** Top-corner radius of the bars. */
  barRadius?: number;
  /** Card chrome (border / surface / padding). Turn off to embed (e.g. in an artifact). */
  chrome?: boolean;
  /** Value formatter for the tooltip. */
  formatValue?: (n: number) => string;
  className?: string;
}

interface Series {
  key: string;
  label: string;
  color: string;
}

interface HoverState {
  i: number;
  cx: number;
  top: number;
}

const MARGINS: Record<BarAxis, Margin> = {
  xy: { top: 16, right: 12, bottom: 24, left: 36 },
  x: { top: 16, right: 12, bottom: 24, left: 12 },
  none: { top: 12, right: 12, bottom: 12, left: 12 },
};

/** Transparent per-category hit areas + the value-top, for the tooltip. */
function HoverCapture({
  valueKeys,
  onHover,
}: {
  valueKeys: string[];
  onHover: (h: HoverState | null) => void;
}) {
  const ctx = useChart();
  const cats = ctx.data.map((d) => String(d[ctx.xKey]));
  const band = bandScale(cats, [ctx.plotLeft, ctx.plotRight], 0.2);
  return (
    <g onMouseLeave={() => onHover(null)}>
      {ctx.data.map((d, i) => {
        const bx = band(cats[i]);
        const top = Math.min(
          ...valueKeys.map((k) => ctx.yScale(Number(d[k])))
        );
        return (
          <rect
            key={i}
            x={bx}
            y={ctx.plotTop}
            width={band.bandwidth}
            height={ctx.plotBottom - ctx.plotTop}
            fill="transparent"
            onMouseEnter={() => onHover({ i, cx: bx + band.bandwidth / 2, top })}
          />
        );
      })}
    </g>
  );
}

/** Faint band behind the hovered category — the shadcn "cursor". */
function Cursor({ index }: { index: number | null }) {
  const ctx = useChart();
  if (index == null) return null;
  const cats = ctx.data.map((d) => String(d[ctx.xKey]));
  const band = bandScale(cats, [ctx.plotLeft, ctx.plotRight], 0.2);
  return (
    <rect
      x={band(cats[index])}
      y={ctx.plotTop}
      width={band.bandwidth}
      height={ctx.plotBottom - ctx.plotTop}
      rx={6}
      fill="currentColor"
      fillOpacity={0.08}
    />
  );
}

/**
 * Styled bar chart over the headless engine. Top-rounded bars, an optional
 * hover tooltip + cursor band, `series` or `categorical` colors, and optional
 * axes / card chrome. Turn `chrome` off and pass `colorMode="categorical"` to
 * embed it inside a card or artifact.
 *
 * @example
 * ```tsx
 * <BarChart data={data} config={config} xKey="month" />
 * <BarChart data={data} config={config} xKey="dept" colorMode="categorical" axis="x" chrome={false} />
 * ```
 */
export function BarChart({
  data,
  config,
  xKey,
  colorMode = "series",
  tooltip = true,
  axis = "xy",
  barRadius = 4,
  chrome = true,
  formatValue = (n) => n.toLocaleString(),
  className,
}: BarChartProps) {
  const [hover, setHover] = useState<HoverState | null>(null);

  const series: Series[] = Object.entries(config).map(([key, entry]) => ({
    key,
    label: entry.label,
    color: entry.color,
  }));
  const categorical = colorMode === "categorical";
  const valueKeys = categorical ? series.slice(0, 1) : series;
  const ariaLabel = `Bar chart of ${series
    .map((s) => s.label)
    .join(", ")} by ${xKey}`;
  const above = hover ? hover.top >= 60 : true;

  const body = (
    <div className="relative">
      <ChartFrame
        data={data}
        xKey={xKey}
        margin={MARGINS[axis]}
        className="aspect-video w-full overflow-visible text-muted-foreground"
      >
        <CartesianGrid>
          {(lines) =>
            lines.map((l, i) => (
              <line
                key={i}
                x1={l.x1}
                x2={l.x2}
                y1={l.y}
                y2={l.y}
                stroke="currentColor"
                strokeOpacity={0.1}
              />
            ))
          }
        </CartesianGrid>

        {tooltip ? <Cursor index={hover?.i ?? null} /> : null}

        {valueKeys.map((s) => (
          <Bar key={s.key} dataKey={s.key}>
            {(rects) =>
              rects.map((r, i) => (
                <path
                  key={i}
                  d={barTopRoundedPath(r.x, r.y, r.width, r.height, barRadius)}
                  fill={categorical ? colorAt(i) : s.color}
                />
              ))
            }
          </Bar>
        ))}

        {axis !== "none" ? (
          <XAxis>
            {({ ticks, labelY }) =>
              ticks.map((t) => (
                <text
                  key={t.label}
                  x={t.x}
                  y={labelY}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[11px]"
                >
                  {t.label}
                </text>
              ))
            }
          </XAxis>
        ) : null}

        {axis === "xy" ? (
          <YAxis>
            {({ ticks, labelX }) =>
              ticks.map((t) => (
                <text
                  key={t.value}
                  x={labelX}
                  y={t.y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-[11px]"
                >
                  {t.label}
                </text>
              ))
            }
          </YAxis>
        ) : null}

        {tooltip ? (
          <HoverCapture
            valueKeys={valueKeys.map((s) => s.key)}
            onHover={setHover}
          />
        ) : null}
      </ChartFrame>

      {tooltip && hover ? (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-10 min-w-32 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-md"
          style={{
            left: hover.cx,
            top: above ? hover.top - 10 : hover.top + 10,
            transform: `translate(-50%, ${above ? "-100%" : "0"})`,
          }}
        >
          <div className="mb-1 font-medium text-foreground">
            {String(data[hover.i][xKey])}
          </div>
          {valueKeys.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-[3px]"
                style={{
                  backgroundColor: categorical ? colorAt(hover.i) : s.color,
                }}
              />
              <span className="text-muted-foreground">{s.label}</span>
              <span className="ml-3 font-medium tabular-nums text-foreground">
                {formatValue(Number(data[hover.i][s.key]))}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <table className="sr-only">
        <caption>{ariaLabel}</caption>
        <thead>
          <tr>
            <th>{xKey}</th>
            {series.map((s) => (
              <th key={s.key}>{s.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row[xKey]}</td>
              {series.map((s) => (
                <td key={s.key}>{row[s.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!chrome) {
    return (
      <div role="img" aria-label={ariaLabel} className={cn("m-0", className)}>
        {body}
      </div>
    );
  }

  return (
    <figure
      role="img"
      aria-label={ariaLabel}
      data-slot="bar-chart"
      className={cn(
        "m-0 flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-card-foreground",
        className
      )}
    >
      {body}
    </figure>
  );
}
