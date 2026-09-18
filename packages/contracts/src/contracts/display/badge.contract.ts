import { defineContract } from '../../types';

/**
 * Badge - a compact label for status, counts and tags.
 * React: `@gremorie/rx-display` (CVA-styled span, asChild via Radix Slot).
 * Angular: `@gremorie/ng-display` (CVA-styled host element).
 */
export const badge = defineContract({
  name: 'badge',
  category: 'display',
  status: 'stable',
  anatomy: `
    <badge> (single inline pill: rounded, bordered)
    └─ [leading svg icon] + text`,
  props: [
    {
      name: 'variant',
      type: "'default' | 'secondary' | 'destructive' | 'warning' | 'success' | 'outline' | 'ghost' | 'link'",
      default: 'default',
      options: [
        'default',
        'secondary',
        'destructive',
        'warning',
        'success',
        'outline',
        'ghost',
        'link',
      ],
      desc: 'Visual style. `destructive` / `warning` / `success` are the status fills (error, attention, ok) — each pair clears WCAG AA 4.5:1 in light and dark.',
    },
    {
      name: 'asChild',
      type: 'boolean',
      default: false,
      adapts: {
        ng: 'not exposed (wrap in an <a> / use routerLink for a link badge)',
      },
      desc: 'Merge styles onto the child (e.g. render as <a>); enables the [a&] hover affordances.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Extra classes merged via cn.',
    },
  ],
  guidance: {
    summary: 'A compact, static label for status, counts and tags.',
    whenToUse: [
      'Annotate status, counts or categories inline (e.g. "Beta", "3 new").',
      'Signal a state with the status fills: variant="success" (ok), "warning" (attention), "destructive" (error).',
      'Render a link-styled tag with variant="link" or asChild + an anchor.',
    ],
    whenNotToUse: [
      {
        text: 'Interactive selection-style chips (toggleable)',
        use: 'toggle-group',
      },
      {
        text: 'A clickable command',
        use: 'button',
      },
    ],
    rules: [
      'Badge is a static label primitive — it is not interactive by default.',
      'The [a&] hover styles only light up when the badge is rendered as an anchor (React asChild; Angular wrap with <a>).',
    ],
    example: '<badge variant="secondary">Secondary</badge>',
  },
  preview: {
    rx: 'layout-display-display-badge--workbench',
    ng: 'layout-display-display-badge--workbench',
  },
  tag: { rx: 'Badge', ng: 'gr-badge' },
  example: { variant: 'default' },
  figma: { nodeId: null },
});
