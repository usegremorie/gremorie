import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

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
 * Mirrors the React stories of the same title.
 */
const meta: Meta = {
  title: 'Showcase/Cards B',
  parameters: { layout: 'centered' },
  decorators: [
    moduleMetadata({
      imports: [
        AccountMenuCard,
        BuyInvestmentCard,
        FrontDoorCard,
        HelpCenterCard,
        OverviewMenuCard,
        PaymentSettingsCard,
        RecentTransactionsCard,
        SavingsTargetsCard,
        StockHoldingsCard,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj;

function frame(width: number, selector: string): Story {
  return {
    render: () => ({
      template: `<div data-card-frame style="width: ${width}px"><${selector} /></div>`,
    }),
  };
}

export const SavingsTargets = frame(375, 'showcase-savings-targets');
export const BuyInvestment = frame(375, 'showcase-buy-investment');
export const RecentTransactions = frame(798, 'showcase-recent-transactions');
export const OverviewMenu = frame(177, 'showcase-overview-menu');
export const AccountMenu = frame(177, 'showcase-account-menu');
export const HelpCenter = frame(375, 'showcase-help-center');
export const PaymentSettings = frame(375, 'showcase-payment-settings');
export const FrontDoor = frame(375, 'showcase-front-door');
export const StockHoldings = frame(798, 'showcase-stock-holdings');
