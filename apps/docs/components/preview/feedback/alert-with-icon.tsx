'use client';

import { Alert, AlertDescription, AlertTitle } from '@gremorie/rx-feedback';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export function AlertWithIconPreview() {
  return (
    <div className="flex flex-col gap-3">
      <Alert>
        <Info className="size-4" />
        <AlertTitle>Informational</AlertTitle>
        <AlertDescription>
          The registry rebuilds on every commit to the main branch.
        </AlertDescription>
      </Alert>
      <Alert>
        <CheckCircle2 className="size-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Primitive added to your project.</AlertDescription>
      </Alert>
      <Alert>
        <AlertTriangle className="size-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          This action rewrites tokens already imported by other components.
        </AlertDescription>
      </Alert>
    </div>
  );
}
