import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './';

/**
 * Carousel — Embla-backed slide region (Angular edition). Mirrors React
 * `Carousel` from `@gremorie/rx-display` (shadcn pattern). Five parts:
 * root + content + item + previous + next.
 */
const meta: Meta<Carousel> = {
  title: 'Display/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        Carousel,
        CarouselContent,
        CarouselItem,
        CarouselPrevious,
        CarouselNext,
      ],
    }),
  ],
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;
type Story = StoryObj<Carousel>;

const SLIDE =
  'flex aspect-square items-center justify-center rounded-md border bg-card text-3xl font-semibold';

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => ({
    props: args,
    template: `
      <div class="px-12 py-6">
        <gn-carousel [orientation]="orientation" class="w-56">
          <gn-carousel-content>
            <gn-carousel-item>
              <div class="${SLIDE}">1</div>
            </gn-carousel-item>
            <gn-carousel-item>
              <div class="${SLIDE}">2</div>
            </gn-carousel-item>
            <gn-carousel-item>
              <div class="${SLIDE}">3</div>
            </gn-carousel-item>
          </gn-carousel-content>
          <gn-carousel-previous />
          <gn-carousel-next />
        </gn-carousel>
      </div>
    `,
  }),
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  parameters: { controls: { disable: true } },
  render: (args) => ({
    props: args,
    template: `
      <div class="px-6 py-12">
        <gn-carousel [orientation]="orientation" class="w-40">
          <gn-carousel-content class="h-40">
            <gn-carousel-item>
              <div class="${SLIDE}">1</div>
            </gn-carousel-item>
            <gn-carousel-item>
              <div class="${SLIDE}">2</div>
            </gn-carousel-item>
            <gn-carousel-item>
              <div class="${SLIDE}">3</div>
            </gn-carousel-item>
          </gn-carousel-content>
          <gn-carousel-previous />
          <gn-carousel-next />
        </gn-carousel>
      </div>
    `,
  }),
};
