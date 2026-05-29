import * as React from "react";
import { useChart } from "./chart-context";
import { formatValue } from "./format";

/** Pure: `count` evenly spaced tick values from 0..max inclusive. */
export function computeTicks(max: number, count: number): number[] {
  if (max <= 0 || count <= 0) return [0];
  const step = max / count;
  return Array.from({ length: count + 1 }, (_, i) =>
    Math.round(i * step * 1e6) / 1e6
  );
}

export interface YTick {
  value: number;
  y: number;
  label: string;
}

export interface XTick {
  label: string;
  x: number;
}

export interface YAxisGeometry {
  ticks: YTick[];
  labelX: number;
}

export interface XAxisGeometry {
  ticks: XTick[];
  labelY: number;
}

/** Hook: Y axis ticks + pixel Y + formatted label, read from the context. */
export function useYAxis(count = 4, format = ""): YAxisGeometry {
  const ctx = useChart();
  const labelX = Math.max(0, ctx.plotLeft - 6);
  const [, max] = ctx.yDomain;
  const y = ctx.yScale;
  const ticks = computeTicks(max, count).map((value) => ({
    value,
    y: y(value),
    label: formatValue(value, format || "number"),
  }));
  return { ticks, labelX };
}

/** Hook: X axis tick positions + category labels, read from the context. */
export function useXAxis(): XAxisGeometry {
  const ctx = useChart();
  const labelY = ctx.plotBottom + 16;
  const x = ctx.xScale;
  const ticks = ctx.data
    .map((d) => String(d[ctx.xKey]))
    .map((label) => ({ label, x: x(label) }));
  return { ticks, labelY };
}

export interface YAxisProps {
  count?: number;
  format?: string;
  children?: (geom: YAxisGeometry) => React.ReactNode;
}

export interface XAxisProps {
  children?: (geom: XAxisGeometry) => React.ReactNode;
}

/** Component variant of useYAxis. Renders a `<g>` and calls `children(geom)`. */
export function YAxis({ count = 4, format = "", children }: YAxisProps) {
  const geom = useYAxis(count, format);
  return <g data-slot="y-axis">{children ? children(geom) : null}</g>;
}

/** Component variant of useXAxis. Renders a `<g>` and calls `children(geom)`. */
export function XAxis({ children }: XAxisProps) {
  const geom = useXAxis();
  return <g data-slot="x-axis">{children ? children(geom) : null}</g>;
}
