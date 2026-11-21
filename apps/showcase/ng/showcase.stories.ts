import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Assistant } from '@gremorie/ng-ai';

import { AccountAccess } from './cards/account-access';
import { ContributionHistory } from './cards/contribution-history';
import { MonthlySpending } from './cards/monthly-spending';
import { PayoutThreshold } from './cards/payout-threshold';
import { ReceivingMethod } from './cards/receiving-method';

/**
 * The Angular showcase: a set of product cards built with Gremorie
 * components, in a fixed column order, mirroring the React showcase
 * (same id, `showcase--all`). Fixed 375px columns, 40px apart.
 */
const meta: Meta = {
  title: 'Showcase',
  parameters: { layout: 'fullscreen' },
  decorators: [
    moduleMetadata({
      imports: [
        ContributionHistory,
        MonthlySpending,
        PayoutThreshold,
        Assistant,
        AccountAccess,
        ReceivingMethod,
      ],
    }),
  ],
};

export default meta;

// Same columns, rows and classes as the React Masonry
// (apps/showcase/rx/masonry.tsx + columns.tsx); keep the two in sync.
const COLUMN =
  'flex w-full flex-col gap-6 md:w-(--showcase-column) md:shrink-0 md:gap-10';
const DOUBLE = `${COLUMN} md:w-[calc(var(--showcase-column)*2+var(--spacing)*10)]`;

export const All: StoryObj = {
  render: () => ({
    props: { COLUMN, DOUBLE },
    template: `
      <div class="min-h-screen bg-background p-10">
        <div
          data-slot="showcase-masonry"
          class="[--showcase-column:375px] flex flex-col gap-6 md:w-max md:flex-row md:items-start md:gap-10"
        >
          <div data-slot="showcase-column" data-span="1" [class]="COLUMN">
            <showcase-contribution-history />
          </div>
          <div data-slot="showcase-column" data-span="1" [class]="COLUMN">
            <showcase-payout-threshold />
            <showcase-monthly-spending />
          </div>
          <div data-slot="showcase-column" data-span="1" [class]="COLUMN">
            <showcase-account-access />
          </div>
          <div data-slot="showcase-column" data-span="1" [class]="COLUMN">
            <showcase-receiving-method />
          </div>
          <div data-slot="showcase-column" data-span="1" [class]="COLUMN">
            <ai-assistant initialView="empty" />
          </div>
        </div>
      </div>
    `,
  }),
};
