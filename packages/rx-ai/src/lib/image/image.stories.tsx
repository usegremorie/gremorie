import type { Meta, StoryObj } from '@storybook/react';

import { Image } from './image';

/**
 * # Image
 *
 * A faithful port of the Vercel AI Elements **Image** primitive — renders an
 * AI-generated image returned by the AI SDK as a base64 data URL. It accepts the
 * `Experimental_GeneratedImage` shape (`base64`, `mediaType`, `uint8Array`) and
 * produces a responsive, rounded `<img>`.
 *
 * ## Anatomy
 *
 * - **Image** — a single `<img>` whose `src` is a `data:<mediaType>;base64,...`
 *   URL built from the generated image. Responsive (`max-w-full`, `h-auto`),
 *   rounded.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `base64` | `string` | — | Base64-encoded image data. |
 * | `mediaType` | `string` | — | MIME type (e.g. `image/png`). |
 * | `uint8Array` | `Uint8Array` | — | Raw bytes (part of the SDK shape; unused for rendering). |
 * | `alt` | `string` | — | Alt text. |
 * | `className` | `string` | — | Extra classes merged onto the `<img>`. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--radius` | Corner rounding (`rounded-md`). |
 *
 * ## Anatomy
 *
 * ```text
 * Image   renders a base64 image part — leaf primitive (no subcomponents)
 * ```
 */
const meta = {
  title: 'AI/Utilities/Image',
  component: Image,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    alt: { control: 'text' },
  },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

// A tiny 32x32 solid PNG (indigo) encoded as base64.
const SOLID_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAKklEQVR4nGNITvtIU8QwasGoBaMWjFowasGoBaMWjFowasGoBaMWDBULAMgi6FsP9QbPAAAAAElFTkSuQmCC';

// A 64x64 gradient PNG encoded as base64.
const GRADIENT_BASE64 =
  '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';

// The small 64x64 red square PNG shared with the Angular Workbench story.
const RED_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAOklEQVR4nO3OMQEAAAjDMMC/56EBvlRA00naMwsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB47gJ5IgABm0tBHwAAAABJRU5ErkJggg==';

/**
 * Workbench — fixed-width preview frame matching the catalog convention.
 * Same dataset as the Angular Workbench story.
 */
export const Workbench: Story = {
  args: {
    base64: RED_BASE64,
    mediaType: 'image/png',
    uint8Array: new Uint8Array(),
    alt: 'Generated image',
  },
  render: (args) => (
    <div style={{ width: 360 }}>
      <Image {...args} />
    </div>
  ),
};

/** A generated PNG rendered from its base64 payload. */
export const Default: Story = {
  args: {
    base64: GRADIENT_BASE64,
    mediaType: 'image/png',
    uint8Array: new Uint8Array(),
    alt: 'AI-generated gradient',
  },
  render: (args) => (
    <div className="w-64">
      <Image {...args} />
    </div>
  ),
};

/** A small solid-color generated image. */
export const Solid: Story = {
  args: {
    base64: SOLID_BASE64,
    mediaType: 'image/png',
    uint8Array: new Uint8Array(),
    alt: 'AI-generated solid swatch',
  },
  render: (args) => (
    <div className="w-32">
      <Image {...args} />
    </div>
  ),
};
