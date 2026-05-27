import * as React from "react";
import { useChart } from "./chart-context";
import { linePath } from "./shape";
import type { Datum } from "./types";

/** Pure: project data through the scales into a line `d` string. */
export function computeLinePath(
  data: readonly Datum[],
  xKey: string,
  yKey: string,
  xScale: (v: string) => number,
  yScale: (v: number) => number
): string {
  if (data.length === 0) return "";
  return linePath(
    data.map((d) => ({
      x: xScale(String(d[xKey])),
      y: yScale(Number(d[yKey])),
    }))
  );
}

export interface LineProps
  extends Omit<React.SVGProps<SVGPathElement>, "stroke" | "d" | "fill"> {
  dataKey: string;
  color?: string;
}

/**
 * Renders a stroked line for one series on a `<path>` inside a `<ChartFrame>`.
 * Self-registers its values so the frame's shared Y domain includes this series.
 *
 * @example `<Line dataKey="sales" color="var(--chart-1)" />`
 */
export function Line({
  dataKey,
  color = "currentColor",
  ...pathProps
}: LineProps) {
  const ctx = useChart();

  React.useEffect(() => {
    ctx.register({
      key: dataKey,
      values: () => ctx.data.map((row) => Number(row[dataKey])),
    });
    return () => ctx.unregister(dataKey);
  }, [dataKey, ctx.register, ctx.unregister, ctx]);

  const d = computeLinePath(ctx.data, ctx.xKey, dataKey, ctx.xScale, ctx.yScale);

  return (
    <path
      data-slot="line"
      fill="none"
      d={d}
      stroke={color}
      {...pathProps}
    />
  );
}
