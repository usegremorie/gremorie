import { cn } from "@gremorie/rx-core";
import { Area } from "../headless/area";
import { CartesianGrid } from "../headless/cartesian-grid";
import { ChartFrame } from "../headless/chart-frame";
import { XAxis, YAxis } from "../headless/axis";
import type { ChartConfig, Datum } from "../headless/types";

export interface AreaChartProps {
  data: readonly Datum[];
  config: ChartConfig;
  xKey: string;
  className?: string;
}

/**
 * Styled area chart. Pass tabular `data`, a serializable `config` mapping each
 * value field to a label + token color, and the `xKey` category field.
 *
 * @example
 * ```tsx
 * <AreaChart data={data} config={config} xKey="month" />
 * ```
 */
export function AreaChart({
  data,
  config,
  xKey,
  className,
}: AreaChartProps) {
  const series = Object.entries(config).map(([key, entry]) => ({
    key,
    label: entry.label,
    color: entry.color,
  }));

  const ariaLabel = `Area chart of ${series
    .map((s) => s.label)
    .join(", ")} by ${xKey}`;

  return (
    <figure
      role="img"
      aria-label={ariaLabel}
      data-slot="area-chart"
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

        {series.map((s) => (
          <Area
            key={s.key}
            dataKey={s.key}
            color={s.color}
            stroke={s.color}
            strokeWidth={2}
            fillOpacity={0.2}
          />
        ))}

        <XAxis>
          {({ ticks, labelY }) =>
            ticks.map((t) => (
              <text
                key={t.label}
                x={t.x}
                y={labelY}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {t.label}
              </text>
            ))
          }
        </XAxis>

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
