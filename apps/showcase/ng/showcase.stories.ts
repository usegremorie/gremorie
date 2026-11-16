import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Assistant } from '@gremorie/ng-ai';

import { ContributionHistory } from './cards/contribution-history';
import { PayoutThreshold } from './cards/payout-threshold';

/**
 * The Angular showcase: the shadcn reference cards rebuilt with Gremorie
 * components, in the reference's column order, mirroring the React showcase
 * (same id, `showcase--all`). Fixed 375px columns, 40px apart.
 */
const meta: Meta = {
  title: 'Showcase',
  parameters: { layout: 'fullscreen' },
  decorators: [
    moduleMetadata({
      imports: [ContributionHistory, PayoutThreshold, Assistant],
    }),
  ],
};

export default meta;

export const All: StoryObj = {
  render: () => ({
    template: `
      <div class="flex min-h-screen items-start gap-10 bg-background p-10">
        <div class="flex w-[375px] shrink-0 flex-col gap-10">
          <showcase-contribution-history />
        </div>
        <div class="flex w-[375px] shrink-0 flex-col gap-10">
          <showcase-payout-threshold />
        </div>
        <div class="flex w-[375px] shrink-0 flex-col gap-10">
          <ai-assistant initialView="empty" />
        </div>
      </div>
    `,
  }),
};
