'use client';

// The showcase cards live with the workbench showcase (apps/showcase) so the
// site and the Storybook render the very same files.
import { AccountAccess } from '../../showcase/rx/cards/account-access';
import { ContributionHistory } from '../../showcase/rx/cards/contribution-history';
import { PayoutThreshold } from '../../showcase/rx/cards/payout-threshold';
import { ReceivingMethod } from '../../showcase/rx/cards/receiving-method';

import { Assistant } from '@/components/preview/blocks/assistant';

/**
 * The showcase masonry: product cards built only with Gremorie components.
 * CSS columns, one per 375px of room (1 on phones, up to 4 on wide screens);
 * each card stays whole inside its column.
 */
export function ShowcaseGrid() {
  const cards = [
    <ContributionHistory key="contribution-history" />,
    <PayoutThreshold key="payout-threshold" />,
    <Assistant key="assistant" initialView="empty" />,
    <AccountAccess key="account-access" />,
    <ReceivingMethod key="receiving-method" />,
  ];
  return (
    <div
      className="columns-1 gap-6 md:columns-2 xl:columns-3 2xl:columns-4"
      data-slot="showcase-grid"
    >
      {cards.map((card) => (
        <div key={card.key} className="mb-6 break-inside-avoid">
          {card}
        </div>
      ))}
    </div>
  );
}
