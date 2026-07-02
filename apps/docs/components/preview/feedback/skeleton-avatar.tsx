'use client';

import { Skeleton } from '@gremorie/rx-feedback';

export function SkeletonAvatarPreview() {
  return (
    <div
      className="flex items-center gap-4"
      aria-busy="true"
      aria-live="polite"
    >
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[160px]" />
      </div>
    </div>
  );
}
