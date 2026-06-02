/** Center + radius for a radial chart inside a width x height box. */
export interface PolarLayout {
  cx: number;
  cy: number;
  radius: number;
}

/** Compute the center and a radius that fits the box, minus padding for labels. */
export function polarLayout(
  width: number,
  height: number,
  pad = 8,
): PolarLayout {
  return {
    cx: width / 2,
    cy: height / 2,
    radius: Math.max(0, Math.min(width, height) / 2 - pad),
  };
}

/** Cartesian point on a circle. Angle in radians, 0 at the top, clockwise. */
export function polarPoint(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
): { x: number; y: number } {
  return {
    x: cx + radius * Math.sin(angle),
    y: cy - radius * Math.cos(angle),
  };
}

/** Closed SVG polygon `d` through the given points. Empty string if < 2 points. */
export function polygonPath(
  points: readonly { x: number; y: number }[],
): string {
  if (points.length < 2) return '';
  return `M${points.map((p) => `${p.x},${p.y}`).join('L')}Z`;
}
