import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { AccountMenu as AccountMenuCard } from './cards/account-menu';
import { BuyInvestment as BuyInvestmentCard } from './cards/buy-investment';
import { FrontDoor as FrontDoorCard } from './cards/front-door';
import { HelpCenter as HelpCenterCard } from './cards/help-center';
import { OverviewMenu as OverviewMenuCard } from './cards/overview-menu';
import { PaymentSettings as PaymentSettingsCard } from './cards/payment-settings';
import { RecentTransactions as RecentTransactionsCard } from './cards/recent-transactions';
import { SavingsTargets as SavingsTargetsCard } from './cards/savings-targets';
import { StockHoldings as StockHoldingsCard } from './cards/stock-holdings';

/**
 * Showcase cards, group B: each card on its own, framed at the width it
 * takes in the showcase grid (375px normal, 177px half, 798px double).
 * Mirrors the Angular stories of the same title.
 */
const meta = {
  title: 'Showcase/Cards B',
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function frame(width: number, card: ReactNode): Story {
  return {
    render: () => (
      <div data-card-frame="" style={{ width }}>
        {card}
      </div>
    ),
  };
}

export const SavingsTargets = frame(375, <SavingsTargetsCard />);
export const BuyInvestment = frame(375, <BuyInvestmentCard />);
export const RecentTransactions = frame(798, <RecentTransactionsCard />);
export const OverviewMenu = frame(177, <OverviewMenuCard />);
export const AccountMenu = frame(177, <AccountMenuCard />);
export const HelpCenter = frame(375, <HelpCenterCard />);
export const PaymentSettings = frame(375, <PaymentSettingsCard />);
export const FrontDoor = frame(375, <FrontDoorCard />);
export const StockHoldings = frame(798, <StockHoldingsCard />);
