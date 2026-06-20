'use client';

import { Alert, AlertTitle } from '@gremorie/rx-feedback';
import { Info } from 'lucide-react';

export function AlertTitleOnlyPreview() {
  return (
    <div className="flex flex-col gap-3">
      <Alert>
        <Info className="size-4" />
        <AlertTitle>Changes saved automatically.</AlertTitle>
      </Alert>
      <Alert>
        <AlertTitle>Read-only mode is on.</AlertTitle>
      </Alert>
    </div>
  );
}
