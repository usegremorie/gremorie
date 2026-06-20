'use client';

import { Skeleton } from '@gremorie/rx-feedback';

export function SkeletonCardPreview() {
  return (
    <div
      className="max-w-sm space-y-3 rounded-md border p-4"
      aria-busy="true"
      aria-live="polite"
    >
      <Skeleton className="aspect-video w-full rounded-md" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
