'use client';

import { Button } from '@gremorie/rx-forms';
import { RotateCwIcon } from 'lucide-react';

/** Reloads the URL the reader asked for (the offline page is served there). */
export function OfflineRetry({ label }: { label: string }) {
  return (
    <Button onClick={() => window.location.reload()}>
      <RotateCwIcon aria-hidden="true" />
      {label}
    </Button>
  );
}
