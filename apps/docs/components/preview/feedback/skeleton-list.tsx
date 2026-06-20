'use client';

import { Skeleton } from '@gremorie/rx-feedback';

export function SkeletonListPreview() {
  return (
    <ul
      className="flex w-full max-w-md flex-col gap-3"
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <li key={index} className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-3 flex-1" />
        </li>
      ))}
    </ul>
  );
}
