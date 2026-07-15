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
  title: 'Layout & display/Display/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
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

/** Workbench — three slides with prev/next controls at a fixed width. */
export const Workbench: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => ({
    props: args,
    template: `
      <div class="px-12 py-6">
        <gr-carousel [orientation]="orientation" class="w-56">
          <gr-carousel-content>
            <gr-carousel-item>
              <div class="${SLIDE}">1</div>
            </gr-carousel-item>
            <gr-carousel-item>
              <div class="${SLIDE}">2</div>
            </gr-carousel-item>
            <gr-carousel-item>
              <div class="${SLIDE}">3</div>
            </gr-carousel-item>
          </gr-carousel-content>
          <gr-carousel-previous />
          <gr-carousel-next />
        </gr-carousel>
      </div>
    `,
  }),
};

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => ({
    props: args,
    template: `
      <div class="px-12 py-6">
        <gr-carousel [orientation]="orientation" class="w-56">
          <gr-carousel-content>
            <gr-carousel-item>
              <div class="${SLIDE}">1</div>
            </gr-carousel-item>
            <gr-carousel-item>
              <div class="${SLIDE}">2</div>
            </gr-carousel-item>
            <gr-carousel-item>
              <div class="${SLIDE}">3</div>
            </gr-carousel-item>
          </gr-carousel-content>
          <gr-carousel-previous />
          <gr-carousel-next />
        </gr-carousel>
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
        <gr-carousel [orientation]="orientation" class="w-40">
          <gr-carousel-content class="h-40">
            <gr-carousel-item>
              <div class="${SLIDE}">1</div>
            </gr-carousel-item>
            <gr-carousel-item>
              <div class="${SLIDE}">2</div>
            </gr-carousel-item>
            <gr-carousel-item>
              <div class="${SLIDE}">3</div>
            </gr-carousel-item>
          </gr-carousel-content>
          <gr-carousel-previous />
          <gr-carousel-next />
        </gr-carousel>
      </div>
    `,
  }),
};
