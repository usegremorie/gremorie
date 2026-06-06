'use client';

import { ScrollArea } from '@gremorie/rx-containers';

const TAGS = Array.from({ length: 40 }).map((_, i) => `Tag ${i + 1}`);

export function ScrollAreaPreview() {
  return (
    <ScrollArea className="h-48 w-full max-w-sm rounded-md border p-4">
      <div className="flex flex-col gap-2">
        {TAGS.map((t) => (
          <div key={t} className="text-sm">
            {t}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
