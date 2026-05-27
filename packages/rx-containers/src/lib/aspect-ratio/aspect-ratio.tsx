"use client";

import { AspectRatio as AspectRatioPrimitive } from "radix-ui";
import * as React from "react";

/**
 * AspectRatio - reserves vertical space for media before content loads.
 *
 * One-prop component (`ratio`) that wraps Radix AspectRatio. Use it on
 * every responsive image, iframe, video embed, or skeleton placeholder
 * so the layout does not jump when the asset settles - prevents
 * cumulative layout shift (CLS) hits.
 */
function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
