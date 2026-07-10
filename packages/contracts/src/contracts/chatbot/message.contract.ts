import { defineContract } from '../../types';

/**
 * Message - a single chat message row: avatar + bubble, aligned by author, with
 * optional actions, attachments, a markdown response, and branch navigation.
 * React: `@gremorie/rx-ai`. Angular: `@gremorie/ng-ai`.
 */
export const message = defineContract({
  name: 'message',
  category: 'chatbot',
  status: 'stable',
  anatomy: `
    <message>
    └─ message (row; aligned by "from")
       ├─ message-avatar (optional)
       └─ message-content (bubble)
          ├─ message-response (rendered markdown)
          ├─ message-attachments → message-attachment (repeatable)
          ├─ message-actions → message-action (icon button + tooltip)
          ├─ message-toolbar
          └─ message-branch (state)
             ├─ message-branch-content (the active branch)
             └─ message-branch-selector (prev / page / next)`,
  props: [
    {
      name: 'from',
      type: 'string',
      required: true,
      options: ['user', 'assistant', 'system'],
      desc: 'Author role; drives alignment and tone (on message and message-branch-selector).',
    },
    {
      name: 'tooltip',
      type: 'string',
      desc: 'Tooltip for an action (on message-action).',
    },
    {
      name: 'label',
      type: 'string',
      desc: 'Accessible label for an action; falls back to tooltip (on message-action).',
    },
    {
      name: 'variant',
      type: 'string',
      default: 'ghost',
      options: ['ghost', 'outline', 'default'],
      desc: 'Action button style (on message-action).',
    },
    {
      name: 'side',
      type: 'string',
      default: 'top',
      adapts: { rx: 'inferred from Tooltip' },
      desc: 'Tooltip placement for an action (Angular BrnTooltip; React infers it).',
    },
    {
      name: 'defaultBranch',
      type: 'number',
      default: 0,
      desc: 'Initial branch index (on message-branch).',
    },
    {
      name: 'onBranchChange',
      type: '(index: number) => void',
      adapts: { ng: 'output: branchChange' },
      desc: 'Fires when the active branch changes (on message-branch).',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto the message row.',
    },
  ],
  guidance: {
    summary:
      'A single chat message: avatar + bubble aligned by author, with actions, attachments, and branch navigation.',
    whenToUse: [
      'Render one message in a thread (user, assistant, or system).',
      'Offer per-message actions (copy, retry) and alternative branches.',
    ],
    whenNotToUse: [
      {
        text: 'The scrolling thread viewport around messages',
        use: 'conversation',
      },
      {
        text: 'A standalone markdown block outside a message',
        use: 'response',
      },
    ],
    rules: [
      'from controls alignment/tone and must match on message-branch-selector (it hides when ≤1 branch).',
      'Put body content in message-content; actions, attachments, and branches are children of it.',
    ],
    example:
      '<message from="assistant">\n  <message-content>\n    <message-response [markdown]="text" />\n  </message-content>\n</message>',
  },
  preview: {
    rx: 'ai-chatbot-message--workbench',
    ng: 'ai-chatbot-message--workbench',
  },
  tag: { rx: 'Message', ng: 'message' },
  example: {
    from: 'assistant',
    variant: 'ghost',
    side: 'top',
    defaultBranch: 0,
  },
  figma: { nodeId: null },
});
