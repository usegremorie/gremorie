import * as React from "react";
import { arc as d3Arc } from "d3-shape";
import { useChart } from "./chart-context";
import { polarLayout } from "./polar";

export interface RadialArc {
  /** Value arc (sweep proportional to the value). */
  d: string;
  /** Full-circle track behind the value arc. */
  track: string;
  index: number;
  name: string;
  value: number;
}

export interface RadialBarGeometry {
  arcs: RadialArc[];
  transform: string;
}

interface ArcInput {
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
}

/**
 * Hook: compute concentric radial bars - one ring per data row, sweep
 * proportional to its `valueKey` value (relative to the largest value).
 * Apply the returned `transform` to center the host `<g>`.
 */
export function useRadialBar(valueKey: string): RadialBarGeometry {
  const ctx = useChart();

  const layout = polarLayout(ctx.width, ctx.height, 8);
  const transform = `translate(${layout.cx},${layout.cy})`;

  const data = ctx.data;
  const n = data.length;
  if (n === 0) {
    return { arcs: [], transform };
  }

  const nameKey = ctx.xKey;
  const values = data.map((d) => Number(d[valueKey]));
  const max = Math.max(...values, 1);
  const { radius } = layout;
  const band = radius / (n + 0.5);
  const gen = d3Arc<ArcInput>().cornerRadius(band * 0.35);

  const arcs: RadialArc[] = data.map((row, i) => {
    const outer = radius - band * i;
    const inner = outer - band * 0.7;
    const endAngle = (values[i] / max) * 2 * Math.PI;
    const base = { innerRadius: inner, outerRadius: outer, startAngle: 0 };
    return {
      d: gen({ ...base, endAngle }) ?? "",
      track: gen({ ...base, endAngle: 2 * Math.PI }) ?? "",
      index: i,
      name: String(row[nameKey]),
      value: values[i],
    };
  });

  return { arcs, transform };
}

export interface RadialBarProps {
  valueKey: string;
  children?: (geom: RadialBarGeometry) => React.ReactNode;
}

/**
 * Component variant of useRadialBar. Renders a `<g>` translated to the
 * chart center and calls `children(geometry)` with the arc paths.
 */
export function RadialBar({ valueKey, children }: RadialBarProps) {
  const geom = useRadialBar(valueKey);
  return (
    <g data-slot="radial-bar" transform={geom.transform}>
      {children ? children(geom) : null}
    </g>
  );
}
