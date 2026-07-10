import { defineContract } from '../../types';

/**
 * Context - a context-window usage meter: a compact trigger showing percent used,
 * with a hover card breaking down token usage (input/output/reasoning/cache) and
 * cost. React: `@gremorie/rx-ai`. Angular: `@gremorie/ng-ai`.
 */
export const context = defineContract({
  name: 'context',
  category: 'chatbot',
  status: 'stable',
  anatomy: `
    <context>
    └─ context (hover-card root)
       ├─ context-trigger (percent used + ring icon)
       └─ context-content (hover-card body)
          ├─ context-content-header (percent, used/total, progress bar)
          ├─ context-content-body
          │  ├─ context-input-usage     (auto-hidden if 0)
          │  ├─ context-output-usage    (auto-hidden if 0)
          │  ├─ context-reasoning-usage (auto-hidden if 0)
          │  └─ context-cache-usage     (auto-hidden if 0)
          └─ context-content-footer (total cost)`,
  props: [
    {
      name: 'usedTokens',
      type: 'number',
      required: true,
      desc: 'Tokens consumed in the context window.',
    },
    {
      name: 'maxTokens',
      type: 'number',
      required: true,
      desc: 'Total context-window size.',
    },
    {
      name: 'usage',
      type: 'ContextUsage',
      adapts: { rx: 'LanguageModelUsage (ai)' },
      desc: 'Per-category token usage; Angular inlines the type to avoid the ai dependency.',
    },
    {
      name: 'modelId',
      type: 'string',
      desc: 'Model id used to compute cost.',
    },
    {
      name: 'costResolver',
      type: '(modelId: string, usage: ContextUsage) => number | undefined',
      adapts: { rx: 'built-in tokenlens lookup' },
      desc: 'Angular-only cost function; React derives cost internally via tokenlens.',
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
      'A context-window usage meter with a hover-card breakdown of token usage and cost.',
    whenToUse: [
      'Show how much of the model’s context window the conversation has used.',
      'Break down token usage by category and estimate cost.',
    ],
    whenNotToUse: [
      {
        text: 'A generic determinate progress bar',
        use: 'progress',
      },
    ],
    rules: [
      'Usage rows auto-hide when their value is 0; the header shows percent of maxTokens used.',
      'React computes cost internally (tokenlens); Angular takes an optional costResolver and inlines ContextUsage to drop the ai dependency.',
    ],
    example:
      '<context [usedTokens]="42000" [maxTokens]="128000" [usage]="usage" />',
  },
  preview: {
    rx: 'ai-chatbot-context--workbench',
    ng: 'ai-chatbot-context--workbench',
  },
  tag: { rx: 'Context', ng: 'context' },
  example: {
    usedTokens: 12200,
    maxTokens: 200000,
    modelId: 'anthropic/claude-3-5-sonnet',
  },
  figma: { nodeId: null },
});
