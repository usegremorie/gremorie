'use client';

import { Alert, AlertDescription, AlertTitle } from '@gremorie/rx-feedback';
import { XCircle } from 'lucide-react';

export function AlertDestructivePreview() {
  return (
    <Alert variant="destructive">
      <XCircle className="size-4" />
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>
        Your card was declined. Update the payment method and try again.
      </AlertDescription>
    </Alert>
  );
}
