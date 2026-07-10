import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { ScrollArea } from './scroll-area';

/**
 * ScrollArea — a themeable scroll container with consistent, cross-OS
 * scrollbar styling. Mirrors React `ScrollArea` from `@gremorie/rx-containers`.
 *
 * Divergence: there is no Angular Radix ScrollArea. The Angular edition is a
 * `gremorie` directive applied to ngx-scrollbar's `<ng-scrollbar>`, which
 * renders both axes automatically; the Gremorie look (thin, rounded,
 * `--border`-colored thumb) is applied through ngx-scrollbar's CSS custom
 * properties.
 */
const meta: Meta<ScrollArea> = {
  title: 'Layout & display/Containers/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [moduleMetadata({ imports: [NgScrollbarModule, ScrollArea] })],
};

export default meta;
type Story = StoryObj<ScrollArea>;

const TAGS = Array.from({ length: 40 }, (_, i) => `v1.2.0-beta.${40 - i}`);

/** Workbench — vertical overflow: a long, fixed-height list. */
export const Workbench: Story = {
  render: () => ({
    props: { tags: TAGS },
    template: `
      <ng-scrollbar gremorie class="h-64 w-56 rounded-md border">
        <div class="p-4">
          <h4 class="mb-3 text-sm font-medium">Tags</h4>
          @for (tag of tags; track tag) {
            <div class="border-border border-b last:border-b-0">
              <div class="py-1.5 font-mono text-sm">{{ tag }}</div>
            </div>
          }
        </div>
      </ng-scrollbar>
    `,
  }),
};
