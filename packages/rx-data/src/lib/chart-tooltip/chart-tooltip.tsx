"use client";

import type { ReactNode } from "react";

import { cn } from "@gremorie/rx-core";

/** One row in a chart tooltip: a swatch + label + value. */
export interface ChartTooltipItem {
  label: ReactNode;
  value: ReactNode;
  /** Swatch color (CSS color / token). Omit to hide the swatch. */
  color?: string;
}

export interface ChartTooltipContentProps {
  /** Header line (usually the hovered category). */
  label?: ReactNode;
  /** Rows — one per series. */
  items: ChartTooltipItem[];
  className?: string;
}

/**
 * ChartTooltipContent — the floating card a chart shows on hover.
 *
 * Pure presentational (no positioning, no hover wiring): a styled `Chart`
 * positions it at the hovered point. Used by `BarChart` and consumable on its
 * own. Token-driven so theme + dark mode flow through.
 */
export function ChartTooltipContent({
  label,
  items,
  className,
}: ChartTooltipContentProps) {
  return (
    <div
      role="tooltip"
      data-slot="chart-tooltip"
      className={cn(
        "min-w-32 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-md",
        className
      )}
    >
      {label != null ? (
        <div className="mb-1 font-medium text-foreground">{label}</div>
      ) : null}
      <div className="grid gap-1">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {it.color ? (
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-[3px]"
                style={{ backgroundColor: it.color }}
              />
            ) : null}
            <span className="text-muted-foreground">{it.label}</span>
            <span className="ml-3 font-medium tabular-nums text-foreground">
              {it.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
