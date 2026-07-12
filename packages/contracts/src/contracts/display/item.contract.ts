import { defineContract } from '../../types';

/**
 * Item - flexible list-row primitive (compound), adapted from shadcn/ui's
 * Item. React: `@gremorie/rx-display`. Angular: `@gremorie/ng-display`.
 * One `size` on the root cascades to the media size AND the
 * title/description typography via `data-size` + `group-data` selectors.
 */
export const item = defineContract({
  name: 'item',
  category: 'display',
  status: 'stable',
  anatomy: `
    <item>                   (row container; size cascades to media + text)
    ├─ item-media            (icon (fixed 24px) · featured · avatar · image)
    ├─ item-content
    │  ├─ item-title
    │  └─ item-description   (optional; its presence drives the taller media)
    ├─ item-actions          (optional; badge · button · switch)
    └─ item-header / item-footer (optional full-width rows, basis-full)

    <item-group>             (role="list" wrapper for stacked items)
    └─ item-separator        (divider between items)`,
  props: [
    {
      name: 'variant',
      type: "'default' | 'outline' | 'muted'",
      default: 'default',
      options: ['default', 'outline', 'muted'],
      desc: 'Row surface treatment.',
    },
    {
      name: 'size',
      type: "'lg' | 'md' | 'sm' | 'none'",
      default: 'md',
      options: ['lg', 'md', 'sm', 'none'],
      desc: 'Row density; cascades to media size and title/description typography. none removes padding/gap (media/text resolve to md).',
    },
    {
      name: 'interactive',
      type: 'boolean',
      default: false,
      desc: 'Adds cursor + hover accent for clickable rows.',
    },
    {
      name: 'asChild',
      type: 'boolean',
      default: false,
      adapts: { ng: 'not exposed (style the host element directly)' },
      desc: 'Merge styles onto the child (e.g. render as <a> or <button>).',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto any part.',
    },
  ],
  guidance: {
    summary:
      'A flexible list-row: leading media, title + description, trailing actions - one size prop scales the whole row.',
    whenToUse: [
      'Settings rows, notification lists, file rows - any media + text + action row.',
      'Stack rows with item-group (role="list") and item-separator dividers.',
    ],
    whenNotToUse: [
      { text: 'Tabular data with columns', use: 'table' },
      { text: 'A standalone content surface', use: 'card' },
    ],
    rules: [
      'Set size once on the root - media size and typography follow via the data-size cascade; never size the parts individually.',
      'item-description presence switches the media cascade to the taller two-line height.',
      'The icon media variant is the only fixed size (24px); featured / avatar / image follow the cascade.',
      'Set interactive only when the row is actually clickable.',
    ],
    example:
      '<item variant="outline"><item-media variant="featured">...</item-media><item-content><item-title>Starred workspace</item-title><item-description>Pinned for quick access.</item-description></item-content><item-actions>...</item-actions></item>',
  },
  preview: {
    rx: 'layout-display-display-item--workbench',
    ng: 'layout-display-display-item--workbench',
  },
  tag: { rx: 'Item', ng: 'gr-item' },
  example: { variant: 'outline', size: 'md', interactive: false },
  figma: { nodeId: null },
});
