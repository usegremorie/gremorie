'use client';

import {
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationText,
} from '@gremorie/rx-ai';

export function InlineCitationPreview() {
  return (
    <p className="text-sm leading-relaxed">
      Gremorie ships 100 primitives across 9 packages
      <InlineCitation>
        <InlineCitationText> [1]</InlineCitationText>
        <InlineCitationCard>
          <InlineCitationCardTrigger sources={['https://gremorie.com']} />
          <InlineCitationCardBody>
            <p className="text-sm font-semibold">Phase 5k release notes</p>
            <p className="text-xs text-muted-foreground">
              gremorie.com/changelog
            </p>
          </InlineCitationCardBody>
        </InlineCitationCard>
      </InlineCitation>
      , with React and Angular editions in parity.
    </p>
  );
}
