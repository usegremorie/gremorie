import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ExploreCatalog } from './cards/explore-catalog';
import { NewMilestone } from './cards/new-milestone';
import { Notifications } from './cards/notifications';
import { SocialLinks } from './cards/social-links';
import { StockPerformance } from './cards/stock-performance';

/** Showcase cards, group D: each card in a 375px frame (mirrors React). */
const meta: Meta = {
  title: 'Showcase/Cards D',
  parameters: { layout: 'centered' },
  decorators: [
    moduleMetadata({
      imports: [
        ExploreCatalog,
        NewMilestone,
        Notifications,
        SocialLinks,
        StockPerformance,
      ],
    }),
  ],
};

export default meta;

type Story = StoryObj;

const frame =
  (card: string): Story['render'] =>
  () => ({
    template: `<div style="width: 375px">${card}</div>`,
  });

export const StockPerformanceCard: Story = {
  name: 'Stock Performance',
  render: frame('<showcase-stock-performance />'),
};

export const ExploreCatalogCard: Story = {
  name: 'Explore Catalog',
  render: frame('<showcase-explore-catalog />'),
};

export const NewMilestoneCard: Story = {
  name: 'Set a new milestone',
  render: frame('<showcase-new-milestone />'),
};

export const SocialLinksCard: Story = {
  name: 'Social Links',
  render: frame('<showcase-social-links />'),
};

export const NotificationsCard: Story = {
  name: 'Notifications',
  render: frame('<showcase-notifications />'),
};
