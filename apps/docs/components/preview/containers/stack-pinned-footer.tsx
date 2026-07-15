'use client';

import { Stack } from '@gremorie/rx-containers';
import { Button } from '@gremorie/rx-forms';

export function StackPinnedFooterPreview() {
  return (
    <Stack
      gap="md"
      justify="between"
      className="h-64 max-w-sm rounded-md border p-4"
    >
      <Stack gap="sm">
        <h2 className="text-lg font-semibold">Invite teammates</h2>
        <p className="text-sm text-muted-foreground">
          Send a magic link or copy the workspace URL.
        </p>
      </Stack>
      <Button>Send invite</Button>
    </Stack>
  );
}
