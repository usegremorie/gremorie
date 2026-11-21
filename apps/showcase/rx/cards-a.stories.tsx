import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { ClaimableBalance } from './cards/claimable-balance';
import { DistributeTrack } from './cards/distribute-track';
import { DividendIncome } from './cards/dividend-income';
import { DollarCostAveraging } from './cards/dollar-cost-averaging';
import { KitchenIsland } from './cards/kitchen-island';
import { Preferences } from './cards/preferences';
import { ScanToConnect } from './cards/scan-to-connect';
import { SyncingAccounts } from './cards/syncing-accounts';

/**
 * Showcase cards, group A: single-column cards, each rendered in a
 * 375px frame (the showcase column width).
 */
const meta = {
  title: 'Showcase/Cards A',
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const frame = (card: ReactNode) => () => (
  <div data-showcase-frame="" style={{ width: 375 }}>
    {card}
  </div>
);

export const DistributeTrackCard: Story = {
  name: 'Distribute Track',
  render: frame(<DistributeTrack />),
};
export const ScanToConnectCard: Story = {
  name: 'Scan to Connect',
  render: frame(<ScanToConnect />),
};
export const DividendIncomeCard: Story = {
  name: 'Dividend Income',
  render: frame(<DividendIncome />),
};
export const DollarCostAveragingCard: Story = {
  name: 'Dollar-Cost Averaging',
  render: frame(<DollarCostAveraging />),
};
export const SyncingAccountsCard: Story = {
  name: 'Syncing Accounts',
  render: frame(<SyncingAccounts />),
};
export const ClaimableBalanceCard: Story = {
  name: 'Claimable Balance',
  render: frame(<ClaimableBalance />),
};
export const PreferencesCard: Story = {
  name: 'Preferences',
  render: frame(<Preferences />),
};
export const KitchenIslandCard: Story = {
  name: 'Kitchen Island',
  render: frame(<KitchenIsland />),
};
