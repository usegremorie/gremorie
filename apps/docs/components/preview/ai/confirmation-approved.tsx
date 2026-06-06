'use client';

import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationTitle,
} from '@gremorie/rx-ai';

export function ConfirmationApprovedPreview() {
  return (
    <Confirmation
      approval={{ id: '1', approved: true }}
      state="approval-responded"
      className="border"
    >
      <ConfirmationTitle>File written</ConfirmationTitle>
      <ConfirmationAccepted>Approved by user.</ConfirmationAccepted>
    </Confirmation>
  );
}
