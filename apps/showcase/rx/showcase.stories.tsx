import type { Meta, StoryObj } from '@storybook/react-vite';

// The React Assistant is a docs block, not a package (the Angular one ships
// in ng-ai); this dev-only showcase reaches into the docs app for it.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Assistant } from '../../docs/components/preview/blocks/assistant';
import { AccountAccess } from './cards/account-access';
import { ContributionHistory } from './cards/contribution-history';
import { PayoutThreshold } from './cards/payout-threshold';
import { ReceivingMethod } from './cards/receiving-method';
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
        [<Assistant key="assistant" initialView="empty" />],
        [<AccountAccess key="account-access" />],
        [<ReceivingMethod key="receiving-method" />],
      ]}
    />
  ),
};
