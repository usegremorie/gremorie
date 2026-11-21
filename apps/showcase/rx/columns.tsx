import type { ReactNode } from 'react';

import { AccountAccess } from './cards/account-access';
import { ContributionHistory } from './cards/contribution-history';
import { MonthlySpending } from './cards/monthly-spending';
import { PayoutThreshold } from './cards/payout-threshold';
import { ReceivingMethod } from './cards/receiving-method';
import type { ShowcaseColumn } from './masonry';

/**
 * The showcase, column by column, shared by the workbench story and the
 * site's /showcase page so both show the same cards in the same places.
 * The Assistant block is passed in: the workbench and the site import it
 * from different places.
 */
export function showcaseColumns(assistant: ReactNode): ShowcaseColumn[] {
  return [
    {
      key: 'savings',
      rows: [<ContributionHistory key="contribution-history" />],
    },
    {
      key: 'payouts',
      rows: [
        <PayoutThreshold key="payout-threshold" />,
        <MonthlySpending key="monthly-spending" />,
      ],
    },
    {
      key: 'accounts',
      rows: [<AccountAccess key="account-access" />],
    },
    {
      key: 'banking',
      rows: [<ReceivingMethod key="receiving-method" />],
    },
    { key: 'assistant', rows: [assistant] },
  ];
}
