import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { AspectRatio } from './aspect-ratio';

/**
 * AspectRatio — reserves vertical space for media before it loads. Mirrors
 * React `AspectRatio` from `@gremorie/rx-containers`.
 *
 * One-input container (`ratio`). Wrap every responsive image, iframe,
 * video embed, or skeleton placeholder so the layout does not jump when
 * the asset settles — it prevents cumulative layout shift (CLS).
 */
const meta: Meta<AspectRatio> = {
  title: 'Layout & display/Containers/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [moduleMetadata({ imports: [AspectRatio] })],
  argTypes: {
    ratio: { control: { type: 'number' } },
  },
};

export default meta;
type Story = StoryObj<AspectRatio>;

const IMG =
  'https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=800&dpr=2&q=80';

/** A live `ratio` knob inside a fixed-width frame. */
export const Workbench: Story = {
  args: { ratio: 16 / 9 },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-80">
        <gn-aspect-ratio [ratio]="ratio" class="overflow-hidden rounded-lg">
          <img src="${IMG}" alt="Mountain landscape" class="h-full w-full object-cover" />
        </gn-aspect-ratio>
      </div>
    `,
  }),
};

/** A 1/1 square frame. */
export const Square: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="w-64">
        <gn-aspect-ratio [ratio]="1" class="overflow-hidden rounded-lg">
          <img src="${IMG}" alt="Mountain landscape" class="h-full w-full object-cover" />
        </gn-aspect-ratio>
      </div>
    `,
  }),
};

/** As a skeleton placeholder before the asset loads. */
export const Placeholder: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="w-80">
        <gn-aspect-ratio [ratio]="16 / 9" class="bg-muted flex items-center justify-center rounded-lg">
          <span class="text-muted-foreground text-sm">16 / 9</span>
        </gn-aspect-ratio>
      </div>
    `,
  }),
};
