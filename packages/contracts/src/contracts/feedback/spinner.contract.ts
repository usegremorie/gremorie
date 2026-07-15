import { defineContract } from '../../types';

/**
 * Spinner - an indeterminate "thinking" indicator (a single rotating Loader2
 * glyph). React: `@gremorie/rx-feedback` (faithful shadcn/ui port, lucide
 * `Loader2Icon` + `animate-spin`). Angular: `@gremorie/ng-feedback` (inline
 * SVG with the same geometry).
 */
export const spinner = defineContract({
  name: 'spinner',
  category: 'feedback',
  status: 'stable',
  anatomy: `
    <spinner>                (single rotating Loader2 glyph; role="status",
                              aria-live="polite", aria-label="Loading")`,
  props: [
    {
      name: 'size',
      type: "'sm' | 'default' | 'lg'",
      default: 'default',
      options: ['sm', 'default', 'lg'],
      desc: '12 / 16 / 24 px glyph.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Extra classes (e.g. a text color).',
    },
  ],
  guidance: {
    summary:
      'An indeterminate loading indicator - a single rotating glyph that fits anywhere text fits.',
    whenToUse: [
      'Signal in-flight work of unknown duration - inline next to text, inside a button, in an empty state.',
    ],
    whenNotToUse: [
      { text: 'The percent complete is known', use: 'progress' },
      {
        text: 'Reserving layout for the shape of loading content',
        use: 'skeleton',
      },
    ],
    rules: [
      'The glyph strokes currentColor, so it tints with the surrounding text color.',
      'Announced to AT via role="status" + aria-live="polite" + aria-label="Loading" out of the box.',
      'Keep it small and local; a full-page spinner is usually a Skeleton layout instead.',
    ],
    example: '<spinner size="sm" /> Loading conversations…',
  },
  preview: {
    rx: 'interaction-feedback-spinner--workbench',
    ng: 'interaction-feedback-spinner--workbench',
  },
  tag: { rx: 'Spinner', ng: 'gr-spinner' },
  example: { size: 'default' },
  figma: { nodeId: null },
});
