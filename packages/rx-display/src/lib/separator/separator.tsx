"use client";

import { Separator as SeparatorPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@gremorie/rx-core";

/**
 * Separator - visual divider between groups of content.
 *
 * Wraps `@radix-ui/react-separator` so
 * the `decorative` flag controls whether the separator is exposed to
 * AT (`role="separator"` with `aria-orientation`) or hidden as
 * presentational (`role="none"`).
 *
 * Per ADR-012, this primitive ships under
 * `@kalvner/kds/display/separator` with the `cn` helper imported
 * by relative path. Visual is token-driven (`bg-border`) - the
 * separator picks up the active KDS theme automatically.
 *
 * The default `decorative={true}` is the right choice in the vast
 * majority of cases. Only set `decorative={false}` when the
 * separator carries semantic meaning (e.g. between two list-like
 * sections that you want screen readers to announce).
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
