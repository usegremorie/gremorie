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

/**
 * Break a label into lines that fit `maxChars`, on word boundaries.
 *
 * SVG `<text>` does not wrap, so a long spoke label is drawn as one run and,
 * centred on a spoke at the side of the circle, reaches halfway across the
 * plot. Splitting into `<tspan>` rows is the only way out. A word longer than
 * the limit is left whole rather than cut mid-word — an overflowing line beats
 * an unreadable one.
 *
 * Character count rather than measured width: measuring text means rendering
 * it, and this runs while computing geometry. At the 10px label size roughly
 * 5.5px per character holds well enough for the callers to convert.
 */
export function wrapLabel(label: string, maxChars: number): string[] {
  if (maxChars <= 0 || label.length <= maxChars) return [label];
  const lines: string[] = [];
  let line = '';
  for (const word of label.split(/\s+/)) {
    if (!line) {
      line = word;
    } else if (line.length + 1 + word.length <= maxChars) {
      line += ` ${word}`;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Place a floating card beside an anchor without letting it leave a box.
 *
 * This is recharts' `getTooltipTranslateXY` applied per axis, with its default
 * offset of 10: prefer `coordinate + offset`; if that would cross the far edge,
 * flip to `coordinate - size - offset`; never start before the box does.
 *
 * Kept pure and out of the component because the interesting part is the flip,
 * and a jsdom component test cannot exercise it — there, a rendered card
 * measures 0x0.
 */
export function placeBeside(
  coordinate: number,
  size: number,
  start: number,
  extent: number,
  offset = 10,
): number {
  const positive = coordinate + offset;
  const negative = coordinate - size - offset;
  if (positive + size > start + extent) return Math.max(negative, start);
  return Math.max(positive, start);
}

/** Closed SVG polygon `d` through the given points. Empty string if < 2 points. */
export function polygonPath(
  points: readonly { x: number; y: number }[],
): string {
  if (points.length < 2) return '';
  return `M${points.map((p) => `${p.x},${p.y}`).join('L')}Z`;
}
