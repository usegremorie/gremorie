import { defineContract } from '../../types';

/**
 * Checkpoint - a thin in-thread divider marking a saved point users can restore
 * to, with a bookmark icon and a (tooltipped) trigger button.
 * React: `@gremorie/rx-ai`. Angular: `@gremorie/ng-ai`.
 */
export const checkpoint = defineContract({
  name: 'checkpoint',
  category: 'chatbot',
  status: 'stable',
  anatomy: `
    <checkpoint>
    └─ checkpoint (centered divider row)
       ├─ checkpoint-icon (bookmark, or custom)
       └─ checkpoint-trigger (button; optional tooltip)`,
  props: [
    {
      name: 'tooltip',
      type: 'string',
      desc: 'Hover tooltip on the trigger; when set, wraps the button in a tooltip (on checkpoint-trigger).',
    },
    {
      name: 'variant',
      type: 'string',
      default: 'ghost',
      options: ['ghost', 'outline', 'default', 'secondary'],
      desc: 'Trigger button style (on checkpoint-trigger).',
    },
    {
      name: 'size',
      type: 'string',
      default: 'sm',
      options: ['sm', 'md', 'lg'],
      desc: 'Trigger button size (on checkpoint-trigger).',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      adapts: { rx: 'Button disabled prop' },
      desc: 'Disable the trigger (on checkpoint-trigger).',
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
      'A divider marking a restorable checkpoint in a conversation, with a bookmark icon and trigger.',
    whenToUse: [
      'Mark a point in the thread the user can revert / restore to.',
      'Visually segment a long conversation at a saved state.',
    ],
    whenNotToUse: [
      { text: 'A human-in-the-loop approval step', use: 'confirmation' },
      { text: 'A generic horizontal rule with no action', use: 'separator' },
    ],
    rules: [
      'checkpoint-trigger is the actionable button; set tooltip to explain what restoring does.',
      'Replace checkpoint-icon children to swap the default bookmark.',
    ],
    example:
      '<checkpoint>\n  <checkpoint-icon />\n  <checkpoint-trigger tooltip="Restore to here">Checkpoint</checkpoint-trigger>\n</checkpoint>',
  },
  preview: {
    rx: 'ai-chatbot-checkpoint--default',
    ng: 'ai-checkpoint--workbench',
  },
  figma: { nodeId: null },
});
