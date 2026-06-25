import { defineContract } from '../../types';

/**
 * InlineCitation - an inline citation marker rendered within answer text; a
 * hover card reveals the source(s), optional quote, and a carousel for multiples.
 * React: `@gremorie/rx-ai`. Angular: `@gremorie/ng-ai`.
 */
export const inlineCitation = defineContract({
  name: 'inline-citation',
  category: 'chatbot',
  status: 'stable',
  anatomy: `
    <inline-citation>
    └─ inline-citation (inline span)
       ├─ inline-citation-text (the cited run of text)
       └─ inline-citation-card (hover card)
          ├─ inline-citation-card-trigger (badge: hostname / "+N")
          └─ inline-citation-card-body (hover-card content)
             ├─ inline-citation-source (title + url + description)
             ├─ inline-citation-quote (pulled quote)
             └─ carousel (multi-source; prev / index / next)`,
  props: [
    {
      name: 'sources',
      type: 'string[]',
      required: true,
      desc: 'Source URLs; the trigger shows the first hostname and a "+N" count (on inline-citation-card-trigger).',
    },
    {
      name: 'title',
      type: 'string',
      desc: 'Source title in the card (on inline-citation-source).',
    },
    {
      name: 'url',
      type: 'string',
      desc: 'Source URL in the card (on inline-citation-source).',
    },
    {
      name: 'description',
      type: 'string',
      desc: 'Source excerpt in the card (on inline-citation-source).',
    },
    {
      name: 'openDelay',
      type: 'number',
      default: 0,
      adapts: { ng: 'BrnHoverCard default' },
      desc: 'Hover-card open delay (React HoverCard).',
    },
    {
      name: 'closeDelay',
      type: 'number',
      default: 0,
      adapts: { ng: 'BrnHoverCard default' },
      desc: 'Hover-card close delay (React HoverCard).',
    },
  ],
  guidance: {
    summary:
      'An inline citation marker whose hover card reveals the source(s) and an optional pulled quote.',
    whenToUse: [
      'Cite a specific source inline, attached to a run of generated text.',
      'Attribute one sentence to one or more sources without breaking the flow.',
    ],
    whenNotToUse: [
      {
        text: 'A collapsible list of all sources used in the answer',
        use: 'sources',
      },
    ],
    rules: [
      'sources drives the trigger badge (first hostname + "+N"); pass multiple to enable the carousel.',
      'React composes its own carousel sub-components; Angular composes the shared carousel inside the card body.',
    ],
    example:
      '<inline-citation>\n  <inline-citation-text>the claim</inline-citation-text>\n  <inline-citation-card [sources]="urls">…</inline-citation-card>\n</inline-citation>',
  },
  preview: {
    rx: 'ai-chatbot-inlinecitation--single-source',
    ng: 'ai-inlinecitation--single-source',
  },
  figma: { nodeId: null },
});
