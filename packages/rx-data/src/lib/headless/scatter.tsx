import * as React from "react";
import { useChart } from "./chart-context";
import { linearScale } from "./scales";

export interface ScatterPoint {
  cx: number;
  cy: number;
}

export interface ScatterXTick {
  x: number;
  label: string;
}

export interface ScatterGeometry {
  points: ScatterPoint[];
  xTicks: ScatterXTick[];
  labelY: number;
}

/**
 * Hook variant: register a scatter series and return its points, X tick
 * positions, and a Y baseline for tick labels.
 *
 * X uses a linear scale over the data's X extent; Y uses the shared scale.
 * Self-registers Y values for the shared domain.
 */
export function useScatter(dataKey: string): ScatterGeometry {
  const ctx = useChart();

  React.useEffect(() => {
    ctx.register({
      key: dataKey,
      values: () => ctx.data.map((row) => Number(row[dataKey])),
    });
    return () => ctx.unregister(dataKey);
  }, [dataKey, ctx.register, ctx.unregister, ctx]);

  const xs = ctx.data.map((d) => Number(d[ctx.xKey]));
  const lo = xs.length ? Math.min(...xs) : 0;
  const hi = xs.length ? Math.max(...xs) : 1;
  const xScale = linearScale(lo === hi ? [lo, lo + 1] : [lo, hi], [
    ctx.plotLeft,
    ctx.plotRight,
  ]);

  const yScale = ctx.yScale;
  const points: ScatterPoint[] = ctx.data.map((d) => ({
    cx: xScale(Number(d[ctx.xKey])),
    cy: yScale(Number(d[dataKey])),
  }));

  let xTicks: ScatterXTick[] = [];
  if (xs.length > 0) {
    const values = lo === hi ? [lo] : [lo, (lo + hi) / 2, hi];
    xTicks = values.map((v) => ({ x: xScale(v), label: String(Math.round(v)) }));
  }

  const labelY = ctx.plotBottom + 16;

  return { points, xTicks, labelY };
}

export interface ScatterProps {
  dataKey: string;
  color?: string;
  /** Render geometry for this series. */
  children?: (geom: ScatterGeometry) => React.ReactNode;
}

/**
 * Component variant of useScatter. Renders a `<g>` and calls
 * `children(geometry)` with the computed points and X ticks.
 *
 * @example
 * ```tsx
 * <Scatter dataKey="score">
 *   {({ points }) => points.map((p, i) => <circle key={i} cx={p.cx} cy={p.cy} r={4} />)}
 * </Scatter>
 * ```
 */
export function Scatter({ dataKey, children }: ScatterProps) {
  const geom = useScatter(dataKey);
  return <g data-slot="scatter">{children ? children(geom) : null}</g>;
}
