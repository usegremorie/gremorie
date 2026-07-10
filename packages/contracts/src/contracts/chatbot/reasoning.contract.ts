import { defineContract } from '../../types';

/**
 * Reasoning - a collapsible "thinking…" disclosure that shows the model’s
 * reasoning prose, shimmering while streaming and reporting elapsed duration
 * when done. React: `@gremorie/rx-ai`. Angular: `@gremorie/ng-ai`.
 */
export const reasoning = defineContract({
  name: 'reasoning',
  category: 'chatbot',
  status: 'stable',
  anatomy: `
    <reasoning>
    └─ reasoning (collapsible root + streaming/duration state)
       ├─ reasoning-trigger (brain icon + "Thinking…" / "Thought for Ns" + chevron)
       └─ reasoning-content (collapsible body; markdown / streamed text)`,
  props: [
    {
      name: 'isStreaming',
      type: 'boolean',
      default: false,
      desc: 'Whether reasoning is actively streaming; drives the shimmer and auto open/close.',
    },
    {
      name: 'open',
      type: 'boolean',
      adapts: { ng: 'model: open' },
      desc: 'Controlled open state; Angular two-way binds via the open model.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: true,
      desc: 'Initial open state when uncontrolled.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      adapts: { ng: 'output: openChange' },
      desc: 'Fires when the open state toggles.',
    },
    {
      name: 'duration',
      type: 'number',
      desc: 'Elapsed seconds; auto-tracked from streaming start→end, or set explicitly.',
    },
    {
      name: 'getThinkingMessage',
      type: '(isStreaming: boolean, duration?: number) => ReactNode',
      adapts: { ng: 'fixed label logic' },
      desc: 'React-only override for the trigger label; Angular hard-codes it (replace the trigger to customize).',
    },
  ],
  guidance: {
    summary:
      'A collapsible disclosure of model reasoning that shimmers while streaming and shows elapsed time when done.',
    whenToUse: [
      'Reveal a model’s chain-of-thought prose alongside its answer.',
      'Signal that the model is "thinking" with a live shimmer.',
    ],
    whenNotToUse: [
      {
        text: 'Discrete, labeled reasoning steps (with search results / images)',
        use: 'chain-of-thought',
      },
      { text: 'A generic shimmering text placeholder', use: 'shimmer' },
    ],
    rules: [
      'Set isStreaming true while tokens arrive; clear it to stop the shimmer, capture duration, and auto-collapse.',
      'reasoning-content renders streamed markdown (React via Streamdown; Angular as pre-wrapped text or projected children).',
    ],
    example:
      '<reasoning [isStreaming]="streaming">\n  <reasoning-trigger />\n  <reasoning-content [text]="thoughts" />\n</reasoning>',
  },
  preview: {
    rx: 'ai-chatbot-reasoning--workbench',
    ng: 'ai-chatbot-reasoning--workbench',
  },
  tag: { rx: 'Reasoning', ng: 'reasoning' },
  example: {
    isStreaming: false,
    open: false,
    defaultOpen: false,
    duration: 4,
  },
  figma: { nodeId: null },
});
