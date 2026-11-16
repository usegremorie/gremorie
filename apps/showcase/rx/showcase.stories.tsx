import type { Meta, StoryObj } from '@storybook/react-vite';

import { ContributionHistory } from './cards/contribution-history';
import { PayoutThreshold } from './cards/payout-threshold';
import { NewChat } from './cards/new-chat';
import { PromptSelects } from './cards/prompt-selects';
import { Masonry } from './masonry';

/**
 * The React showcase: the shadcn reference cards rebuilt with Gremorie
 * components, in the reference's column order. The workbench embeds this
 * story (id `showcase--all`) next to the Angular one and the reference.
 */
const meta = {
  title: 'Showcase',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;

export const All: StoryObj = {
  render: () => (
    <Masonry
      columns={[
        [<ContributionHistory key="contribution-history" />],
        [<PayoutThreshold key="payout-threshold" />],
        [<NewChat key="new-chat" />, <PromptSelects key="prompt-selects" />],
      ]}
    />
  ),
};
