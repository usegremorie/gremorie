import { defineContract } from '../../types';

/**
 * Carousel - a horizontally (or vertically) scrollable slide region, built on Embla.
 * React: `@gremorie/rx-display` (embla-carousel-react).
 * Angular: `@gremorie/ng-display` (embla-carousel core).
 */
export const carousel = defineContract({
  name: 'carousel',
  category: 'display',
  status: 'stable',
  anatomy: `
    <carousel> (Embla root: orientation, opts, plugins; arrow-key nav)
    ├─ carousel-content (overflow viewport + flex track)
    │  └─ carousel-item (one slide; basis-full by default)
    ├─ carousel-previous (prev-slide button; auto-disabled at start)
    └─ carousel-next (next-slide button; auto-disabled at end)`,
  props: [
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: 'horizontal',
      options: ['horizontal', 'vertical'],
      desc: 'Scroll axis.',
    },
    {
      name: 'opts',
      type: 'EmblaOptionsType',
      desc: 'Embla options (loop, align, ...).',
    },
    {
      name: 'plugins',
      type: 'EmblaPluginType[]',
      desc: 'Embla plugins (e.g. autoplay).',
    },
    {
      name: 'setApi',
      type: '(api: CarouselApi) => void',
      adapts: { ng: 'not exposed (read the api off CarouselService)' },
      desc: 'Receive the Embla API for external control.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto the part.',
    },
  ],
  guidance: {
    summary:
      'An Embla-backed slide region with auto-disabling arrow controls and keyboard navigation.',
    whenToUse: [
      'Galleries, testimonials, partner logos — presence matters more than order.',
    ],
    whenNotToUse: [
      {
        text: 'Prioritized content that must all stay visible',
        use: 'card',
      },
      {
        text: 'Mutually-exclusive panels with persistent triggers',
        use: 'tabs',
      },
    ],
    rules: [
      'Carousels hide content past the first slide — use only when order matters less than presence.',
      'Always pair with the arrow controls; arrow keys scroll when focus is inside the region.',
      'Auto-rotation (via an Embla autoplay plugin) must be pausable.',
    ],
    example:
      '<carousel><carousel-content><carousel-item>Slide 1</carousel-item><carousel-item>Slide 2</carousel-item></carousel-content><carousel-previous /><carousel-next /></carousel>',
  },
  preview: {
    rx: 'layout-display-display-carousel--default',
    ng: 'display-carousel--horizontal',
  },
  tag: { rx: 'Carousel', ng: 'gn-carousel' },
  example: { orientation: 'horizontal' },
  figma: { nodeId: null },
});
