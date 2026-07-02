'use client';

import { Stack } from '@gremorie/rx-containers';

const gaps = ['xs', 'sm', 'md', 'lg'] as const;

export function StackGapsPreview() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {gaps.map((gap) => (
        <div key={gap}>
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            gap=&quot;{gap}&quot;
          </p>
          <Stack gap={gap}>
            <div className="rounded-md border p-2 text-sm">One</div>
            <div className="rounded-md border p-2 text-sm">Two</div>
            <div className="rounded-md border p-2 text-sm">Three</div>
          </Stack>
        </div>
      ))}
    </div>
  );
}
