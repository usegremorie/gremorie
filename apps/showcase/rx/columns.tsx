import type { ReactNode } from 'react';

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
import type { ShowcaseColumn } from './masonry';

/**
 * The showcase, column by column, shared by the workbench story and the
 * site's /showcase page so both show the same cards in the same places.
 * Seven columns one card wide (a phone screen) and one double column with
 * wide cards, a pair of half-width menus and two sub-columns. The Assistant
 * block is passed in: the workbench and the site import it from different
 * places.
 */
export function showcaseColumns(assistant: ReactNode): ShowcaseColumn[] {
  return [
    {
      key: 'investing',
      rows: [
        <ContributionHistory key="contribution-history" />,
        <DistributeTrack key="distribute-track" />,
        <ScanToConnect key="scan-to-connect" />,
        <DividendIncome key="dividend-income" />,
        <DollarCostAveraging key="dollar-cost-averaging" />,
        <SyncingAccounts key="syncing-accounts" />,
      ],
    },
    {
      key: 'payouts',
      rows: [
        <PayoutThreshold key="payout-threshold" />,
        <ClaimableBalance key="claimable-balance" />,
        <Preferences key="preferences" />,
        <MonthlySpending key="monthly-spending" />,
        <KitchenIsland key="kitchen-island" />,
      ],
    },
    {
      key: 'dashboard',
      span: 2,
      rows: [
        {
          split: [
            [<SavingsTargets key="savings-targets" />],
            [<BuyInvestment key="buy-investment" />],
          ],
        },
        <RecentTransactions key="recent-transactions" />,
        {
          split: [
            [
              {
                pair: [
                  <OverviewMenu key="overview-menu" />,
                  <AccountMenu key="account-menu" />,
                ],
              },
              <HelpCenter key="help-center" />,
            ],
            [
              <PaymentSettings key="payment-settings" />,
              <FrontDoor key="front-door" />,
            ],
          ],
        },
        <StockHoldings key="stock-holdings" />,
      ],
    },
    {
      key: 'cards',
      rows: [
        <AccountAccess key="account-access" />,
        {
          pair: [
            <CardBalance key="card-balance" />,
            <PaymentDue key="payment-due" />,
          ],
        },
        <YearlyActivity key="yearly-activity" />,
        <TransferFunds key="transfer-funds" />,
        <CoverArt key="cover-art" />,
        <LoadingCard key="loading-card" />,
      ],
    },
    {
      key: 'home',
      rows: [
        <ReceivingMethod key="receiving-method" />,
        <PowerUsage key="power-usage" />,
        <ConnectBank key="connect-bank" />,
        <UpcomingPayments key="upcoming-payments" />,
        <LivingRoom key="living-room" />,
      ],
    },
    {
      key: 'catalog',
      rows: [
        <StockPerformance key="stock-performance" />,
        <ExploreCatalog key="explore-catalog" />,
        <NewMilestone key="new-milestone" />,
        <SocialLinks key="social-links" />,
        <Notifications key="notifications" />,
      ],
    },
    { key: 'assistant', rows: [assistant] },
  ];
}
