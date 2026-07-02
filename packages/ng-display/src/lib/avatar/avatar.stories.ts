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
  title: 'Display/Avatar',
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
      <gn-avatar [size]="size">
        <gn-avatar-image src="${SRC}" alt="@shadcn" />
        <gn-avatar-fallback>CN</gn-avatar-fallback>
      </gn-avatar>
    `,
  }),
};

/** No image — the fallback initials render directly. */
export const Fallback: Story = {
  render: () => ({
    template: `
      <gn-avatar>
        <gn-avatar-fallback>BK</gn-avatar-fallback>
      </gn-avatar>
    `,
  }),
};

/** The three built-in sizes. */
export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="flex items-end gap-4">
        <gn-avatar size="sm"><gn-avatar-image src="${SRC}" alt="@shadcn" /><gn-avatar-fallback>CN</gn-avatar-fallback></gn-avatar>
        <gn-avatar size="default"><gn-avatar-image src="${SRC}" alt="@shadcn" /><gn-avatar-fallback>CN</gn-avatar-fallback></gn-avatar>
        <gn-avatar size="lg"><gn-avatar-image src="${SRC}" alt="@shadcn" /><gn-avatar-fallback>CN</gn-avatar-fallback></gn-avatar>
      </div>
    `,
  }),
};

/** With a status badge anchored to the corner. */
export const WithBadge: Story = {
  render: () => ({
    template: `
      <gn-avatar size="lg">
        <gn-avatar-image src="${SRC}" alt="@shadcn" />
        <gn-avatar-fallback>CN</gn-avatar-fallback>
        <gn-avatar-badge class="bg-success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
        </gn-avatar-badge>
      </gn-avatar>
    `,
  }),
};

/** A stacked group with an overflow count. */
export const Group: Story = {
  render: () => ({
    template: `
      <gn-avatar-group>
        <gn-avatar><gn-avatar-fallback>AB</gn-avatar-fallback></gn-avatar>
        <gn-avatar><gn-avatar-fallback>CD</gn-avatar-fallback></gn-avatar>
        <gn-avatar><gn-avatar-fallback>EF</gn-avatar-fallback></gn-avatar>
        <gn-avatar-group-count>+5</gn-avatar-group-count>
      </gn-avatar-group>
    `,
  }),
};
