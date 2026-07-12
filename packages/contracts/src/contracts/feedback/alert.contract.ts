import { defineContract } from '../../types';

/**
 * Alert - an in-flow feedback message anchored inside page content (distinct
 * from a transient toast or a page-spanning banner). React: `@gremorie/rx-feedback`.
 * Angular: `@gremorie/ng-feedback`.
 */
export const alert = defineContract({
  name: 'alert',
  category: 'feedback',
  status: 'stable',
  anatomy: `
    <alert>                  (role="alert"; pass an icon as the first child)
    ├─ icon (optional, claims the leading column)
    ├─ alert-title
    └─ alert-description`,
  props: [
    {
      name: 'variant',
      type: 'string',
      default: 'default',
      options: ['default', 'destructive'],
      desc: 'Visual intent.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto the container.',
    },
  ],
  guidance: {
    summary:
      'A persistent, in-flow message with a title, body, and optional leading icon.',
    whenToUse: [
      'Surface informational, success, warning, or error context inline within the page where the user is reading.',
    ],
    whenNotToUse: [
      { text: 'A transient, auto-dismissing message', use: 'toast' },
      { text: 'A page-spanning announcement bar', use: 'banner' },
    ],
    rules: [
      'Convey info / success / warning intent through the leading icon (Info, CheckCircle2, TriangleAlert, XCircle), not extra variants — only default and destructive exist.',
      'Pass the icon as the first child; the grid flips to a two-column (icon + body) layout automatically.',
      'alert-description is optional; a title-only alert collapses to a single row.',
    ],
    example:
      '<alert variant="destructive"><XCircle /><alert-title>Payment failed</alert-title><alert-description>Your card was declined.</alert-description></alert>',
  },
  preview: {
    rx: 'interaction-feedback-alert--workbench',
    ng: 'interaction-feedback-alert--workbench',
  },
  tag: { rx: 'Alert', ng: 'gr-alert' },
  example: { variant: 'default' },
  figma: { nodeId: null },
});
