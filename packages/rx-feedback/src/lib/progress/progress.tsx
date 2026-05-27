"use client";

import { Progress as ProgressPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@gremorie/rx-core";

/**
 * Progress - determinate progress indicator (0-100).
 *
 * Imported from shadcn/ui (MIT). Wraps Radix Progress. Pass `value`
 * (0-100) for determinate; pass `value={null}` plus a custom
 * indicator class for indeterminate (animated stripe pattern).
 *
 * Use Progress when **percent complete is known** - uploads, multi-
 * step forms, batch jobs. For unknown duration, use Skeleton or a
 * spinner. Always pair the bar with a numeric value or label;
 * silent bars confuse users about the actual state.
 */
function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
