import type { Meta, StoryObj } from '@storybook/angular';

import { Spinner } from './spinner';

/**
 * Spinner — indeterminate "thinking" indicator.
 *
 * Three sizes via the `size` input. Stories validate each size renders
 * with the right SVG dimension and that `animate-spin` applies.
 */
const meta: Meta<Spinner> = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'default', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<Spinner>;

export const Default: Story = {
  args: { size: 'default' },
  render: (args) => ({
    props: args,
    template: `<gn-spinner [size]="size" />`,
  }),
};

export const Small: Story = {
  args: { size: 'sm' },
  render: (args) => ({
    props: args,
    template: `<gn-spinner [size]="size" />`,
  }),
};

export const Large: Story = {
  args: { size: 'lg' },
  render: (args) => ({
    props: args,
    template: `<gn-spinner [size]="size" />`,
  }),
};

export const AllSizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex items-center gap-6">
        <div class="flex flex-col items-center gap-2">
          <gn-spinner size="sm" />
          <span class="text-xs text-muted-foreground">sm</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <gn-spinner />
          <span class="text-xs text-muted-foreground">default</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <gn-spinner size="lg" />
          <span class="text-xs text-muted-foreground">lg</span>
        </div>
      </div>
    `,
  }),
};

/**
 * Inline — Spinner sits next to text. Inherits `currentColor` so it
 * tints with the surrounding text color.
 */
export const Inline: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <gn-spinner size="sm" />
        <span>Loading conversations…</span>
      </div>
    `,
  }),
};
