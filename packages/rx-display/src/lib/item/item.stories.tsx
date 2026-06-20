import { Button, Switch } from '@gremorie/rx-forms';
import type { Meta, StoryObj } from '@storybook/react';
import { Bell, ChevronRight, FileText, Settings, Star } from 'lucide-react';

import { Badge } from '../badge';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from './item';

// Offline placeholder (named colors, no hex) for the avatar/image media demos.
const IMG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' fill='slategray'/><circle cx='20' cy='15' r='7' fill='white'/><rect x='8' y='26' width='24' height='12' rx='6' fill='white'/></svg>";

/**
 * Item - flexible list-row primitive (compound). One `size` on `Item` cascades
 * to the media size AND the title/description typography via `data-size` +
 * `group-data`, so a single prop scales the whole row.
 *
 * Height rule (media tracks the text block, centered):
 * with description → lg 40 / md 36 / sm 32px; without → lg-md 20 / sm 16px.
 * The `icon` media variant is the only fixed size (24px).
 *
 * ## Anatomy
 *
 * ```text
 * Item                         row container — `size` cascades to media + text
 * ├─ ItemMedia                 icon (fixed 24px) · featured · avatar · image
 * ├─ ItemContent
 * │  ├─ ItemTitle
 * │  └─ ItemDescription        optional — its presence drives the taller media
 * ├─ ItemActions               optional — badge · button · switch
 * └─ ItemHeader / ItemFooter   optional — full-width rows (basis-full)
 *
 * ItemGroup                    role="list" wrapper for stacked Items
 * └─ ItemSeparator             divider between Items
 * ```
 */
const meta = {
  title: 'Layout & display/Display/Item',
  component: Item,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['lg', 'md', 'sm', 'none'],
    },
    variant: {
      control: 'inline-radio',
      options: ['default', 'outline', 'muted'],
    },
    interactive: { control: 'boolean' },
  },
  args: { size: 'md', variant: 'default', interactive: false },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Playground - drive `size` and watch the featured media + title + description
 * scale together from the single prop. Toggle `interactive` for the hover state.
 */
export const Playground: Story = {
  render: (args) => (
    <Item {...args} className="max-w-md">
      <ItemMedia variant="featured">
        <Star />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Starred workspace</ItemTitle>
        <ItemDescription>
          Pinned to the top of your sidebar for quick access.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Badge variant="secondary">Pro</Badge>
      </ItemActions>
    </Item>
  ),
};

/**
 * Matrix - the validation grid: 4 media variants × 3 sizes × with/without
 * description. Wide columns so the row never wraps. The media stays centered and
 * its height tracks the text block at every size.
 */
export const Matrix: Story = {
  name: 'Matrix (media × size × description)',
  parameters: { controls: { disable: true } },
  render: () => {
    const sizes = ['lg', 'md', 'sm'] as const;
    const medias = ['icon', 'featured', 'avatar', 'image'] as const;
    const renderMedia = (variant: (typeof medias)[number]) =>
      variant === 'avatar' || variant === 'image' ? (
        <ItemMedia variant={variant}>
          <img alt="" src={IMG} />
        </ItemMedia>
      ) : (
        <ItemMedia variant={variant}>
          <FileText />
        </ItemMedia>
      );
    return (
      <div className="grid grid-cols-[repeat(2,minmax(320px,1fr))] gap-4">
        {medias.map((variant) =>
          sizes.map((size) => (
            <div className="flex flex-col gap-2" key={`${variant}-${size}`}>
              <p className="text-muted-foreground text-xs">
                {variant} · {size}
              </p>
              <Item size={size} variant="outline">
                {renderMedia(variant)}
                <ItemContent>
                  <ItemTitle>With description</ItemTitle>
                  <ItemDescription>
                    Two-line supporting copy under the title.
                  </ItemDescription>
                </ItemContent>
              </Item>
              <Item size={size} variant="outline">
                {renderMedia(variant)}
                <ItemContent>
                  <ItemTitle>Title only</ItemTitle>
                </ItemContent>
              </Item>
            </div>
          )),
        )}
      </div>
    );
  },
};

/**
 * Sizes - the same row at every size; media + typography scale from `size`.
 */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      {(['lg', 'md', 'sm'] as const).map((size) => (
        <Item key={size} size={size} variant="outline">
          <ItemMedia variant="featured">
            <Settings />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Size {size}</ItemTitle>
            <ItemDescription>Media and text scale together.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <ChevronRight className="size-4 text-muted-foreground" />
          </ItemActions>
        </Item>
      ))}
    </div>
  ),
};

/**
 * Variants - the four media kinds at the default size. `icon` is the bare 24px
 * glyph; the rest are sized containers from the cascade.
 */
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <Bell />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>icon</ItemTitle>
          <ItemDescription>Bare 24px glyph, no container.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="featured">
          <Bell />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>featured</ItemTitle>
          <ItemDescription>Muted square with a centered glyph.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="avatar">
          <img alt="" src={IMG} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>avatar</ItemTitle>
          <ItemDescription>Round, image cover-cropped.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="image">
          <img alt="" src={IMG} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>image</ItemTitle>
          <ItemDescription>Rounded thumbnail.</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ),
};

/**
 * Interactive - hover only when `interactive` is set. The first row reacts; the
 * second is static.
 */
export const Interactive: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <Item interactive variant="outline">
        <ItemMedia variant="featured">
          <Star />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>interactive</ItemTitle>
          <ItemDescription>
            Hover me - cursor + accent background.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="featured">
          <Star />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>static</ItemTitle>
          <ItemDescription>No hover affordance.</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ),
};

/**
 * Without actions - media + content only; `ItemActions` is optional.
 */
export const WithoutActions: Story = {
  name: 'Without actions',
  parameters: { controls: { disable: true } },
  render: () => (
    <Item className="max-w-md" variant="outline">
      <ItemMedia variant="icon">
        <FileText />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>report-q3.pdf</ItemTitle>
      </ItemContent>
    </Item>
  ),
};

/**
 * With toggle - a grouped list where each row carries a Switch in its actions.
 */
export const WithToggle: Story = {
  name: 'Group with toggle',
  parameters: { controls: { disable: true } },
  render: () => (
    <ItemGroup className="max-w-md rounded-lg border">
      {[
        { id: 'n-product', label: 'Product updates', on: true },
        { id: 'n-billing', label: 'Billing alerts', on: true },
        { id: 'n-news', label: 'Weekly newsletter', on: false },
      ].map((row, i, list) => (
        <div key={row.id}>
          <Item size="sm">
            <ItemMedia variant="icon">
              <Bell />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{row.label}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Switch defaultChecked={row.on} />
            </ItemActions>
          </Item>
          {i < list.length - 1 ? <ItemSeparator /> : null}
        </div>
      ))}
    </ItemGroup>
  ),
};

/**
 * With button - a trailing action button instead of a badge/switch.
 */
export const WithButton: Story = {
  name: 'With button',
  parameters: { controls: { disable: true } },
  render: () => (
    <Item className="max-w-md" variant="muted">
      <ItemMedia variant="featured">
        <Settings />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Workspace settings</ItemTitle>
        <ItemDescription>
          Manage members, billing and integrations.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm" variant="outline">
          Open
        </Button>
      </ItemActions>
    </Item>
  ),
};
