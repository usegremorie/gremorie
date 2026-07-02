import { defineContract } from '../../types';

/**
 * Sources - a collapsible "Used N sources" disclosure listing the citations a
 * model used to ground its answer, each a link out.
 * React: `@gremorie/rx-ai`. Angular: `@gremorie/ng-ai`.
 */
export const sources = defineContract({
  name: 'sources',
  category: 'chatbot',
  status: 'stable',
  anatomy: `
    <sources>
    └─ sources (collapsible root + open state)
       ├─ sources-trigger (e.g. "Used 3 sources" + chevron)
       └─ sources-content (collapsible body)
          └─ source (link, repeatable: book icon + title)`,
  props: [
    {
      name: 'open',
      type: 'boolean',
      default: false,
      adapts: { ng: 'model: open' },
      desc: 'Controlled open state; Angular two-way binds via the open model.',
    },
    {
      name: 'count',
      type: 'number',
      required: true,
      desc: 'Number of sources, shown in the default trigger label (on sources-trigger).',
    },
    {
      name: 'href',
      type: 'string',
      required: true,
      desc: 'Citation URL; opens in a new tab (on source).',
    },
    {
      name: 'title',
      type: 'string',
      desc: 'Citation title shown next to the icon (on source).',
    },
  ],
  guidance: {
    summary:
      'A collapsible list of the citations / links a model used to answer.',
    whenToUse: [
      'List the web pages or documents that grounded a model response.',
      'Keep citations tucked away until the user expands them.',
    ],
    whenNotToUse: [
      {
        text: 'An inline citation marker within the answer text',
        use: 'inline-citation',
      },
      {
        text: 'A reasoning trace with search results per step',
        use: 'chain-of-thought',
      },
    ],
    rules: [
      'count is the source total displayed in the default trigger; override the trigger children for custom labels.',
      'Each source links out (new tab); place sources inside sources-content.',
    ],
    example:
      '<sources>\n  <sources-trigger [count]="2" />\n  <sources-content>\n    <source href="https://example.com" title="Example" />\n  </sources-content>\n</sources>',
  },
  preview: {
    rx: 'ai-chatbot-sources--expanded',
    ng: 'ai-sources--expanded',
  },
  tag: { rx: 'Sources', ng: 'sources' },
  example: {
    open: true,
    count: 3,
    href: 'https://example.com/article-1',
    title: 'Compound components in 2024',
  },
  figma: { nodeId: null },
});
