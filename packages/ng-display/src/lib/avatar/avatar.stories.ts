import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from './avatar';

/**
 * Avatar — user / entity portrait with image + fallback.
 *
 * Mirrors React `Avatar`. The image-load lifecycle is hand-rolled (no spartan
 * brain equivalent exposes the size/badge/group anatomy): the fallback renders
 * while the source loads and stays on error or missing `src`.
 */
const meta: Meta<Avatar> = {
  title: 'Layout & display/Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [
        Avatar,
        AvatarImage,
        AvatarFallback,
        AvatarBadge,
        AvatarGroup,
        AvatarGroupCount,
      ],
    }),
  ],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'default', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<Avatar>;

const SRC = 'https://github.com/shadcn.png';

/** Workbench — image with an initials fallback at the chosen size. */
export const Workbench: Story = {
  args: { size: 'default' },
  render: (args) => ({
    props: args,
    template: `
      <gr-avatar [size]="size">
        <gr-avatar-image src="${SRC}" alt="@shadcn" />
        <gr-avatar-fallback>CN</gr-avatar-fallback>
      </gr-avatar>
    `,
  }),
};

/** No image — the fallback initials render directly. */
export const Fallback: Story = {
  render: () => ({
    template: `
      <gr-avatar>
        <gr-avatar-fallback>BK</gr-avatar-fallback>
      </gr-avatar>
    `,
  }),
};

/** The three built-in sizes. */
export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="flex items-end gap-4">
        <gr-avatar size="sm"><gr-avatar-image src="${SRC}" alt="@shadcn" /><gr-avatar-fallback>CN</gr-avatar-fallback></gr-avatar>
        <gr-avatar size="default"><gr-avatar-image src="${SRC}" alt="@shadcn" /><gr-avatar-fallback>CN</gr-avatar-fallback></gr-avatar>
        <gr-avatar size="lg"><gr-avatar-image src="${SRC}" alt="@shadcn" /><gr-avatar-fallback>CN</gr-avatar-fallback></gr-avatar>
      </div>
    `,
  }),
};

/** With a status badge anchored to the corner. */
export const WithBadge: Story = {
  render: () => ({
    template: `
      <gr-avatar size="lg">
        <gr-avatar-image src="${SRC}" alt="@shadcn" />
        <gr-avatar-fallback>CN</gr-avatar-fallback>
        <gr-avatar-badge class="bg-success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
        </gr-avatar-badge>
      </gr-avatar>
    `,
  }),
};

/** A stacked group with an overflow count. */
export const Group: Story = {
  render: () => ({
    template: `
      <gr-avatar-group>
        <gr-avatar><gr-avatar-fallback>AB</gr-avatar-fallback></gr-avatar>
        <gr-avatar><gr-avatar-fallback>CD</gr-avatar-fallback></gr-avatar>
        <gr-avatar><gr-avatar-fallback>EF</gr-avatar-fallback></gr-avatar>
        <gr-avatar-group-count>+5</gr-avatar-group-count>
      </gr-avatar-group>
    `,
  }),
};
