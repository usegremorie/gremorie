import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Image } from './image';

/**
 * Image — renders an AI SDK generated image (base64 + mediaType) as an
 * `<img>`. Mirrors React `Image` from `@gremorie/rx-ai`.
 */
const meta: Meta<Image> = {
  title: 'AI/Image',
  component: Image,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [Image] })],
};

export default meta;
type Story = StoryObj<Image>;

// A tiny inline 1x1 PNG so the story is self-contained (no network).
const PNG_1x1 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGNgYGAAAAAEAAH2FzhVAAAAAElFTkSuQmCC';
// A small 64x64 red square PNG for a more visible preview.
const PNG_RED =
  'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAOklEQVR4nO3OMQEAAAjDMMC/56EBvlRA00naMwsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB47gJ5IgABm0tBHwAAAABJRU5ErkJggg==';

/**
 * Workbench — fixed-width preview frame matching the catalog convention.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: () => ({
    template: `
      <div style="width: 360px;">
        <image
          base64="${PNG_RED}"
          mediaType="image/png"
          alt="Generated image"
        />
      </div>
    `,
  }),
};

/**
 * Default — a generated image rendered from base64 data.
 */
export const Default: Story = {
  render: () => ({
    template: `
      <image
        base64="${PNG_RED}"
        mediaType="image/png"
        alt="A generated red square"
      />
    `,
  }),
};

/**
 * With custom class — constrain the rendered width via the `class` input.
 */
export const WithCustomClass: Story = {
  render: () => ({
    template: `
      <image
        base64="${PNG_1x1}"
        mediaType="image/png"
        alt="Transparent pixel"
        class="size-24 border"
      />
    `,
  }),
};
