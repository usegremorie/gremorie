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
  title: 'Interaction/Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<Skeleton>;

/** Workbench — avatar + two-line caption, a typical list-row placeholder. */
export const Workbench: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-3">
        <gr-skeleton class="size-12 rounded-full" />
        <div class="space-y-2">
          <gr-skeleton class="h-4 w-32" />
          <gr-skeleton class="h-3 w-24" />
        </div>
      </div>
    `,
  }),
};

export const Default: Story = {
  render: () => ({
    template: `<gr-skeleton class="h-4 w-48" />`,
  }),
};

export const TextLines: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="space-y-2 w-80">
        <gr-skeleton class="h-4 w-full" />
        <gr-skeleton class="h-4 w-5/6" />
        <gr-skeleton class="h-4 w-3/4" />
      </div>
    `,
  }),
};

export const Avatar: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex items-center gap-3">
        <gr-skeleton class="size-12 rounded-full" />
        <div class="space-y-2">
          <gr-skeleton class="h-4 w-32" />
          <gr-skeleton class="h-3 w-24" />
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
        <gr-skeleton class="h-32 w-full rounded-md" />
        <gr-skeleton class="h-5 w-3/4" />
        <gr-skeleton class="h-4 w-full" />
        <gr-skeleton class="h-4 w-5/6" />
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
            <gr-skeleton class="size-10 rounded-full" />
            <div class="flex-1 space-y-2">
              <gr-skeleton class="h-3 w-2/3" />
              <gr-skeleton class="h-3 w-full" />
            </div>
          </div>
        }
      </div>
    `,
  }),
};
