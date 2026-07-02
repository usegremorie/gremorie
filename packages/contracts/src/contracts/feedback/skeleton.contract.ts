import { defineContract } from '../../types';

/**
 * Skeleton - a pulsing placeholder block that stands in for content still being
 * fetched, reserving layout to avoid shift. React: `@gremorie/rx-feedback`.
 * Angular: `@gremorie/ng-feedback`.
 */
export const skeleton = defineContract({
  name: 'skeleton',
  category: 'feedback',
  status: 'stable',
  anatomy: `
    <skeleton>
    └─ block (single pulsing, rounded box sized by its className)`,
  props: [
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Width / height / shape — this is the whole API.',
    },
  ],
  guidance: {
    summary:
      'A pulsing block shaped to match the real content it temporarily replaces.',
    whenToUse: [
      'Loading states where you know the geometry of the incoming content (text lines, avatars, cards) and want to reserve its layout.',
    ],
    whenNotToUse: [
      { text: 'A task with a known percent complete', use: 'progress' },
      { text: 'A media slot awaiting an image/video', use: 'aspect-ratio' },
    ],
    rules: [
      'Size and shape the skeleton with className to mirror the real content so there is no layout shift when data arrives.',
      'Animation is animate-pulse; users with prefers-reduced-motion see the static state automatically.',
      'Pair with aria-busy="true" and aria-live="polite" on the surrounding region so screen readers announce loading.',
    ],
    example: '<skeleton className="h-4 w-[250px]" />',
  },
  preview: {
    rx: 'interaction-feedback-skeleton--default',
    ng: 'feedback-skeleton--default',
  },
  tag: { rx: 'Skeleton', ng: 'gn-skeleton' },
  // No controllable scalar props (className only); nothing to seed.
  example: {},
  figma: { nodeId: null },
});
