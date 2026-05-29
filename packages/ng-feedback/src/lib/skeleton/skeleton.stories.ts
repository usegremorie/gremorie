import type { Meta, StoryObj } from '@storybook/angular';

import { Skeleton } from './skeleton';

/**
 * Skeleton — placeholder block for loading states.
 *
 * No variants; styled entirely through utility classes that shape the
 * geometry of the real content. Stories cover canonical patterns: text
 * line, avatar, card, list.
 */
const meta: Meta<Skeleton> = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<Skeleton>;

export const Default: Story = {
  render: () => ({
    template: `<gn-skeleton class="h-4 w-48" />`,
  }),
};

export const TextLines: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="space-y-2 w-80">
        <gn-skeleton class="h-4 w-full" />
        <gn-skeleton class="h-4 w-5/6" />
        <gn-skeleton class="h-4 w-3/4" />
      </div>
    `,
  }),
};

export const Avatar: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex items-center gap-3">
        <gn-skeleton class="size-12 rounded-full" />
        <div class="space-y-2">
          <gn-skeleton class="h-4 w-32" />
          <gn-skeleton class="h-3 w-24" />
        </div>
      </div>
    `,
  }),
};

export const CardPattern: Story = {
  name: 'Card pattern',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="space-y-3 rounded-xl border p-4 w-80">
        <gn-skeleton class="h-32 w-full rounded-md" />
        <gn-skeleton class="h-5 w-3/4" />
        <gn-skeleton class="h-4 w-full" />
        <gn-skeleton class="h-4 w-5/6" />
      </div>
    `,
  }),
};

export const ListPattern: Story = {
  name: 'List pattern',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="space-y-4 w-80">
        @for (i of [0,1,2,3]; track i) {
          <div class="flex items-center gap-3">
            <gn-skeleton class="size-10 rounded-full" />
            <div class="flex-1 space-y-2">
              <gn-skeleton class="h-3 w-2/3" />
              <gn-skeleton class="h-3 w-full" />
            </div>
          </div>
        }
      </div>
    `,
  }),
};
