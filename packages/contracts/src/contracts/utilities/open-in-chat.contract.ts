import { defineContract } from '../../types';

/**
 * OpenIn - a dropdown that deep-links the current `query` into an external AI
 * chat / builder (ChatGPT, Claude, T3 Chat, Scira, v0, Cursor). Each provider
 * item builds a pre-filled URL from the shared query and opens it in a new tab.
 * React: `@gremorie/rx-ai` (Radix DropdownMenu).
 * Angular: `@gremorie/ng-ai` (BrnPopover; story title `AI/OpenInChat`).
 */
export const openInChat = defineContract({
  name: 'open-in-chat',
  category: 'utilities',
  status: 'stable',
  anatomy: `
    <open-in>
    └─ open-in (menu root, provides query)
       ├─ open-in-trigger (default "Open in chat" button)
       └─ open-in-content (240px menu surface)
          ├─ open-in-label / open-in-separator
          └─ open-in-{chatgpt,claude,t3,scira,v0,cursor} (provider link items)`,
  props: [
    {
      name: 'query',
      type: 'string',
      required: true,
      desc: 'The prompt/text deep-linked into every provider URL.',
    },
    {
      name: 'content',
      type: 'TemplateRef',
      adapts: { rx: 'n/a (Radix wires trigger↔content internally)' },
      desc: 'Angular only: OpenInTrigger ref to the <ng-template brnPopoverContent>.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'input: class' },
      desc: 'Merged onto a part surface (trigger / content / item).',
    },
  ],
  guidance: {
    summary:
      'A dropdown of provider deep-links that opens the current prompt in an external AI app.',
    whenToUse: [
      'Offer "continue this prompt in ChatGPT / Claude / v0 / …" from a generated answer or snippet.',
    ],
    whenNotToUse: [
      {
        text: 'A generic action menu unrelated to AI providers',
        use: 'dropdown-menu',
      },
      { text: 'A single in-app button', use: 'button' },
    ],
    rules: [
      'Compose only the provider items you want; the shared query flows to each via context (React) / DI (Angular).',
      'Provider links open in a new tab with rel="noopener".',
    ],
    example:
      '<open-in query="Explain monads"><open-in-trigger /><open-in-content><open-in-chatgpt /><open-in-claude /></open-in-content></open-in>',
  },
  preview: {
    rx: 'ai-utilities-openin--default',
    ng: 'ai-openinchat--workbench',
  },
  tag: { rx: 'OpenIn', ng: 'open-in' },
  example: {
    query: 'Explain monads with a code example',
  },
  figma: { nodeId: null },
});
