import { defineContract } from '../../types';

/**
 * ModelSelector - a command-palette picker for choosing an AI model, grouped by
 * provider with logos, search, and keyboard shortcuts. React mounts it in a
 * dialog; Angular renders the palette inline. React: `@gremorie/rx-ai`. Angular: `@gremorie/ng-ai`.
 */
export const modelSelector = defineContract({
  name: 'model-selector',
  category: 'chatbot',
  status: 'stable',
  anatomy: `
    <model-selector>
    └─ model-selector (root)
       ├─ model-selector-trigger (opens the palette)
       └─ model-selector-content (command palette; RX wraps a Dialog)
          ├─ model-selector-input (search)
          ├─ model-selector-list
          │  ├─ model-selector-empty (no results)
          │  ├─ model-selector-group (per provider)
          │  │  └─ model-selector-item
          │  │     ├─ model-selector-logo / -logo-group
          │  │     ├─ model-selector-name
          │  │     └─ model-selector-shortcut
          │  └─ model-selector-separator`,
  props: [
    {
      name: 'value',
      type: 'string',
      required: true,
      desc: 'Search/select value for an item (on model-selector-item).',
    },
    {
      name: 'provider',
      type: 'string',
      required: true,
      desc: 'Provider key, e.g. "anthropic"; resolves the logo (on model-selector-logo).',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: 'Search models…',
      desc: 'Search-input placeholder (on model-selector-input).',
    },
    {
      name: 'title',
      type: 'string',
      default: 'Model Selector',
      adapts: { rx: 'Dialog title' },
      desc: 'Accessible palette title (Angular content input).',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      desc: 'Disable an item (on model-selector-item).',
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
      'A searchable, provider-grouped command palette for picking an AI model.',
    whenToUse: [
      'Let users switch between many models across providers, with search.',
      'Show provider logos and keyboard shortcuts in the picker.',
    ],
    whenNotToUse: [
      {
        text: 'A compact in-composer model dropdown',
        use: 'prompt-input',
      },
      { text: 'A generic single-select field', use: 'select' },
    ],
    rules: [
      'Group items with model-selector-group per provider; model-selector-item value feeds the fuzzy search.',
      'React mounts the palette inside a Dialog; Angular renders it inline (host it in your own dialog for modal behavior).',
    ],
    example:
      '<model-selector>\n  <model-selector-trigger />\n  <model-selector-content>\n    <model-selector-input />\n    <model-selector-list>\n      <model-selector-item value="gpt-4o">…</model-selector-item>\n    </model-selector-list>\n  </model-selector-content>\n</model-selector>',
  },
  preview: {
    rx: 'ai-chatbot-modelselector--workbench',
    ng: 'ai-chatbot-modelselector--workbench',
  },
  tag: { rx: 'ModelSelector', ng: 'model-selector' },
  example: {
    value: 'claude-3-5-sonnet',
    provider: 'anthropic',
    placeholder: 'Search models…',
    title: 'Model Selector',
    disabled: false,
  },
  figma: { nodeId: null },
});
