import * as React from "react";
import { cn } from "@gremorie/rx-core";
import { ChartFrame } from "../headless/chart-frame";
import { Radar } from "../headless/radar";
import type { ChartConfig, Datum } from "../headless/types";

export interface RadarChartProps {
  data: readonly Datum[];
  config: ChartConfig;
  xKey: string;
  className?: string;
}

/**
 * Styled radar chart. Each data row (`xKey`) becomes a spoke; each entry in
 * `config` becomes a closed series polygon sharing one radial max.
 *
 * @example
 * ```tsx
 * <RadarChart data={data} config={config} xKey="metric" />
 * ```
 */
export function RadarChart({
  data,
  config,
  xKey,
  className,
}: RadarChartProps) {
  const series = Object.entries(config).map(([key, entry]) => ({
    key,
    label: entry.label,
    color: entry.color,
  }));

  const ariaLabel = `Radar chart of ${series
    .map((s) => s.label)
    .join(", ")} by ${xKey}`;

  return (
    <figure
      role="img"
      aria-label={ariaLabel}
      data-slot="radar-chart"
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground",
        className
      )}
    >
      <ChartFrame
        data={data}
        xKey={xKey}
        className="mx-auto aspect-square max-h-[280px] w-full overflow-visible text-muted-foreground"
      >
        {series.map((s, i) => (
          <Radar key={s.key} dataKey={s.key} color={s.color}>
            {({ d, axes, rings, center }) => (
              <>
                {i === 0 && (
                  <>
                    {rings.map((ring, idx) => (
                      <path
                        key={idx}
                        d={ring}
                        fill="none"
                        stroke="currentColor"
                        strokeOpacity={0.12}
                      />
                    ))}
                    {axes.map((ax) => (
                      <React.Fragment key={ax.label}>
                        <line
                          x1={center.cx}
                          y1={center.cy}
                          x2={ax.x2}
                          y2={ax.y2}
                          stroke="currentColor"
                          strokeOpacity={0.12}
                        />
                        <text
                          x={ax.lx}
                          y={ax.ly}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-muted-foreground text-[10px]"
                        >
                          {ax.label}
                        </text>
                      </React.Fragment>
                    ))}
                  </>
                )}
                <path
                  d={d}
                  fill={s.color}
                  fillOpacity={0.2}
                  stroke={s.color}
                  strokeWidth={2}
                />
              </>
            )}
          </Radar>
        ))}
      </ChartFrame>

      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {series.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-[2px]"
              style={{ background: s.color }}
            />
            {s.label}
          </li>
        ))}
      </ul>

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
    </figure>
  );
}
