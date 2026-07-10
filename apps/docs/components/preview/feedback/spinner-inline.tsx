'use client';

import { Spinner } from '@gremorie/rx-feedback';

export function SpinnerInlinePreview() {
  return (
    <p className="flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner size="sm" />
      Loading conversations...
    </p>
  );
}
