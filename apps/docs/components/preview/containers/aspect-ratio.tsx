'use client';

import { AspectRatio } from '@gremorie/rx-containers';

export function AspectRatioPreview() {
  return (
    <div className="max-w-md">
      <AspectRatio ratio={16 / 9} className="bg-muted">
        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
          16 : 9
        </div>
      </AspectRatio>
    </div>
  );
}
