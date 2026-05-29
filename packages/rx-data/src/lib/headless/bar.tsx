import * as React from "react";
import { useChart } from "./chart-context";
import { bandScale } from "./scales";

export interface BarRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Hook variant: register a bar series and return its rects. The styled
 * layer renders the `<rect>` elements - the hook only computes geometry.
 * Self-registers values for the shared domain and positions sub-bars by
 * series index so multiple series sit side-by-side within each category.
 */
export function useBar(dataKey: string): BarRect[] {
  const ctx = useChart();
  const { register, unregister, data: ctxData } = ctx;

  // Capture latest data in a ref so the registered `values` callback always
  // reads fresh data without forcing the effect to re-run on every render.
  // ctx is a fresh object identity each render (useMemo deps include
  // scales/domain), so depending on it here caused register/unregister to
  // loop: register -> bump() in provider -> new ctx -> effect runs again ->
  // cleanup unregister -> bump() -> infinite "Maximum update depth" loop.
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

  const data = ctx.data;
  const xKey = ctx.xKey;
  const categories = data.map((d) => String(d[xKey]));
  const band = bandScale(
    categories,
    [ctx.plotLeft, ctx.plotRight],
    0.2
  );
  const keys = ctx.seriesKeys;
  const count = Math.max(1, keys.length);
  const index = Math.max(0, keys.indexOf(dataKey));
  const subWidth = band.bandwidth / count;
  const baseline = ctx.yScale(0);
  const yScale = ctx.yScale;

  return data.map((d) => {
    const value = yScale(Number(d[dataKey]));
    return {
      x: band(String(d[xKey])) + subWidth * index,
      y: value,
      width: Math.max(0, subWidth - 1),
      height: Math.max(0, baseline - value),
    };
  });
}

export interface BarProps {
  dataKey: string;
  color?: string;
  /** Render each `<rect>` for this series. */
  children?: (rects: BarRect[]) => React.ReactNode;
}

/**
 * Component variant of useBar. Renders a `<g>` and calls `children(rects)`
 * with the computed bar geometry. Useful when the styled layer wants to keep
 * a JSX-only composition style.
 *
 * @example
 * ```tsx
 * <Bar dataKey="sales">
 *   {(rects) => rects.map((r, i) => <rect key={i} {...r} fill="..." />)}
 * </Bar>
 * ```
 */
export function Bar({ dataKey, children }: BarProps) {
  const rects = useBar(dataKey);
  return <g data-slot="bar">{children ? children(rects) : null}</g>;
}
