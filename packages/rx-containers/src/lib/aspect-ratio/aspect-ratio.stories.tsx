import type { Meta, StoryObj } from '@storybook/react';

import { AspectRatio } from './aspect-ratio';

/**
 * # AspectRatio
 *
 * A one-prop container that reserves vertical space for media before it loads,
 * wrapping Radix AspectRatio. Wrap every responsive image, iframe, video embed,
 * or skeleton placeholder so the layout does not jump when the asset settles —
 * it prevents cumulative layout shift (CLS).
 *
 * ## Anatomy
 *
 * ```text
 * AspectRatio   box whose height is derived from its width and the `ratio` prop; its child fills it (`h-full w-full object-cover`)
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `ratio` | `number` | `1` | Width / height ratio (e.g. `16 / 9`, `4 / 3`). |
 * | `className` | `string` | — | Extra classes (forwarded by Radix). |
 *
 * ## Variables (design tokens)
 *
 * AspectRatio is purely structural and ships no token-driven visuals; styling
 * comes from the media or placeholder you nest inside it.
 */
const meta = {
  title: 'Layout & display/Containers/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    ratio: { control: { type: 'number' } },
  },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

const IMG =
  'https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=800&dpr=2&q=80';

/** A 16/9 widescreen image frame. */
export const Widescreen: Story = {
  render: () => (
    <div className="w-80">
      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg">
        <img
          src={IMG}
          alt="Mountain landscape"
          className="h-full w-full object-cover"
        />
      </AspectRatio>
    </div>
  ),
};

/** A 1/1 square frame. */
export const Square: Story = {
  render: () => (
    <div className="w-64">
      <AspectRatio ratio={1} className="overflow-hidden rounded-lg">
        <img
          src={IMG}
          alt="Mountain landscape"
          className="h-full w-full object-cover"
        />
      </AspectRatio>
    </div>
  ),
};

/** As a skeleton placeholder before the asset loads. */
export const Placeholder: Story = {
  render: () => (
    <div className="w-80">
      <AspectRatio
        ratio={16 / 9}
        className="bg-muted flex items-center justify-center rounded-lg"
      >
        <span className="text-muted-foreground text-sm">16 / 9</span>
      </AspectRatio>
    </div>
  ),
};
