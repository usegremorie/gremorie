import { defineContract } from '../../types';

/**
 * PromptInput - the chat composer: an auto-growing textarea with a toolbar of
 * tools, attachments, model select, and a status-driven submit button. React
 * ships one monolithic, context-driven component; Angular decomposes it into a
 * container + focused parts. React: `@gremorie/rx-ai`. Angular: `@gremorie/ng-ai`.
 */
export const promptInput = defineContract({
  name: 'prompt-input',
  category: 'chatbot',
  status: 'stable',
  anatomy: `
    <prompt-input>
    └─ prompt-input (form root + state)
       ├─ prompt-input-attachments → prompt-input-attachment   (RX; chips above the field)
       ├─ prompt-input-textarea (auto-growing composer)
       └─ prompt-input-toolbar
          ├─ prompt-input-tools
          │  ├─ prompt-input-action-menu (+ trigger / content / item)
          │  └─ prompt-input-model-select (RX: prompt-input-select*)
          └─ prompt-input-submit (status-driven button)`,
  props: [
    {
      name: 'onSubmit',
      type: '(message: PromptInputMessage, event: FormEvent) => void | Promise<void>',
      required: true,
      adapts: { ng: 'output: submitted' },
      desc: 'Fires on submit with the text + attachments; Angular emits a PromptInputSubmitEvent.',
    },
    {
      name: 'value',
      type: 'string',
      default: '',
      adapts: { rx: 'controlled via PromptInputProvider' },
      desc: 'Composer text; Angular two-way binds via the value model.',
    },
    {
      name: 'attachments',
      type: 'AttachmentData[]',
      default: '[]',
      adapts: { rx: 'controlled via PromptInputProvider' },
      desc: 'Current attachments; Angular two-way binds via the attachments model.',
    },
    {
      name: 'state',
      type: 'PromptInputState',
      default: 'ready',
      options: ['ready', 'submitted', 'streaming', 'error'],
      adapts: { rx: 'status passed to prompt-input-submit' },
      desc: 'Composer status; React drives the submit button via its status prop instead.',
    },
    {
      name: 'size',
      type: 'string',
      default: 'md',
      options: ['sm', 'md', 'lg'],
      adapts: { rx: 'styling only' },
      desc: 'Spacing scale (Angular container input).',
    },
    {
      name: 'variant',
      type: 'string',
      default: 'default',
      options: ['default', 'ghost', 'bordered'],
      adapts: { rx: 'styling only' },
      desc: 'Surface style (Angular container input).',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      desc: 'Disable the whole composer.',
    },
    {
      name: 'submitOnEnter',
      type: 'boolean',
      default: true,
      adapts: { rx: 'built-in behavior' },
      desc: 'Submit on Enter (Shift+Enter for newline).',
    },
    {
      name: 'acceptAttachments',
      type: 'string[] | false',
      default: false,
      adapts: { rx: 'accept on add-attachments action' },
      desc: 'Allowed MIME patterns, or false to disable attachments.',
    },
    {
      name: 'maxAttachments',
      type: 'number',
      default: 10,
      adapts: { rx: 'enforced in attachment context' },
      desc: 'Max number of attachments.',
    },
    {
      name: 'maxAttachmentSize',
      type: 'number',
      desc: 'Max attachment size in bytes.',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: 'Ask anything…',
      desc: 'Textarea placeholder (on prompt-input-textarea).',
    },
    {
      name: 'onError',
      type: '(error: { code: string; message: string }) => void',
      adapts: { ng: 'output: attachmentError' },
      desc: 'Fires on attachment validation failure.',
    },
    {
      name: 'globalDrop',
      type: 'boolean',
      default: false,
      adapts: { ng: 'not implemented' },
      desc: 'React-only: accept file drops anywhere on the document.',
    },
  ],
  guidance: {
    summary:
      'The chat composer: an auto-growing textarea with a toolbar (tools, attachments, model select) and a status-driven submit button.',
    whenToUse: [
      'Build the message input at the bottom of a chat.',
      'Accept attachments and switch models inline alongside the prompt.',
    ],
    whenNotToUse: [
      { text: 'A plain single-line text field', use: 'input' },
      { text: 'A standalone multi-line text area', use: 'textarea' },
    ],
    rules: [
      'React is monolithic and context-driven (PromptInputProvider lifts value/attachments); compose with PromptInput* sub-parts.',
      'Angular decomposes into a container plus prompt-input-textarea / -toolbar / -tools / -submit / -action-menu / -model-select, with value & attachments as two-way models.',
      'The submit button reflects status: ready → send, streaming → stop, error → retry.',
    ],
    example:
      '<prompt-input (submitted)="send($event)">\n  <prompt-input-textarea />\n  <prompt-input-toolbar>\n    <prompt-input-tools />\n    <prompt-input-submit />\n  </prompt-input-toolbar>\n</prompt-input>',
  },
  preview: {
    rx: 'ai-chatbot-promptinput--ready',
    ng: 'promptinput-container--ready',
  },
  figma: { nodeId: null },
});
