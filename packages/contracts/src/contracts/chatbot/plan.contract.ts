import { defineContract } from '../../types';

/**
 * Plan - a collapsible card presenting an agent’s plan: titled header (which can
 * shimmer while streaming), an action slot, body, and footer.
 * React: `@gremorie/rx-ai`. Angular: `@gremorie/ng-ai`.
 */
export const plan = defineContract({
  name: 'plan',
  category: 'chatbot',
  status: 'stable',
  anatomy: `
    <plan>
    └─ plan (collapsible card + streaming state)
       ├─ plan-header
       │  ├─ plan-title (shimmers while streaming)
       │  ├─ plan-description (shimmers while streaming)
       │  ├─ plan-action (top-right slot)
       │  └─ plan-trigger (collapse chevron)
       ├─ plan-content (collapsible body)
       └─ plan-footer`,
  props: [
    {
      name: 'isStreaming',
      type: 'boolean',
      default: false,
      desc: 'Shimmer the title and description while the plan streams in.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      adapts: { ng: 'model: open' },
      desc: 'Initial open state (React); Angular exposes a two-way open model.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'input: class' },
      desc: 'Merged onto the card surface.',
    },
  ],
  guidance: {
    summary:
      'A collapsible card that presents an agent’s plan, with a header that shimmers while streaming.',
    whenToUse: [
      'Show a proposed multi-step plan before or during execution.',
      'Stream a plan title/description in with a shimmer placeholder.',
    ],
    whenNotToUse: [
      { text: 'A trace of completed task steps and file edits', use: 'task' },
      { text: 'An ordered/unordered list of pending items', use: 'queue' },
    ],
    rules: [
      'Set isStreaming while the plan generates; it shimmers plan-title and plan-description.',
      'plan-trigger toggles the collapsible body (plan-content).',
    ],
    example:
      '<plan [isStreaming]="streaming">\n  <plan-header>\n    <plan-title>Migration plan</plan-title>\n  </plan-header>\n  <plan-content>…</plan-content>\n</plan>',
  },
  preview: {
    rx: 'ai-chatbot-plan--default',
    ng: 'ai-plan--workbench',
  },
  figma: { nodeId: null },
});
