import { area as d3Area, line as d3Line } from "d3-shape";

export interface XYPoint {
  x: number;
  y: number;
}

/** SVG `d` for a line through the given points. Empty string if no points. */
export function linePath(points: readonly XYPoint[]): string {
  const gen = d3Line<XYPoint>()
    .x((p) => p.x)
    .y((p) => p.y);
  return gen([...points]) ?? "";
}

/** SVG `d` for an area between the points and a horizontal baseline. */
export function areaPath(points: readonly XYPoint[], baseline: number): string {
  const gen = d3Area<XYPoint>()
    .x((p) => p.x)
    .y0(baseline)
    .y1((p) => p.y);
  return gen([...points]) ?? "";
}
