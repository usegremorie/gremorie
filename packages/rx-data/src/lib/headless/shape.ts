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

/**
 * SVG `d` for a bar with only its TOP corners rounded (clean, not blocky).
 * `r` is clamped to half the width and the height.
 */
export function barTopRoundedPath(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): string {
  const rr = Math.max(0, Math.min(r, w / 2, h));
  return `M${x},${y + h}L${x},${y + rr}Q${x},${y} ${x + rr},${y}L${x + w - rr},${y}Q${x + w},${y} ${x + w},${y + rr}L${x + w},${y + h}Z`;
}
