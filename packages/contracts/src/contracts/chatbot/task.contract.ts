import { defineContract } from '../../types';

/**
 * Task - a collapsible block summarizing an agent task and its steps, with file
 * chips for touched files. React: `@gremorie/rx-ai`. Angular: `@gremorie/ng-ai`.
 */
export const task = defineContract({
  name: 'task',
  category: 'chatbot',
  status: 'stable',
  anatomy: `
    <task>
    └─ task (collapsible root + open state)
       ├─ task-trigger (title + chevron)
       └─ task-content (collapsible body)
          └─ task-item (step line, repeatable)
             └─ task-item-file (file chip: icon + name)`,
  props: [
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: true,
      adapts: { ng: 'model: open' },
      desc: 'Initial open state (React); Angular exposes a two-way open model instead.',
    },
    {
      name: 'title',
      type: 'string',
      required: true,
      desc: 'Header text and collapse trigger (on task-trigger).',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto the task surface.',
    },
  ],
  guidance: {
    summary:
      'A collapsible summary of an agent task, its steps, and the files it touched.',
    whenToUse: [
      'Show what an agent did as a foldable list of steps and file edits.',
      'Group a sequence of actions under one expandable header.',
    ],
    whenNotToUse: [
      {
        text: 'A reasoning trace of how the model thought',
        use: 'chain-of-thought',
      },
      { text: 'A tool call with input/output payloads', use: 'tool' },
      { text: 'A flat queue of pending/done items', use: 'queue' },
    ],
    rules: [
      'task-trigger.title is the header; provide custom trigger content by projecting children.',
      'Wrap file references in task-item-file so they render as chips.',
    ],
    example:
      '<task title="Refactored auth">\n  <task-content>\n    <task-item>Edited <task-item-file>auth.ts</task-item-file></task-item>\n  </task-content>\n</task>',
  },
  preview: {
    rx: 'ai-chatbot-task--workbench',
    ng: 'ai-chatbot-task--workbench',
  },
  tag: { rx: 'Task', ng: 'task' },
  example: {
    defaultOpen: true,
    title: "Found 3 files matching 'config'",
  },
  figma: { nodeId: null },
});
