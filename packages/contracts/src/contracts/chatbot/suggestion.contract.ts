import { defineContract } from '../../types';

/**
 * Suggestion - a horizontally scrollable row of tappable prompt chips that
 * pre-fill or send a suggested message. React: `@gremorie/rx-ai`. Angular: `@gremorie/ng-ai`.
 */
export const suggestion = defineContract({
  name: 'suggestion',
  category: 'chatbot',
  status: 'stable',
  anatomy: `
    <suggestion>
    └─ suggestions (horizontal scroll row)
       └─ suggestion (chip button, repeatable)`,
  props: [
    {
      name: 'suggestion',
      type: 'string',
      required: true,
      adapts: { ng: 'input: value' },
      desc: 'Chip label and emitted value; Angular names this input "value".',
    },
    {
      name: 'variant',
      type: 'string',
      default: 'outline',
      options: ['default', 'outline', 'ghost', 'secondary'],
      desc: 'Chip button style.',
    },
    {
      name: 'size',
      type: 'string',
      default: 'sm',
      options: ['sm', 'md', 'lg'],
      adapts: { rx: "'sm' | 'default' | 'lg'" },
      desc: 'Chip size; React uses Button sizes (default in place of md).',
    },
    {
      name: 'onClick',
      type: '(suggestion: string) => void',
      adapts: { ng: 'output: selected' },
      desc: 'Fires with the chip value; Angular emits via the selected output.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto the chip.',
    },
  ],
  guidance: {
    summary:
      'A scrollable row of tappable prompt chips that pre-fill or send a suggested message.',
    whenToUse: [
      'Offer canned follow-up prompts under a chat input or assistant reply.',
      'Give a cold-start chat a few starter prompts.',
    ],
    whenNotToUse: [
      { text: 'A single primary action button', use: 'button' },
      { text: 'A set of selectable filters/tags', use: 'badge' },
    ],
    rules: [
      'The chip’s value is both its label and the payload emitted on click.',
      'suggestions scrolls horizontally; keep labels short.',
    ],
    example:
      '<suggestions>\n  <suggestion value="Summarize this" (selected)="send($event)" />\n</suggestions>',
  },
  preview: {
    rx: 'ai-chatbot-suggestion--workbench',
    ng: 'ai-chatbot-suggestion--workbench',
  },
  tag: { rx: 'Suggestion', ng: 'suggestion' },
  example: {
    suggestion: 'Tell me a joke',
    variant: 'outline',
    size: 'sm',
  },
  figma: { nodeId: null },
});
