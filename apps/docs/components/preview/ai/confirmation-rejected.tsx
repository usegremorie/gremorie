'use client';

import {
  Confirmation,
  ConfirmationRejected,
  ConfirmationTitle,
} from '@gremorie/rx-ai';

export function ConfirmationRejectedPreview() {
  return (
    <Confirmation
      approval={{ id: '1', approved: false, reason: 'Path outside workspace' }}
      state="approval-responded"
      className="border"
    >
      <ConfirmationTitle>File write rejected</ConfirmationTitle>
      <ConfirmationRejected>
        Reason: Path outside workspace
      </ConfirmationRejected>
    </Confirmation>
  );
}
