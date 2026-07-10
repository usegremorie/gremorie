import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Badge } from '../badge/badge';
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

// Inline lucide glyphs (no lucide-angular dependency).
const STAR = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
  </svg>`;

const FILE_TEXT = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
    <path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
  </svg>`;

const BELL = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M10.268 21a2 2 0 0 0 3.464 0"/>
    <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>
  </svg>`;

const SETTINGS = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>`;

/**
 * Item — flexible list-row primitive (compound).
 *
 * Mirrors React `Item`. One `size` on `gn-item` cascades to the media size
 * AND the title/description typography via `data-size` + `group-data`, so a
 * single input scales the whole row. The `icon` media variant is the only
 * fixed size (24px).
 */
const meta: Meta<Item> = {
  title: 'Layout & display/Display/Item',
  component: Item,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [
        Item,
        ItemMedia,
        ItemContent,
        ItemTitle,
        ItemDescription,
        ItemActions,
        ItemGroup,
        ItemSeparator,
        Badge,
      ],
    }),
  ],
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
};

export default meta;
type Story = StoryObj<Item>;

/**
 * Workbench — featured media + content + trailing badge at a fixed width,
 * driven by the size / variant / interactive controls.
 */
export const Workbench: Story = {
  args: { size: 'md', variant: 'outline', interactive: false },
  render: (args) => ({
    props: args,
    template: `
      <gn-item [size]="size" [variant]="variant" [interactive]="interactive" class="w-96">
        <gn-item-media variant="featured">
          ${STAR}
        </gn-item-media>
        <gn-item-content>
          <gn-item-title>Starred workspace</gn-item-title>
          <gn-item-description>
            Pinned to the top of your sidebar for quick access.
          </gn-item-description>
        </gn-item-content>
        <gn-item-actions>
          <gn-badge variant="secondary">Pro</gn-badge>
        </gn-item-actions>
      </gn-item>
    `,
  }),
};

/**
 * Sizes — the same row at every size; media + typography scale from `size`.
 */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex max-w-md flex-col gap-3">
        @for (size of ['lg', 'md', 'sm']; track size) {
          <gn-item [size]="size" variant="outline">
            <gn-item-media variant="featured">
              ${SETTINGS}
            </gn-item-media>
            <gn-item-content>
              <gn-item-title>Size {{ size }}</gn-item-title>
              <gn-item-description>Media and text scale together.</gn-item-description>
            </gn-item-content>
          </gn-item>
        }
      </div>
    `,
  }),
};

/**
 * Variants — the four media kinds at the default size. `icon` is the bare
 * 24px glyph; the rest are sized containers from the cascade.
 */
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex max-w-md flex-col gap-3">
        <gn-item variant="outline">
          <gn-item-media variant="icon">
            ${BELL}
          </gn-item-media>
          <gn-item-content>
            <gn-item-title>icon</gn-item-title>
            <gn-item-description>Bare 24px glyph, no container.</gn-item-description>
          </gn-item-content>
        </gn-item>
        <gn-item variant="outline">
          <gn-item-media variant="featured">
            ${BELL}
          </gn-item-media>
          <gn-item-content>
            <gn-item-title>featured</gn-item-title>
            <gn-item-description>Muted square with a centered glyph.</gn-item-description>
          </gn-item-content>
        </gn-item>
        <gn-item variant="outline">
          <gn-item-media variant="avatar">
            <img alt="" src="${IMG}" />
          </gn-item-media>
          <gn-item-content>
            <gn-item-title>avatar</gn-item-title>
            <gn-item-description>Round, image cover-cropped.</gn-item-description>
          </gn-item-content>
        </gn-item>
        <gn-item variant="outline">
          <gn-item-media variant="image">
            <img alt="" src="${IMG}" />
          </gn-item-media>
          <gn-item-content>
            <gn-item-title>image</gn-item-title>
            <gn-item-description>Rounded thumbnail.</gn-item-description>
          </gn-item-content>
        </gn-item>
      </div>
    `,
  }),
};

/**
 * Interactive — hover only when `interactive` is set. The first row reacts;
 * the second is static.
 */
export const Interactive: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex max-w-md flex-col gap-3">
        <gn-item [interactive]="true" variant="outline">
          <gn-item-media variant="featured">
            ${STAR}
          </gn-item-media>
          <gn-item-content>
            <gn-item-title>interactive</gn-item-title>
            <gn-item-description>Hover me - cursor + accent background.</gn-item-description>
          </gn-item-content>
        </gn-item>
        <gn-item variant="outline">
          <gn-item-media variant="featured">
            ${STAR}
          </gn-item-media>
          <gn-item-content>
            <gn-item-title>static</gn-item-title>
            <gn-item-description>No hover affordance.</gn-item-description>
          </gn-item-content>
        </gn-item>
      </div>
    `,
  }),
};

/**
 * Group — `role="list"` wrapper with separators between rows.
 */
export const Group: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gn-item-group class="max-w-md rounded-lg border">
        <gn-item size="sm">
          <gn-item-media variant="icon">
            ${FILE_TEXT}
          </gn-item-media>
          <gn-item-content>
            <gn-item-title>report-q3.pdf</gn-item-title>
          </gn-item-content>
        </gn-item>
        <gn-item-separator />
        <gn-item size="sm">
          <gn-item-media variant="icon">
            ${FILE_TEXT}
          </gn-item-media>
          <gn-item-content>
            <gn-item-title>report-q4.pdf</gn-item-title>
          </gn-item-content>
        </gn-item>
      </gn-item-group>
    `,
  }),
};
