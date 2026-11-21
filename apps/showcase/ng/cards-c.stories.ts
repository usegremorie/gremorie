import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { CardBalance } from './cards/card-balance';
import { ConnectBank } from './cards/connect-bank';
import { CoverArt } from './cards/cover-art';
import { LivingRoom } from './cards/living-room';
import { LoadingCard } from './cards/loading-card';
import { PaymentDue } from './cards/payment-due';
import { PowerUsage } from './cards/power-usage';
import { TransferFunds } from './cards/transfer-funds';
import { UpcomingPayments } from './cards/upcoming-payments';
import { YearlyActivity } from './cards/yearly-activity';

/** Showcase cards, group C: each card in a frame of its reference width. */
const meta: Meta = {
  title: 'Showcase/Cards C',
  parameters: { layout: 'centered' },
  decorators: [
    moduleMetadata({
      imports: [
        CardBalance,
        ConnectBank,
        CoverArt,
        LivingRoom,
        LoadingCard,
        PaymentDue,
        PowerUsage,
        TransferFunds,
        UpcomingPayments,
        YearlyActivity,
      ],
    }),
  ],
};

export default meta;

type Story = StoryObj;

const frame = (width: number, tag: string): Story => ({
  render: () => ({
    template: `<div style="width: ${width}px"><${tag} /></div>`,
  }),
});

export const CardBalanceStory = {
  ...frame(181, 'showcase-card-balance'),
  name: 'Card Balance',
};
export const PaymentDueStory = {
  ...frame(181, 'showcase-payment-due'),
  name: 'Payment Due',
};
export const YearlyActivityStory = {
  ...frame(375, 'showcase-yearly-activity'),
  name: 'Yearly Activity',
};
export const TransferFundsStory = {
  ...frame(375, 'showcase-transfer-funds'),
  name: 'Transfer Funds',
};
export const CoverArtStory = {
  ...frame(375, 'showcase-cover-art'),
  name: 'Cover Art',
};
export const LoadingCardStory = {
  ...frame(375, 'showcase-loading-card'),
  name: 'Loading Card',
};
export const PowerUsageStory = {
  ...frame(375, 'showcase-power-usage'),
  name: 'Power Usage',
};
export const ConnectBankStory = {
  ...frame(375, 'showcase-connect-bank'),
  name: 'Connect Bank',
};
export const UpcomingPaymentsStory = {
  ...frame(375, 'showcase-upcoming-payments'),
  name: 'Upcoming Payments',
};
export const LivingRoomStory = {
  ...frame(375, 'showcase-living-room'),
  name: 'Living Room',
};
