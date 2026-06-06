'use client';

import { Stack } from '@gremorie/rx-containers';

export function StackPreview() {
  return (
    <Stack gap="md" className="max-w-sm">
      <div className="rounded-md border p-3 text-sm">Item one</div>
      <div className="rounded-md border p-3 text-sm">Item two</div>
      <div className="rounded-md border p-3 text-sm">Item three</div>
    </Stack>
  );
}
