import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Assistant } from '@gremorie/ng-ai';

import { AccountAccess } from './cards/account-access';
import { AccountMenu } from './cards/account-menu';
import { BuyInvestment } from './cards/buy-investment';
import { CardBalance } from './cards/card-balance';
import { ClaimableBalance } from './cards/claimable-balance';
import { ConnectBank } from './cards/connect-bank';
import { ContributionHistory } from './cards/contribution-history';
import { CoverArt } from './cards/cover-art';
import { DistributeTrack } from './cards/distribute-track';
import { DividendIncome } from './cards/dividend-income';
import { DollarCostAveraging } from './cards/dollar-cost-averaging';
import { ExploreCatalog } from './cards/explore-catalog';
import { FrontDoor } from './cards/front-door';
import { HelpCenter } from './cards/help-center';
import { KitchenIsland } from './cards/kitchen-island';
import { LivingRoom } from './cards/living-room';
import { LoadingCard } from './cards/loading-card';
import { MonthlySpending } from './cards/monthly-spending';
import { NewMilestone } from './cards/new-milestone';
import { Notifications } from './cards/notifications';
import { OverviewMenu } from './cards/overview-menu';
import { PaymentDue } from './cards/payment-due';
import { PaymentSettings } from './cards/payment-settings';
import { PayoutThreshold } from './cards/payout-threshold';
import { PowerUsage } from './cards/power-usage';
import { Preferences } from './cards/preferences';
import { ReceivingMethod } from './cards/receiving-method';
import { RecentTransactions } from './cards/recent-transactions';
import { SavingsTargets } from './cards/savings-targets';
import { ScanToConnect } from './cards/scan-to-connect';
import { SocialLinks } from './cards/social-links';
import { StockHoldings } from './cards/stock-holdings';
import { StockPerformance } from './cards/stock-performance';
import { SyncingAccounts } from './cards/syncing-accounts';
import { TransferFunds } from './cards/transfer-funds';
import { UpcomingPayments } from './cards/upcoming-payments';
import { YearlyActivity } from './cards/yearly-activity';

/**
 * The Angular showcase: a set of product cards built with Gremorie
 * components, in a fixed column order, mirroring the React showcase
 * (same id, `showcase--all`). Fixed 375px columns, 40px apart.
 */
const meta: Meta = {
  title: 'Showcase',
  parameters: { layout: 'fullscreen' },
  decorators: [
    moduleMetadata({
      imports: [
        AccountAccess,
        AccountMenu,
        BuyInvestment,
        CardBalance,
        ClaimableBalance,
        ConnectBank,
        ContributionHistory,
        CoverArt,
        DistributeTrack,
        DividendIncome,
        DollarCostAveraging,
        ExploreCatalog,
        FrontDoor,
        HelpCenter,
        KitchenIsland,
        LivingRoom,
        LoadingCard,
        MonthlySpending,
        NewMilestone,
        Notifications,
        OverviewMenu,
        PaymentDue,
        PaymentSettings,
        PayoutThreshold,
        PowerUsage,
        Preferences,
        ReceivingMethod,
        RecentTransactions,
        SavingsTargets,
        ScanToConnect,
        SocialLinks,
        StockHoldings,
        StockPerformance,
        SyncingAccounts,
        TransferFunds,
        UpcomingPayments,
        YearlyActivity,
        Assistant,
      ],
    }),
  ],
};

export default meta;

// Same columns, rows and classes as the React Masonry
// (apps/showcase/rx/masonry.tsx + columns.tsx); keep the two in sync.
const COLUMN =
  'flex w-full flex-col gap-6 md:w-(--showcase-column) md:shrink-0 md:gap-10';
const DOUBLE = `${COLUMN} md:w-[calc(var(--showcase-column)*2+var(--spacing)*10)]`;

export const All: StoryObj = {
  render: () => ({
    props: { COLUMN, DOUBLE },
    template: `
      <div class="min-h-screen bg-background p-10">
        <div
          data-slot="showcase-masonry"
          class="[--showcase-column:375px] flex flex-col gap-6 md:w-max md:flex-row md:items-start md:gap-10"
        >
          <div data-slot="showcase-column" data-span="1" [class]="COLUMN">
            <showcase-contribution-history />
            <showcase-distribute-track />
            <showcase-scan-to-connect />
            <showcase-dividend-income />
            <showcase-dollar-cost-averaging />
            <showcase-syncing-accounts />
          </div>
          <div data-slot="showcase-column" data-span="1" [class]="COLUMN">
            <showcase-payout-threshold />
            <showcase-claimable-balance />
            <showcase-preferences />
            <showcase-monthly-spending />
            <showcase-kitchen-island />
          </div>
          <div data-slot="showcase-column" data-span="2" [class]="DOUBLE">
            <div class="flex flex-col gap-6 md:grid md:grid-cols-2 md:items-start md:gap-10">
              <div class="flex flex-col gap-6 md:gap-10"><showcase-savings-targets /></div>
              <div class="flex flex-col gap-6 md:gap-10"><showcase-buy-investment /></div>
            </div>
            <showcase-recent-transactions />
            <div class="flex flex-col gap-6 md:grid md:grid-cols-2 md:items-start md:gap-10">
              <div class="flex flex-col gap-6 md:gap-10">
                <div class="grid grid-cols-2 items-start gap-4"><showcase-overview-menu /><showcase-account-menu /></div>
                <showcase-help-center />
              </div>
              <div class="flex flex-col gap-6 md:gap-10"><showcase-payment-settings /><showcase-front-door /></div>
            </div>
            <showcase-stock-holdings />
          </div>
          <div data-slot="showcase-column" data-span="1" [class]="COLUMN">
            <showcase-account-access />
            <div class="grid grid-cols-2 items-start gap-4"><showcase-card-balance /><showcase-payment-due /></div>
            <showcase-yearly-activity />
            <showcase-transfer-funds />
            <showcase-cover-art />
            <showcase-loading-card />
          </div>
          <div data-slot="showcase-column" data-span="1" [class]="COLUMN">
            <showcase-receiving-method />
            <showcase-power-usage />
            <showcase-connect-bank />
            <showcase-upcoming-payments />
            <showcase-living-room />
          </div>
          <div data-slot="showcase-column" data-span="1" [class]="COLUMN">
            <showcase-stock-performance />
            <showcase-explore-catalog />
            <showcase-new-milestone />
            <showcase-social-links />
            <showcase-notifications />
          </div>
          <div data-slot="showcase-column" data-span="1" [class]="COLUMN">
            <ai-assistant initialView="empty" />
          </div>
        </div>
      </div>
    `,
  }),
};
