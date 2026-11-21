import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { ExploreCatalog } from './cards/explore-catalog';
import { NewMilestone } from './cards/new-milestone';
import { Notifications } from './cards/notifications';
import { SocialLinks } from './cards/social-links';
import { StockPerformance } from './cards/stock-performance';

/** Showcase cards, group D: each card in a 375px frame. */
const meta = {
  title: 'Showcase/Cards D',
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;

type Story = StoryObj;

const frame = (card: ReactNode) => <div style={{ width: 375 }}>{card}</div>;

export const StockPerformanceCard: Story = {
  name: 'Stock Performance',
  render: () => frame(<StockPerformance />),
};

export const ExploreCatalogCard: Story = {
  name: 'Explore Catalog',
  render: () => frame(<ExploreCatalog />),
};

export const NewMilestoneCard: Story = {
  name: 'Set a new milestone',
  render: () => frame(<NewMilestone />),
};

export const SocialLinksCard: Story = {
  name: 'Social Links',
  render: () => frame(<SocialLinks />),
};

export const NotificationsCard: Story = {
  name: 'Notifications',
  render: () => frame(<Notifications />),
};
