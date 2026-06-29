import type { Meta, StoryObj } from '@storybook/react';
import { Check } from 'lucide-react';

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from './avatar';

/**
 * # Avatar
 *
 * A user / entity portrait with image + fallback, wrapping
 * `@radix-ui/react-avatar`. Radix handles the image-load lifecycle: the
 * fallback renders while the source loads and stays if the load errors or no
 * `src` is given — so an Avatar never shows a broken image or empty circle.
 *
 * ## Anatomy
 *
 * ```text
 * Avatar                  root circle; sets size via data-size
 * ├─ AvatarImage          the portrait; hidden until loaded
 * ├─ AvatarFallback       initials/icon shown while loading or on error
 * └─ AvatarBadge          small status dot anchored bottom-right
 * AvatarGroup             overlapping -space-x-2 stack of Avatars
 * ├─ Avatar               each stacked portrait (see above)
 * └─ AvatarGroupCount     "+N" overflow chip
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `size` | `"sm" \| "default" \| "lg"` | `"default"` | 24 / 32 / 40 px (propagated to subparts via `data-size`). |
 * | `className` | `string` | — | Extra classes (use `size-12`+ for an `xl` avatar). |
 *
 * `AvatarImage` and `AvatarFallback` forward their Radix props
 * (`src`, `alt`, `delayMs`, …).
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `AvatarImage` | The portrait image. |
 * | `AvatarFallback` | Initials/icon fallback. |
 * | `AvatarBadge` | Bottom-right status dot. |
 * | `AvatarGroup` | Overlapping `-space-x-2` row. |
 * | `AvatarGroupCount` | "+N" overflow chip. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--muted` / `--muted-foreground` | fallback background + text |
 * | `--primary` / `--primary-foreground` | `AvatarBadge` fill |
 * | `--background` | the ring separating stacked avatars |
 */
const meta = {
  title: 'Layout & display/Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'default', 'lg'] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

const SRC = 'https://github.com/shadcn.png';

/** Image with an initials fallback (shown if the image fails to load). */
export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={SRC} alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

/** No image — the fallback initials render directly. */
export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>BK</AvatarFallback>
    </Avatar>
  ),
};

/** The three built-in sizes. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarImage src={SRC} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};

/** With a status badge anchored to the corner. */
export const WithBadge: Story = {
  render: () => (
    <Avatar size="lg">
      <AvatarImage src={SRC} alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
      <AvatarBadge className="bg-success">
        <Check />
      </AvatarBadge>
    </Avatar>
  ),
};

/** A stacked group with an overflow count. */
export const Group: Story = {
  render: () => (
    <AvatarGroup>
      {['AB', 'CD', 'EF'].map((initials) => (
        <Avatar key={initials}>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+5</AvatarGroupCount>
    </AvatarGroup>
  ),
};
