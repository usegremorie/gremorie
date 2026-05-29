import * as React from "react";
import { useChart } from "./chart-context";
import { polarLayout, polarPoint, polygonPath } from "./polar";

export interface RadarAxis {
  x2: number;
  y2: number;
  label: string;
  lx: number;
  ly: number;
}

export interface RadarGeometry {
  d: string;
  axes: RadarAxis[];
  rings: string[];
  center: { cx: number; cy: number; radius: number };
}

/**
 * Hook: register a radar series and return its polygon `d` plus shared
 * axes / rings (the same for every series in the same frame).
 *
 * Categories radiate as spokes (one per data row, by the frame's `xKey`);
 * the value maps to distance along each spoke. Self-registers values so
 * all series share the same radial max.
 */
export function useRadar(dataKey: string): RadarGeometry {
  const ctx = useChart();
  const { register, unregister, data: ctxData } = ctx;

  // See bar.tsx: ctx in deps causes infinite register/unregister loop.
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

  const layout = polarLayout(ctx.width, ctx.height, 28);
  const data = ctx.data;
  const n = data.length;
  const [, max] = ctx.yDomain;

  let d = "";
  if (n > 0) {
    const points = data.map((row, i) => {
      const angle = (i / n) * 2 * Math.PI;
      const r = (Number(row[dataKey]) / max) * layout.radius;
      return polarPoint(layout.cx, layout.cy, r, angle);
    });
    d = polygonPath(points);
  }

  const axes: RadarAxis[] = data.map((row, i) => {
    const angle = (i / n) * 2 * Math.PI;
    const end = polarPoint(layout.cx, layout.cy, layout.radius, angle);
    const label = polarPoint(layout.cx, layout.cy, layout.radius + 14, angle);
    return {
      x2: end.x,
      y2: end.y,
      label: String(row[ctx.xKey]),
      lx: label.x,
      ly: label.y,
    };
  });

  const rings: string[] =
    n === 0
      ? []
      : [0.25, 0.5, 0.75, 1].map((level) =>
          polygonPath(
            data.map((_, i) =>
              polarPoint(
                layout.cx,
                layout.cy,
                layout.radius * level,
                (i / n) * 2 * Math.PI
              )
            )
          )
        );

  return {
    d,
    axes,
    rings,
    center: { cx: layout.cx, cy: layout.cy, radius: layout.radius },
  };
}

export interface RadarProps {
  dataKey: string;
  color?: string;
  children?: (geom: RadarGeometry) => React.ReactNode;
}

/**
 * Component variant of useRadar. Renders a `<g>` and calls `children(geometry)`.
 */
export function Radar({ dataKey, children }: RadarProps) {
  const geom = useRadar(dataKey);
  return <g data-slot="radar">{children ? children(geom) : null}</g>;
}
