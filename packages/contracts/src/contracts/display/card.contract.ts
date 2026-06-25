import { defineContract } from '../../types';

/**
 * Card - a surface primitive for grouping related content.
 * React: `@gremorie/rx-display`. Angular: `@gremorie/ng-display`.
 * A composable Header -> Content -> Footer rhythm; opt in to the parts you need.
 */
export const card = defineContract({
  name: 'card',
  category: 'display',
  status: 'stable',
  anatomy: `
    <card> (rounded, bordered surface; vertical flow)
    ├─ card-header (title/description grid; reserves a slot for action)
    │  ├─ card-title (semibold heading line)
    │  ├─ card-description (muted supporting copy)
    │  └─ card-action (top-right slot: button / menu / switch)
    ├─ card-content (main body, padded horizontally)
    └─ card-footer (bottom row: actions, captions, metadata)`,
  props: [
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Extra classes on any part (every part is a thin styled div; no variants).',
    },
  ],
  guidance: {
    summary:
      'A rounded, bordered surface that groups related content with a Header / Content / Footer rhythm.',
    whenToUse: [
      'Dashboard tiles, KPI surfaces, marketing feature cards.',
      'Wrap a chart: header for title + description, content for the chart, footer for a caption.',
    ],
    whenNotToUse: [
      {
        text: 'A chart with a built-in chart/table toggle and downloads',
        use: 'chart-artifact',
      },
      {
        text: 'A transient layered surface over the page',
        use: 'dialog',
      },
    ],
    rules: [
      'The API is composable, not configurative — render only the parts you need.',
      'CardHeader flips to a grid when a CardAction is present, landing the action top-right.',
      'There are no variants; all styling comes through className / host classes.',
    ],
    example:
      '<card><card-header><card-title>Notifications</card-title><card-description>You have 3 unread messages.</card-description></card-header><card-content>...</card-content></card>',
  },
  preview: {
    rx: 'layout-display-display-card--default',
    ng: 'display-card--default',
  },
  figma: { nodeId: null },
});
