import * as React from "react";
import { cn } from "@gremorie/rx-core";
import { ChartFrame } from "../headless/chart-frame";
import { RadialBar } from "../headless/radial-bar";
import type { Datum } from "../headless/types";

export interface RadialChartProps {
  data: readonly Datum[];
  nameKey: string;
  valueKey: string;
  className?: string;
}

const colorAt = (i: number) => `var(--chart-${(i % 5) + 1})`;

/**
 * Styled radial bar chart - one concentric ring per data row (`nameKey`), each
 * sweep proportional to its `valueKey` value. Colors cycle `--chart-1..5`.
 *
 * @example
 * ```tsx
 * <RadialChart data={data} nameKey="browser" valueKey="visitors" />
 * ```
 */
export function RadialChart({
  data,
  nameKey,
  valueKey,
  className,
}: RadialChartProps) {
  const ariaLabel = `Radial bar chart of ${valueKey} by ${nameKey}`;

  const legend = data.map((row, i) => ({
    name: String(row[nameKey]),
    color: colorAt(i),
  }));

  return (
    <figure
      role="img"
      aria-label={ariaLabel}
      data-slot="radial-chart"
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground",
        className
      )}
    >
      <ChartFrame
        data={data}
        xKey={nameKey}
        className="mx-auto aspect-square max-h-[260px] w-full overflow-visible text-muted-foreground"
      >
        <RadialBar valueKey={valueKey}>
          {({ arcs }) =>
            arcs.map((a) => (
              <React.Fragment key={a.name}>
                <path d={a.track} fill="currentColor" fillOpacity={0.08} />
                <path d={a.d} fill={colorAt(a.index)} />
              </React.Fragment>
            ))
          }
        </RadialBar>
      </ChartFrame>

      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {legend.map((item) => (
          <li key={item.name} className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-[2px]"
              style={{ background: item.color }}
            />
            {item.name}
          </li>
        ))}
      </ul>

      <table className="sr-only">
        <caption>{ariaLabel}</caption>
        <thead>
          <tr>
            <th>{nameKey}</th>
            <th>{valueKey}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row[nameKey]}</td>
              <td>{row[valueKey]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
