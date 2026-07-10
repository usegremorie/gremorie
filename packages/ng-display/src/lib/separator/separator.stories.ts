import type { Meta, StoryObj } from '@storybook/angular';

import { Separator } from './separator';

/**
 * Separator — visual divider between groups of content.
 *
 * Mirrors React `Separator`. Behavior (decorative vs. semantic role,
 * orientation) is delegated to spartan brain `BrnSeparator`.
 */
const meta: Meta<Separator> = {
  title: 'Layout & display/Display/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    decorative: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Separator>;

/**
 * Workbench — horizontal divider between two stacked blocks at a fixed width.
 */
export const Workbench: Story = {
  args: { orientation: 'horizontal', decorative: true },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-80">
        <div class="space-y-1">
          <h4 class="text-sm font-medium leading-none">Radix Primitives</h4>
          <p class="text-sm text-muted-foreground">An open-source UI component library.</p>
        </div>
        <gn-separator [orientation]="orientation" [decorative]="decorative" class="my-4" />
        <div class="flex h-5 items-center gap-4 text-sm">
          <span>Blog</span>
          <gn-separator orientation="vertical" />
          <span>Docs</span>
          <gn-separator orientation="vertical" />
          <span>Source</span>
        </div>
      </div>
    `,
  }),
};

/** Horizontal — full-width hairline between sections. */
export const Horizontal: Story = {
  render: () => ({
    template: `
      <div class="w-80">
        <p class="text-sm">Above</p>
        <gn-separator class="my-4" />
        <p class="text-sm">Below</p>
      </div>
    `,
  }),
};

/** Vertical — divides inline items; needs a height context. */
export const Vertical: Story = {
  render: () => ({
    template: `
      <div class="flex h-5 items-center gap-4 text-sm">
        <span>One</span>
        <gn-separator orientation="vertical" />
        <span>Two</span>
        <gn-separator orientation="vertical" />
        <span>Three</span>
      </div>
    `,
  }),
};
