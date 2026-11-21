import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

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
 * 375px frame (the showcase column width). Mirrors the React file.
 */
const meta: Meta = {
  title: 'Showcase/Cards A',
  parameters: { layout: 'centered' },
  decorators: [
    moduleMetadata({
      imports: [
        ClaimableBalance,
        DistributeTrack,
        DividendIncome,
        DollarCostAveraging,
        KitchenIsland,
        Preferences,
        ScanToConnect,
        SyncingAccounts,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj;

const frame =
  (selector: string): Story['render'] =>
  () => ({
    template: `<div data-showcase-frame style="width: 375px"><${selector} /></div>`,
  });

export const DistributeTrackCard: Story = {
  name: 'Distribute Track',
  render: frame('showcase-distribute-track'),
};
export const ScanToConnectCard: Story = {
  name: 'Scan to Connect',
  render: frame('showcase-scan-to-connect'),
};
export const DividendIncomeCard: Story = {
  name: 'Dividend Income',
  render: frame('showcase-dividend-income'),
};
export const DollarCostAveragingCard: Story = {
  name: 'Dollar-Cost Averaging',
  render: frame('showcase-dollar-cost-averaging'),
};
export const SyncingAccountsCard: Story = {
  name: 'Syncing Accounts',
  render: frame('showcase-syncing-accounts'),
};
export const ClaimableBalanceCard: Story = {
  name: 'Claimable Balance',
  render: frame('showcase-claimable-balance'),
};
export const PreferencesCard: Story = {
  name: 'Preferences',
  render: frame('showcase-preferences'),
};
export const KitchenIslandCard: Story = {
  name: 'Kitchen Island',
  render: frame('showcase-kitchen-island'),
};
