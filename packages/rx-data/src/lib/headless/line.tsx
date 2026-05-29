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
  const { register, unregister, data: ctxData } = ctx;

  // See bar.tsx for the full explanation: depending on `ctx` here loops
  // forever (register -> bump -> new ctx -> effect re-runs -> unregister
  // -> bump -> ...). Capture data in a ref and depend only on the stable
  // register/unregister callbacks plus dataKey.
  const dataRef = React.useRef(ctxData);
  React.useEffect(() => {
    dataRef.current = ctxData;
  });

  React.useEffect(() => {
    register({
      key: dataKey,
      values: () => dataRef.current.map((row) => Number(row[dataKey])),
    });
    return () => unregister(dataKey);
  }, [dataKey, register, unregister]);

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
