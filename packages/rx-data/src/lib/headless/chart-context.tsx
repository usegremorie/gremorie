import * as React from "react";
import { computeYDomain, type SeriesReg } from "./domain";
import { linearScale, niceMax, pointScale } from "./scales";
import { DEFAULT_MARGIN, type Datum, type Margin } from "./types";

/**
 * Reactive hub shared by a chart frame and its child series/axes via React Context.
 * The frame writes dimensions + data; series self-register their values so
 * the frame can compute a shared domain; scales are derived during render.
 *
 * Angular's `ChartContext` (signals + computed) is replaced here by:
 * - useState for the mutable cells (width, height, data, registry...)
 * - useMemo for the derived values (innerWidth, yDomain, xScale, ...)
 * - register/unregister callbacks exposed through context
 *
 * Series children call `useChart()` to read derived state and self-register
 * their values via useEffect.
 */
export interface ChartContextValue {
  width: number;
  height: number;
  margin: Margin;
  data: readonly Datum[];
  xKey: string;

  seriesKeys: readonly string[];

  innerWidth: number;
  innerHeight: number;
  plotLeft: number;
  plotRight: number;
  plotTop: number;
  plotBottom: number;

  yDomain: readonly [number, number];
  yScale: (v: number) => number;
  xScale: (v: string) => number;

  register: (reg: SeriesReg) => void;
  unregister: (key: string) => void;
}

const ChartContext = React.createContext<ChartContextValue | null>(null);

/** Read the chart context. Throws if used outside a ChartProvider. */
export function useChart(): ChartContextValue {
  const ctx = React.useContext(ChartContext);
  if (!ctx) {
    throw new Error(
      "useChart() must be used inside a <ChartProvider> (rendered by <ChartFrame>)."
    );
  }
  return ctx;
}

export interface ChartProviderProps {
  width: number;
  height: number;
  margin?: Margin;
  data: readonly Datum[];
  xKey: string;
  children?: React.ReactNode;
}

/**
 * Provides the ChartContext to all descendants. Renders no DOM of its own -
 * children are returned as-is (the parent `<svg>` of ChartFrame owns the
 * actual mount).
 */
export function ChartProvider({
  width,
  height,
  margin = DEFAULT_MARGIN,
  data,
  xKey,
  children,
}: ChartProviderProps) {
  // Registry of series contributing to the shared Y domain. We use a ref +
  // a version counter so register/unregister are stable callbacks but still
  // trigger a re-render when the set of series changes.
  const registryRef = React.useRef<SeriesReg[]>([]);
  const [, bump] = React.useReducer((x: number) => x + 1, 0);

  const register = React.useCallback((reg: SeriesReg) => {
    const prev = registryRef.current;
    registryRef.current = [...prev.filter((s) => s.key !== reg.key), reg];
    bump();
  }, []);

  const unregister = React.useCallback((key: string) => {
    registryRef.current = registryRef.current.filter((s) => s.key !== key);
    bump();
  }, []);

  const seriesKeys = React.useMemo(
    () => registryRef.current.map((s) => s.key),
    [registryRef.current.length, registryRef.current]
  );

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  // Plot bounds in absolute SVG coordinates. Scales map into these so the
  // margins become real gutters (Y labels on the left, X labels below).
  const plotLeft = margin.left;
  const plotRight = Math.max(margin.left, width - margin.right);
  const plotTop = margin.top;
  const plotBottom = Math.max(margin.top, height - margin.bottom);

  const yDomain = React.useMemo<readonly [number, number]>(() => {
    const [min, rawMax] = computeYDomain(registryRef.current);
    return [min, niceMax(rawMax)];
  }, [seriesKeys, data]);

  const yScale = React.useMemo(
    () => linearScale(yDomain, [plotBottom, plotTop]),
    [yDomain, plotBottom, plotTop]
  );

  const xScale = React.useMemo(
    () =>
      pointScale(
        data.map((d) => String(d[xKey])),
        [plotLeft, plotRight]
      ),
    [data, xKey, plotLeft, plotRight]
  );

  const value = React.useMemo<ChartContextValue>(
    () => ({
      width,
      height,
      margin,
      data,
      xKey,
      seriesKeys,
      innerWidth,
      innerHeight,
      plotLeft,
      plotRight,
      plotTop,
      plotBottom,
      yDomain,
      yScale,
      xScale,
      register,
      unregister,
    }),
    [
      width,
      height,
      margin,
      data,
      xKey,
      seriesKeys,
      innerWidth,
      innerHeight,
      plotLeft,
      plotRight,
      plotTop,
      plotBottom,
      yDomain,
      yScale,
      xScale,
      register,
      unregister,
    ]
  );

  return (
    <ChartContext.Provider value={value}>{children}</ChartContext.Provider>
  );
}
