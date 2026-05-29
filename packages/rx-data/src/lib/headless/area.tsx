import * as React from "react";
import { useChart } from "./chart-context";
import { areaPath } from "./shape";
import type { Datum } from "./types";

/** Pure: project data through the scales into an area `d` string. */
export function computeAreaPath(
  data: readonly Datum[],
  xKey: string,
  yKey: string,
  xScale: (v: string) => number,
  yScale: (v: number) => number,
  baseline: number
): string {
  if (data.length === 0) return "";
  const points = data.map((d) => ({
    x: xScale(String(d[xKey])),
    y: yScale(Number(d[yKey])),
  }));
  return areaPath(points, baseline);
}

export interface AreaProps
  extends Omit<React.SVGProps<SVGPathElement>, "fill" | "d"> {
  /** Data field this area represents. */
  dataKey: string;
  color?: string;
  fillOpacity?: number;
}

/**
 * Renders a filled area for one series on a `<path>` inside a `<ChartFrame>`.
 * Self-registers its values so the frame's shared Y domain includes this series.
 *
 * @example `<Area dataKey="sales" color="var(--chart-1)" />`
 */
export function Area({
  dataKey,
  color = "currentColor",
  fillOpacity = 0.25,
  ...pathProps
}: AreaProps) {
  const ctx = useChart();
  const { register, unregister, data: ctxData } = ctx;

  // Self-register values for the shared Y domain. We register before paint
  // so the domain is correct on first render. See bar.tsx for why ctx must
  // NOT be in the effect deps - it causes register/unregister to loop.
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

  const d = computeAreaPath(
    ctx.data,
    ctx.xKey,
    dataKey,
    ctx.xScale,
    ctx.yScale,
    ctx.yScale(0)
  );

  return (
    <path
      data-slot="area"
      d={d}
      fill={color}
      fillOpacity={fillOpacity}
      {...pathProps}
    />
  );
}
