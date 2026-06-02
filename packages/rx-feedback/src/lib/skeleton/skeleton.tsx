import * as React from 'react';

import { cn } from '@gremorie/rx-core';

/**
 * Skeleton - placeholder block for loading states.
 *
 * A pulsing rectangle that stands in
 * for content that is still being fetched. Shape it with className
 * width/height to match the geometry of the real content - this is
 * the whole point: skeletons reserve layout so there is no shift
 * when the data arrives. See [[ui/layout/cumulative-layout-shift]].
 *
 * The default animation is `animate-pulse`. Users with
 * `prefers-reduced-motion` see the static state - no extra config
 * needed. Use Skeleton as a presentation primitive only; pair with
 * `aria-busy="true"` and `aria-live="polite"` on the surrounding
 * region so screen readers announce the loading state.
 */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-accent', className)}
      {...props}
    />
  );
}

export { Skeleton };
