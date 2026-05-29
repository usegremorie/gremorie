import * as React from "react";
import { ChartProvider } from "./chart-context";
import { DEFAULT_MARGIN, type Datum, type Margin } from "./types";

export interface ChartFrameProps
  extends Omit<React.SVGProps<SVGSVGElement>, "data" | "viewBox"> {
  data: readonly Datum[];
  xKey: string;
  margin?: Margin;
  children?: React.ReactNode;
}

/**
 * Root of a headless chart. Renders an `<svg>`, owns the size via
 * ResizeObserver (client-only), and wraps children in a `ChartProvider`
 * so series/axes can read scales, domains, and registered series.
 *
 * @example
 * ```tsx
 * <ChartFrame data={data} xKey="month" className="aspect-video w-full">
 *   <Area dataKey="sales" />
 * </ChartFrame>
 * ```
 */
export function ChartFrame({
  data,
  xKey,
  margin = DEFAULT_MARGIN,
  children,
  ...svgProps
}: ChartFrameProps) {
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const [size, setSize] = React.useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    const node = svgRef.current;
    if (!node) return;
    if (typeof ResizeObserver === "undefined") {
      const rect = node.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
      return;
    }
    const ro = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (box) {
        setSize({ width: box.width, height: box.height });
      }
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  return (
    <svg
      ref={svgRef}
      data-slot="chart-frame"
      preserveAspectRatio="none"
      viewBox={`0 0 ${size.width} ${size.height}`}
      {...svgProps}
    >
      <ChartProvider
        width={size.width}
        height={size.height}
        margin={margin}
        data={data}
        xKey={xKey}
      >
        {children}
      </ChartProvider>
    </svg>
  );
}
