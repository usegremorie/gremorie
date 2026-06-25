import { defineContract } from '../../types';

/**
 * ChainOfThought - a collapsible "reasoning trace" block that reveals a model's
 * step-by-step thinking, optionally with search results and images per step.
 * React: `@gremorie/rx-ai`. Angular: `@gremorie/ng-ai`.
 */
export const chainOfThought = defineContract({
  name: 'chain-of-thought',
  category: 'chatbot',
  status: 'stable',
  anatomy: `
    <chain-of-thought>
    └─ chain-of-thought (collapsible root + state)
       ├─ chain-of-thought-header  (trigger; defaults to "Chain of Thought")
       └─ chain-of-thought-content (collapsible body)
          └─ chain-of-thought-step (repeatable: label + status dot)
             ├─ chain-of-thought-search-results
             │  └─ chain-of-thought-search-result (chip, repeatable)
             └─ chain-of-thought-image (optional, with caption)`,
  props: [
    {
      name: 'open',
      type: 'boolean',
      adapts: { ng: 'model: open' },
      desc: 'Controlled open state; Angular two-way binds via the open model.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: false,
      desc: 'Initial open state when uncontrolled.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      adapts: { ng: 'output: openChange' },
      desc: 'Fires when the open state toggles.',
    },
    {
      name: 'label',
      type: 'string',
      required: true,
      desc: 'Step title (on chain-of-thought-step).',
    },
    {
      name: 'description',
      type: 'string',
      desc: 'Optional supporting line below a step label.',
    },
    {
      name: 'status',
      type: 'string',
      default: 'complete',
      options: ['complete', 'active', 'pending'],
      desc: 'Step status; drives the indicator (on chain-of-thought-step).',
    },
    {
      name: 'icon',
      type: 'LucideIcon',
      adapts: { ng: 'fixed dot indicator' },
      desc: 'Per-step indicator icon; Angular renders a fixed dot.',
    },
    {
      name: 'caption',
      type: 'string',
      desc: 'Caption under a chain-of-thought-image.',
    },
  ],
  guidance: {
    summary:
      'A collapsible trace of a model’s reasoning steps, with optional search results and images.',
    whenToUse: [
      'Surface intermediate reasoning / planning steps the agent took before answering.',
      'Show research steps with their cited search results inline.',
    ],
    whenNotToUse: [
      {
        text: 'A single "thinking…" block with streamed prose, not discrete steps',
        use: 'reasoning',
      },
      {
        text: 'An actionable task checklist the user can act on',
        use: 'task',
      },
    ],
    rules: [
      'Steps live inside chain-of-thought-content; the header is the collapse trigger.',
      'Use status to mark each step complete / active / pending as the trace streams.',
    ],
    example:
      '<chain-of-thought>\n  <chain-of-thought-header />\n  <chain-of-thought-content>\n    <chain-of-thought-step label="Searched the web" status="complete" />\n  </chain-of-thought-content>\n</chain-of-thought>',
  },
  preview: {
    rx: 'ai-chatbot-chainofthought--simple',
    ng: 'ai-chainofthought--simple',
  },
  figma: { nodeId: null },
});
