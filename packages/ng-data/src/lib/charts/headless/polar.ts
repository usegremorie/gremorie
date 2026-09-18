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

/**
 * Inverse of `polarPoint`: which evenly spaced spoke a pointer belongs to.
 *
 * Mirrors recharts' axis-mode hit testing (`calculateActiveTickIndex` with
 * `axisType: 'angleAxis'`), where a tick owns the angular interval bounded by
 * the midpoints to its neighbours. For evenly spaced spokes that reduces to
 * rounding the angle to the nearest step, so every pointer inside the circle
 * resolves to a spoke — the target is the whole wedge, not the vertex.
 *
 * Returns `null` outside the outer radius and at the exact centre, matching
 * recharts' `inRangeOfSector` radius gate (`0 < radius <= outerRadius`), where
 * no angle can be derived.
 */
export function spokeIndexAt(
  point: { x: number; y: number },
  layout: PolarLayout,
  spokes: number,
): number | null {
  if (spokes <= 0) return null;
  const dx = point.x - layout.cx;
  const dy = point.y - layout.cy;
  const distance = Math.hypot(dx, dy);
  if (distance === 0 || distance > layout.radius) return null;

  // `polarPoint` is x = cx + r·sin(a), y = cy - r·cos(a): angle 0 at the top,
  // growing clockwise. atan2(dx, -dy) inverts exactly that.
  const turn = 2 * Math.PI;
  const angle = (Math.atan2(dx, -dy) + turn) % turn;
  return Math.round(angle / (turn / spokes)) % spokes;
}

/** Closed SVG polygon `d` through the given points. Empty string if < 2 points. */
export function polygonPath(
  points: readonly { x: number; y: number }[],
): string {
  if (points.length < 2) return '';
  return `M${points.map((p) => `${p.x},${p.y}`).join('L')}Z`;
}
