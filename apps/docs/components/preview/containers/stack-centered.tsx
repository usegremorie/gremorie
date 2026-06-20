'use client';

import { Stack } from '@gremorie/rx-containers';

export function StackCenteredPreview() {
  return (
    <Stack gap="sm" align="center" className="text-sm">
      <div className="rounded-full bg-muted px-3 py-1">Tag</div>
      <div className="text-muted-foreground">Five matching results</div>
    </Stack>
  );
}
