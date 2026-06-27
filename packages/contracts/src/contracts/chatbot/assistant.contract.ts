import { defineContract } from '../../types';

/**
 * Assistant - the flagship composed chat surface (a block, not a primitive):
 * a conversation with reasoning, an inline chart artifact and sources, response
 * branches, and a floating B2B PromptInput composer. React ships it as the
 * `block-assistant` block; Angular as the `<ai-assistant>` element.
 */
export const assistant = defineContract({
  name: 'assistant',
  category: 'chatbot',
  status: 'stable',
  anatomy: `
    <assistant>
    ├─ header (thread switcher + Sources / Share / overflow)
    ├─ conversation
    │  └─ conversation-content
    │     ├─ message (user)
    │     └─ message (assistant)
    │        └─ message-branch
    │           ├─ reasoning
    │           ├─ message-response
    │           ├─ chart-artifact (inline; chart / table + downloads)
    │           └─ message-toolbar (actions + sources + branch nav)
    └─ prompt-input (floating B2B composer)
       ├─ prompt-input-header (mentions + context meter)
       ├─ prompt-input-textarea
       └─ prompt-input-footer (mode + model selects, web / attach / voice, submit)`,
  props: [
    {
      name: 'initialView',
      type: 'string',
      default: 'filled',
      options: ['filled', 'empty'],
      desc: 'Starting surface: the live conversation, or the new-chat (empty) start.',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: 'Ask anything, or pick a mode...',
      desc: 'Composer textarea placeholder.',
    },
    {
      name: 'defaultMode',
      type: 'string',
      default: 'research',
      options: ['ask', 'analyze', 'research', 'plan'],
      desc: 'Initially-selected composer mode.',
    },
    {
      name: 'defaultModel',
      type: 'string',
      default: 'claude-sonnet-4-6',
      options: [
        'claude-opus-4-8',
        'claude-sonnet-4-6',
        'gpt-5',
        'gemini-2-5-pro',
      ],
      desc: 'Initially-selected model.',
    },
    {
      name: 'onSubmit',
      type: '(message) => void',
      adapts: { ng: 'output: submitted' },
      desc: 'Fires with the composed prompt; wire it to your AI SDK.',
    },
  ],
  guidance: {
    summary:
      'The flagship composed chat surface: conversation with reasoning, an inline chart artifact and sources, response branches, and a floating B2B composer. A block you own.',
    whenToUse: [
      'Ship a complete, production-ready chat surface in one import.',
      'Start from a composed block and wire it to your own streaming endpoint.',
    ],
    whenNotToUse: [
      { text: 'Just a single message row', use: 'message' },
      { text: 'Just the composer', use: 'prompt-input' },
    ],
    rules: [
      'It is a block - copy-paste, you own the source (`gremorie add block-assistant`), not a fixed prop API.',
      'initialView picks the starting surface; the header chat switcher flips between filled and empty at runtime.',
    ],
    example: '<Assistant initialView="filled" />',
  },
  preview: {
    rx: 'blocks-assistant--default',
    ng: 'ai-assistant--default',
  },
  tag: { rx: 'Assistant', ng: 'ai-assistant' },
  example: {
    initialView: 'filled',
    placeholder: 'Ask anything, or pick a mode...',
    defaultMode: 'research',
    defaultModel: 'claude-sonnet-4-6',
  },
  figma: { nodeId: null },
});
