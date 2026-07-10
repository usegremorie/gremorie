import { defineContract } from '../../types';

/**
 * Confirmation - a human-in-the-loop approval prompt for a tool call: it asks to
 * approve/reject while awaiting input, then shows the accepted or rejected
 * outcome. React: `@gremorie/rx-ai`. Angular: `@gremorie/ng-ai`.
 */
export const confirmation = defineContract({
  name: 'confirmation',
  category: 'chatbot',
  status: 'stable',
  anatomy: `
    <confirmation>
    └─ confirmation (alert surface + state)
       ├─ confirmation-title
       ├─ confirmation-request  (shown while approval-requested)
       │  └─ confirmation-actions → confirmation-action (Approve / Reject)
       ├─ confirmation-accepted (shown when approved)
       └─ confirmation-rejected (shown when rejected)`,
  props: [
    {
      name: 'state',
      type: 'ToolState',
      required: true,
      options: [
        'input-streaming',
        'input-available',
        'approval-requested',
        'approval-responded',
        'output-available',
        'output-denied',
      ],
      desc: 'AI-SDK tool state; drives which sub-block is visible.',
    },
    {
      name: 'approval',
      type: 'ToolUIPartApproval',
      desc: 'Approval payload: { id; approved?; reason? }; approved toggles accepted vs rejected.',
    },
    {
      name: 'variant',
      type: 'string',
      default: 'default',
      options: ['default', 'outline', 'ghost', 'secondary'],
      desc: 'Action button style (on confirmation-action).',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      desc: 'Disable an action button (on confirmation-action).',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'input: class' },
      desc: 'Merged onto the alert surface.',
    },
  ],
  guidance: {
    summary:
      'A human-in-the-loop approval prompt for a tool call, with accepted / rejected outcomes.',
    whenToUse: [
      'Gate a sensitive tool call behind explicit user approval.',
      'Show the resolved outcome (approved / rejected) after the user responds.',
    ],
    whenNotToUse: [
      {
        text: 'Just displaying a tool call’s input/output without approval',
        use: 'tool',
      },
    ],
    rules: [
      'state controls visibility: approval-requested shows the actions; the response state reveals accepted/rejected.',
      'React builds on the Alert component; Angular reproduces the role="alert" surface inline to avoid the dependency.',
    ],
    example:
      '<confirmation [state]="state" [approval]="approval">\n  <confirmation-title>Run this command?</confirmation-title>\n  <confirmation-request>\n    <confirmation-actions>\n      <confirmation-action>Approve</confirmation-action>\n    </confirmation-actions>\n  </confirmation-request>\n</confirmation>',
  },
  preview: {
    rx: 'ai-chatbot-confirmation--workbench',
    ng: 'ai-chatbot-confirmation--workbench',
  },
  tag: { rx: 'Confirmation', ng: 'confirmation' },
  example: {
    state: 'approval-requested',
    variant: 'default',
    disabled: false,
  },
  figma: { nodeId: null },
});
