import type { Meta, StoryObj } from '@storybook/react';

import { Card, CardContent } from '../card/card';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './carousel';

/**
 * # Carousel
 *
 * A horizontally (or vertically) scrollable slide region, built on Embla. Use
 * carousels only when order matters less than presence (galleries,
 * testimonials, partner logos) — they hide content past the first slide. Always
 * pair with the arrow controls; keyboard arrows are wired in by the root.
 *
 * ## Anatomy
 *
 * ```text
 * Carousel                       Embla root + context provider (orientation, opts, plugins)
 * ├─ CarouselContent             overflow viewport + flex track
 * │  └─ CarouselItem             a single slide (basis-full by default)
 * ├─ CarouselPrevious            previous-slide arrow button, auto-disabled at the start
 * └─ CarouselNext                next-slide arrow button, auto-disabled at the end
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Scroll axis. |
 * | `opts` | `EmblaOptionsType` | — | Embla options (`loop`, `align`, …). |
 * | `plugins` | `EmblaPluginType[]` | — | Embla plugins (e.g. autoplay). |
 * | `setApi` | `(api) => void` | — | Receive the Embla API for external control. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `CarouselContent` | Viewport + track. |
 * | `CarouselItem` | One slide. |
 * | `CarouselPrevious` | Previous-slide button. |
 * | `CarouselNext` | Next-slide button. |
 *
 * ## Variables (design tokens)
 *
 * The arrow buttons inherit `Button`'s `outline` variant tokens (`--border`,
 * `--accent`, `--ring`); slide content is consumer-styled.
 */
const meta = {
  title: 'Layout & display/Display/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const SLIDES = [1, 2, 3, 4, 5];

/** A basic horizontal carousel with prev/next controls. */
export const Default: Story = {
  render: () => (
    <Carousel className="w-64">
      <CarouselContent>
        {SLIDES.map((n) => (
          <CarouselItem key={n}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <span className="text-4xl font-semibold">{n}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

/** Multiple items per view via `basis-*` on the items, with `loop`. */
export const MultipleItems: Story = {
  render: () => (
    <Carousel opts={{ loop: true, align: 'start' }} className="w-72">
      <CarouselContent>
        {SLIDES.map((n) => (
          <CarouselItem key={n} className="basis-1/2">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <span className="text-2xl font-semibold">{n}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

/** Vertical orientation — arrows rotate and move above/below the track. */
export const Vertical: Story = {
  render: () => (
    <Carousel orientation="vertical" className="w-64">
      <CarouselContent className="h-64">
        {SLIDES.map((n) => (
          <CarouselItem key={n} className="basis-1/2">
            <Card>
              <CardContent className="flex items-center justify-center p-6">
                <span className="text-2xl font-semibold">{n}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};
