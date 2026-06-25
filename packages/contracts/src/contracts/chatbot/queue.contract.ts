import { defineContract } from '../../types';

/**
 * Queue - a scrollable list of queued items with status indicators, hover
 * actions, attachments, and optional collapsible sections.
 * React: `@gremorie/rx-ai`. Angular: `@gremorie/ng-ai`.
 */
export const queue = defineContract({
  name: 'queue',
  category: 'chatbot',
  status: 'stable',
  anatomy: `
    <queue>
    └─ queue (card container)
       └─ queue-list (scroll region)
          ├─ queue-item (row)
          │  ├─ queue-item-indicator (status dot)
          │  ├─ queue-item-content (primary text; strikethrough if completed)
          │  ├─ queue-item-description (secondary text)
          │  ├─ queue-item-attachment → queue-item-image / queue-item-file
          │  └─ queue-item-actions → queue-item-action (hover buttons)
          └─ queue-section (collapsible group)
             ├─ queue-section-trigger → queue-section-label (label + count)
             └─ queue-section-content → queue-item …`,
  props: [
    {
      name: 'completed',
      type: 'boolean',
      default: false,
      desc: 'Mark an item done (greys + strikes through) (on queue-item-content/indicator).',
    },
    {
      name: 'src',
      type: 'string',
      required: true,
      adapts: { rx: 'children' },
      desc: 'Image URL (on queue-item-image).',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: true,
      adapts: { ng: 'model: open' },
      desc: 'Initial open state of a section; Angular also exposes a two-way open model.',
    },
    {
      name: 'label',
      type: 'string',
      required: true,
      desc: 'Section label, e.g. "Pending" (on queue-section-label).',
    },
    {
      name: 'count',
      type: 'number',
      desc: 'Item count shown in the section header (on queue-section-label).',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      adapts: { ng: 'not implemented' },
      desc: 'React-only section icon (on queue-section-label).',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'input: class' },
      desc: 'Merged onto the part.',
    },
  ],
  guidance: {
    summary:
      'A scrollable list of queued items with status, hover actions, attachments, and collapsible sections.',
    whenToUse: [
      'Show a backlog of queued prompts / tasks the user can act on.',
      'Group items into collapsible sections (pending, done) with counts.',
    ],
    whenNotToUse: [
      { text: 'A collapsible summary of one task and its steps', use: 'task' },
      { text: 'An agent plan card', use: 'plan' },
    ],
    rules: [
      'Set completed on items to strike them through; reveal queue-item-action buttons on hover.',
      'React wraps queue-list in a ScrollArea; Angular uses a native max-height scroll region (no shared dep).',
    ],
    example:
      '<queue>\n  <queue-list>\n    <queue-item>\n      <queue-item-indicator />\n      <queue-item-content>Draft reply</queue-item-content>\n    </queue-item>\n  </queue-list>\n</queue>',
  },
  preview: {
    rx: 'ai-chatbot-queue--default',
    ng: 'ai-queue--workbench',
  },
  tag: { rx: 'Queue', ng: 'queue' },
  example: {
    completed: false,
    defaultOpen: true,
    label: 'pending',
    count: 2,
  },
  figma: { nodeId: null },
});
