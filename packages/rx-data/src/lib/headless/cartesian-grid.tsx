import * as React from "react";
import { useChart } from "./chart-context";
import { computeTicks } from "./axis";

export interface GridLine {
  y: number;
  x1: number;
  x2: number;
}

/** Hook: horizontal gridlines aligned to the Y ticks. */
export function useCartesianGrid(count = 4): GridLine[] {
  const ctx = useChart();
  const [, max] = ctx.yDomain;
  const y = ctx.yScale;
  const x1 = ctx.plotLeft;
  const x2 = ctx.plotRight;
  return computeTicks(max, count).map((value) => ({ y: y(value), x1, x2 }));
}

export interface CartesianGridProps {
  count?: number;
  children?: (lines: GridLine[]) => React.ReactNode;
}

/**
 * Component variant of useCartesianGrid. Renders a `<g>` and exposes the
 * grid `lines` so the styled layer can draw them (the headless layer stays
 * visual-free).
 */
export function CartesianGrid({ count = 4, children }: CartesianGridProps) {
  const lines = useCartesianGrid(count);
  return (
    <g data-slot="cartesian-grid">{children ? children(lines) : null}</g>
  );
}
