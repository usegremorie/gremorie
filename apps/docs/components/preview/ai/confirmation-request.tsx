'use client';

import {
  Confirmation,
  ConfirmationRequest,
  ConfirmationTitle,
} from '@gremorie/rx-ai';
import { Button } from '@gremorie/rx-forms';

export function ConfirmationRequestPreview() {
  return (
    <Confirmation
      approval={{ id: '1' }}
      state="approval-requested"
      className="border"
    >
      <ConfirmationTitle>
        Approve file write to /tmp/output.txt?
      </ConfirmationTitle>
      <ConfirmationRequest>
        <div className="mt-2 flex gap-2">
          <Button size="sm">Approve</Button>
          <Button size="sm" variant="outline">
            Reject
          </Button>
        </div>
      </ConfirmationRequest>
    </Confirmation>
  );
}
