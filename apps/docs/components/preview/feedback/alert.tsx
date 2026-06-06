'use client';

import { Alert, AlertDescription, AlertTitle } from '@gremorie/rx-feedback';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export function AlertPreview() {
  return (
    <div className="flex flex-col gap-3">
      <Alert>
        <Info className="size-4" />
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>
          The registry rebuilds on every commit to the main branch.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTriangle className="size-4" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>
          Could not reach the upstream registry. Retry shortly.
        </AlertDescription>
      </Alert>
      <Alert>
        <CheckCircle2 className="size-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Primitive added to your project.</AlertDescription>
      </Alert>
    </div>
  );
}
