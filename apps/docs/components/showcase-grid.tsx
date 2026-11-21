'use client';

// The showcase cards live with the workbench showcase (apps/showcase) so the
// site and the Storybook render the very same files.
import { AccountAccess } from '../../showcase/rx/cards/account-access';
import { ContributionHistory } from '../../showcase/rx/cards/contribution-history';
import { MonthlySpending } from '../../showcase/rx/cards/monthly-spending';
import { PayoutThreshold } from '../../showcase/rx/cards/payout-threshold';
import { ReceivingMethod } from '../../showcase/rx/cards/receiving-method';

import { Assistant } from '@/components/preview/blocks/assistant';

/**
 * The showcase masonry: product cards built only with Gremorie components.
 * CSS columns at least 24rem wide, as many as fit (1 on phones, more as the
 * page widens), so a card is never narrower than the workbench's 375px
 * column; each card stays whole inside its column.
 */
export function ShowcaseGrid() {
  const cards = [
    <ContributionHistory key="contribution-history" />,
    <PayoutThreshold key="payout-threshold" />,
    <MonthlySpending key="monthly-spending" />,
    <Assistant key="assistant" initialView="empty" />,
    <AccountAccess key="account-access" />,
    <ReceivingMethod key="receiving-method" />,
  ];
  return (
    <div className="columns-sm gap-6" data-slot="showcase-grid">
      {cards.map((card) => (
        <div key={card.key} className="mb-6 break-inside-avoid">
          {card}
        </div>
      ))}
    </div>
  );
}
