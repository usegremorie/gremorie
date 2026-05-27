import { cn } from "@gremorie/rx-core";
import { CartesianGrid } from "../headless/cartesian-grid";
import { ChartFrame } from "../headless/chart-frame";
import { Scatter } from "../headless/scatter";
import { YAxis } from "../headless/axis";
import type { ChartConfig, Datum } from "../headless/types";

export interface ScatterChartProps {
  data: readonly Datum[];
  config: ChartConfig;
  xKey: string;
  className?: string;
}

/**
 * Styled scatter chart. `xKey` is a numeric field (linear X axis); each entry
 * in `config` is a numeric Y series. Pass tabular `data`.
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
  className,
}: ScatterChartProps) {
  const series = Object.entries(config).map(([key, entry]) => ({
    key,
    label: entry.label,
    color: entry.color,
  }));

  const ariaLabel = `Scatter chart of ${series
    .map((s) => s.label)
    .join(", ")} against ${xKey}`;

  return (
    <figure
      role="img"
      aria-label={ariaLabel}
      data-slot="scatter-chart"
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-card-foreground",
        className
      )}
    >
      <ChartFrame
        data={data}
        xKey={xKey}
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
                strokeOpacity={0.15}
              />
            ))
          }
        </CartesianGrid>

        {series.map((s, i) => (
          <Scatter key={s.key} dataKey={s.key}>
            {({ points, xTicks, labelY }) => (
              <>
                {points.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.cx}
                    cy={p.cy}
                    r={4}
                    fill={s.color}
                    fillOpacity={0.7}
                  />
                ))}
                {i === 0 &&
                  xTicks.map((t) => (
                    <text
                      key={t.label}
                      x={t.x}
                      y={labelY}
                      textAnchor="middle"
                      className="fill-muted-foreground text-[10px]"
                    >
                      {t.label}
                    </text>
                  ))}
              </>
            )}
          </Scatter>
        ))}

        <YAxis>
          {({ ticks, labelX }) =>
            ticks.map((t) => (
              <text
                key={t.value}
                x={labelX}
                y={t.y}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {t.label}
              </text>
            ))
          }
        </YAxis>
      </ChartFrame>

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
