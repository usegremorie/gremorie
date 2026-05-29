import { cn } from "@gremorie/rx-core";
import { ChartFrame } from "../headless/chart-frame";
import { Pie } from "../headless/pie";
import type { Datum } from "../headless/types";

export interface PieChartProps {
  data: readonly Datum[];
  nameKey: string;
  valueKey: string;
  donut?: boolean;
  className?: string;
}

const colorAt = (i: number) => `var(--chart-${(i % 5) + 1})`;

/**
 * Styled pie / donut chart. `nameKey` is the slice label field, `valueKey` the
 * numeric value field. Slice colors cycle through the `--chart-1..5` tokens.
 * Set `donut` for a donut.
 *
 * @example
 * ```tsx
 * <PieChart data={data} nameKey="browser" valueKey="visitors" donut />
 * ```
 */
export function PieChart({
  data,
  nameKey,
  valueKey,
  donut = false,
  className,
}: PieChartProps) {
  const ariaLabel = `${
    donut ? "Donut" : "Pie"
  } chart of ${valueKey} by ${nameKey}`;

  const legend = data.map((row, i) => ({
    name: String(row[nameKey]),
    color: colorAt(i),
  }));

  return (
    <figure
      role="img"
      aria-label={ariaLabel}
      data-slot="pie-chart"
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
        <Pie valueKey={valueKey} innerRadiusRatio={donut ? 0.6 : 0}>
          {({ slices }) =>
            slices.map((s) => (
              <path
                key={s.name}
                d={s.d}
                fill={colorAt(s.index)}
                stroke="var(--background)"
                strokeWidth={2}
              />
            ))
          }
        </Pie>
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
