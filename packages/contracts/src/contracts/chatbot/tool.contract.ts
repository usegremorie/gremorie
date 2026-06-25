import { defineContract } from '../../types';

/**
 * Tool - a collapsible card for an AI-SDK tool call: header with name + state
 * badge, formatted input parameters, and the result or error.
 * React: `@gremorie/rx-ai`. Angular: `@gremorie/ng-ai`.
 */
export const tool = defineContract({
  name: 'tool',
  category: 'chatbot',
  status: 'stable',
  anatomy: `
    <tool>
    └─ tool (collapsible card + open state)
       ├─ tool-header (name/title + state badge + chevron)
       └─ tool-content (collapsible body)
          ├─ tool-input (formatted parameters)
          └─ tool-output (result, or error text)`,
  props: [
    {
      name: 'open',
      type: 'boolean',
      default: false,
      adapts: { ng: 'model: open' },
      desc: 'Controlled open state; Angular two-way binds via the open model.',
    },
    {
      name: 'type',
      type: 'string',
      required: true,
      desc: 'AI-SDK tool name, e.g. "tool-readFile" (on tool-header).',
    },
    {
      name: 'state',
      type: 'ToolState',
      required: true,
      options: [
        'input-streaming',
        'input-available',
        'approval-requested',
        'approval-responded',
        'output-available',
        'output-denied',
      ],
      desc: 'Execution state; drives the badge (on tool-header).',
    },
    {
      name: 'title',
      type: 'string',
      desc: 'Display title; defaults to a humanized type (on tool-header).',
    },
    {
      name: 'input',
      type: 'unknown',
      required: true,
      desc: 'Tool parameters object, pretty-printed (on tool-input).',
    },
    {
      name: 'output',
      type: 'unknown',
      desc: 'Tool result (object, string, or node) (on tool-output).',
    },
    {
      name: 'errorText',
      type: 'string',
      desc: 'Error message when the call failed (on tool-output).',
    },
  ],
  guidance: {
    summary:
      'A collapsible card for one AI-SDK tool call: name, state, input parameters, and result/error.',
    whenToUse: [
      'Show a single tool/function call the model made, with its arguments and result.',
      'Surface tool execution state (streaming, awaiting approval, done, denied).',
    ],
    whenNotToUse: [
      {
        text: 'A human-in-the-loop approval prompt for a tool',
        use: 'confirmation',
      },
      { text: 'A summary of an agent task and its file edits', use: 'task' },
    ],
    rules: [
      'state drives the header badge and which body parts show; set output OR errorText, not both.',
      'React types state as the AI-SDK ToolUIPart state union; Angular inlines an equivalent ToolState union to avoid the ai dependency.',
    ],
    example:
      '<tool>\n  <tool-header type="tool-readFile" state="output-available" />\n  <tool-content>\n    <tool-input [input]="args" />\n    <tool-output [output]="result" />\n  </tool-content>\n</tool>',
  },
  preview: {
    rx: 'ai-chatbot-tool--playground',
    ng: 'ai-tool--output-available',
  },
  figma: { nodeId: null },
});
