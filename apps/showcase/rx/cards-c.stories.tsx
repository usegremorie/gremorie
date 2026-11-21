import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

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
const meta = {
  title: 'Showcase/Cards C',
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;

type Story = StoryObj;

const frame = (width: number, card: ReactNode): Story => ({
  render: () => <div style={{ width }}>{card}</div>,
});

export const CardBalanceStory = {
  ...frame(181, <CardBalance />),
  name: 'Card Balance',
};
export const PaymentDueStory = {
  ...frame(181, <PaymentDue />),
  name: 'Payment Due',
};
export const YearlyActivityStory = {
  ...frame(375, <YearlyActivity />),
  name: 'Yearly Activity',
};
export const TransferFundsStory = {
  ...frame(375, <TransferFunds />),
  name: 'Transfer Funds',
};
export const CoverArtStory = { ...frame(375, <CoverArt />), name: 'Cover Art' };
export const LoadingCardStory = {
  ...frame(375, <LoadingCard />),
  name: 'Loading Card',
};
export const PowerUsageStory = {
  ...frame(375, <PowerUsage />),
  name: 'Power Usage',
};
export const ConnectBankStory = {
  ...frame(375, <ConnectBank />),
  name: 'Connect Bank',
};
export const UpcomingPaymentsStory = {
  ...frame(375, <UpcomingPayments />),
  name: 'Upcoming Payments',
};
export const LivingRoomStory = {
  ...frame(375, <LivingRoom />),
  name: 'Living Room',
};
