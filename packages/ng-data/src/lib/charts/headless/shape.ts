import {
  area as d3Area,
  line as d3Line,
  curveLinear,
  curveMonotoneX,
  curveNatural,
  curveStep,
  type CurveFactory,
} from 'd3-shape';
import type { CurveType } from './types';

export interface XYPoint {
  x: number;
  y: number;
}

/** A point with an explicit lower/upper Y, used for stacked area bands. */
export interface BandPoint {
  x: number;
  y0: number;
  y1: number;
}

const CURVES: Record<CurveType, CurveFactory> = {
  natural: curveNatural,
  monotone: curveMonotoneX,
  linear: curveLinear,
  step: curveStep,
};

/** Resolve a {@link CurveType} preset to its d3 curve factory. */
export function curveFactory(type: CurveType = 'linear'): CurveFactory {
  return CURVES[type] ?? curveLinear;
}

/** SVG `d` for a line through the given points. Empty string if no points. */
export function linePath(
  points: readonly XYPoint[],
  curve: CurveType = 'linear',
): string {
  const gen = d3Line<XYPoint>()
    .x((p) => p.x)
    .y((p) => p.y)
    .curve(curveFactory(curve));
  return gen([...points]) ?? '';
}

/** SVG `d` for an area between the points and a horizontal baseline. */
export function areaPath(
  points: readonly XYPoint[],
  baseline: number,
  curve: CurveType = 'linear',
): string {
  const gen = d3Area<XYPoint>()
    .x((p) => p.x)
    .y0(baseline)
    .y1((p) => p.y)
    .curve(curveFactory(curve));
  return gen([...points]) ?? '';
}

/** SVG `d` for a stacked area band (explicit lower + upper Y per point). */
export function areaBandPath(
  points: readonly BandPoint[],
  curve: CurveType = 'linear',
): string {
  const gen = d3Area<BandPoint>()
    .x((p) => p.x)
    .y0((p) => p.y0)
    .y1((p) => p.y1)
    .curve(curveFactory(curve));
  return gen([...points]) ?? '';
}

/** Per-corner radii for {@link roundedRectPath}: `[topLeft, topRight, bottomRight, bottomLeft]`. */
export type CornerRadii = [number, number, number, number];

/**
 * SVG `d` for a rectangle with independent corner radii. Mirrors the recharts
 * `radius` array `[tl, tr, br, bl]`, so a bar can round only its top (or only
 * the outer corners of a stack). Radii are clamped to the rect's half-extent.
 */
export function roundedRectPath(
  x: number,
  y: number,
  w: number,
  h: number,
  radii: CornerRadii,
): string {
  const lim = Math.min(w, h) / 2;
  const [tl, tr, br, bl] = radii.map((r) =>
    Math.max(0, Math.min(r, lim)),
  ) as CornerRadii;
  return (
    `M${x + tl},${y}` +
    `H${x + w - tr}` +
    (tr ? `A${tr},${tr} 0 0 1 ${x + w},${y + tr}` : '') +
    `V${y + h - br}` +
    (br ? `A${br},${br} 0 0 1 ${x + w - br},${y + h}` : '') +
    `H${x + bl}` +
    (bl ? `A${bl},${bl} 0 0 1 ${x},${y + h - bl}` : '') +
    `V${y + tl}` +
    (tl ? `A${tl},${tl} 0 0 1 ${x + tl},${y}` : '') +
    'Z'
  );
}
