import * as React from "react";
import { arc as d3Arc, pie as d3Pie, type PieArcDatum } from "d3-shape";
import { useChart } from "./chart-context";
import { polarLayout } from "./polar";

export interface PieSlice {
  d: string;
  index: number;
  name: string;
  value: number;
}

export interface PieGeometry {
  slices: PieSlice[];
  transform: string;
}

/**
 * Hook: compute pie/donut slices.
 *
 * Slice value comes from `valueKey`; slice name from the frame's `xKey`.
 * Set `innerRadiusRatio` > 0 for a donut. Apply the returned `transform`
 * to the host `<g>` so the pie is centered.
 */
export function usePie(valueKey: string, innerRadiusRatio = 0): PieGeometry {
  const ctx = useChart();

  const layout = polarLayout(ctx.width, ctx.height, 8);
  const transform = `translate(${layout.cx},${layout.cy})`;

  const data = ctx.data;
  const nameKey = ctx.xKey;
  const values = data.map((d) => Number(d[valueKey]));
  const arcs = d3Pie<number>().sort(null)(values);
  const radius = layout.radius;
  const gen = d3Arc<PieArcDatum<number>>()
    .innerRadius(radius * innerRadiusRatio)
    .outerRadius(radius);

  const slices: PieSlice[] = arcs.map((a, i) => ({
    d: gen(a) ?? "",
    index: i,
    name: String(data[i]?.[nameKey] ?? ""),
    value: values[i],
  }));

  return { slices, transform };
}

export interface PieProps {
  /** Numeric field for slice values. */
  valueKey: string;
  /** 0 = full pie; e.g. 0.6 = donut with a hole at 60% of the radius. */
  innerRadiusRatio?: number;
  /** Render slices. */
  children?: (geom: PieGeometry) => React.ReactNode;
}

/**
 * Component variant of usePie. Renders a `<g>` translated to the pie center
 * and calls `children(geometry)` with slices ready to render as `<path>`s.
 */
export function Pie({ valueKey, innerRadiusRatio = 0, children }: PieProps) {
  const geom = usePie(valueKey, innerRadiusRatio);
  return (
    <g data-slot="pie" transform={geom.transform}>
      {children ? children(geom) : null}
    </g>
  );
}
