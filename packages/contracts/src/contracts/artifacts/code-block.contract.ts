import { defineContract } from '../../types';

/**
 * CodeBlock - a Shiki-highlighted code container. Renders light + dark snapshots
 * and shows the right one via the `dark:` variant; an optional copy button reads
 * the raw code from the parent.
 * React: `@gremorie/rx-artifacts`. Angular: `@gremorie/ng-artifacts`
 * (story title `Artifacts/CodeBlock`).
 */
export const codeBlock = defineContract({
  name: 'code-block',
  category: 'artifacts',
  status: 'stable',
  anatomy: `
    <code-block>
    └─ code-block (bordered surface, provides raw code via context/DI)
       ├─ pre / code (light snapshot, hidden in dark)
       ├─ pre / code (dark snapshot, hidden in light)
       └─ code-block-copy-button (optional, top-right)`,
  props: [
    {
      name: 'code',
      type: 'string',
      required: true,
      desc: 'The source to highlight (also what the copy button copies).',
    },
    {
      name: 'language',
      type: 'BundledLanguage',
      required: true,
      options: ['typescript', 'tsx', 'json', 'python', 'bash'],
      desc: 'Shiki language id.',
    },
    {
      name: 'showLineNumbers',
      type: 'boolean',
      default: false,
      desc: 'Prepend a line-number gutter via a Shiki transformer.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto the code-block surface.',
    },
    {
      name: 'onCopy',
      type: '() => void',
      adapts: { ng: 'n/a (copy button has no explicit success output)' },
      desc: 'CodeBlockCopyButton: fires after a successful clipboard write.',
    },
    {
      name: 'onError',
      type: '(error: Error) => void',
      adapts: { ng: 'n/a' },
      desc: 'CodeBlockCopyButton: fires when the clipboard write fails / is unavailable.',
    },
    {
      name: 'timeout',
      type: 'number',
      default: 2000,
      adapts: { ng: 'n/a (copy button uses a fixed reset delay)' },
      desc: 'CodeBlockCopyButton: ms before the copied state resets.',
    },
  ],
  guidance: {
    summary: 'Syntax-highlighted code, with an optional clipboard copy button.',
    whenToUse: [
      'Show a static, read-only code snippet with proper highlighting.',
      'Render fenced code inside chat/markdown output.',
    ],
    whenNotToUse: [
      { text: 'An editable code field', use: 'textarea' },
      { text: 'A live, runnable site/page preview', use: 'web-preview' },
      { text: 'Code as a titled, downloadable artifact card', use: 'artifact' },
    ],
    rules: [
      'Highlighting is async (Shiki) — the block may flash plain text before resolving.',
      'The copy button reads the raw code from the parent (React context / Angular DI), so it must be nested inside the code-block.',
      'Light/dark snapshots are both rendered; the theme is chosen by the `dark:` class, not re-highlighted at runtime.',
    ],
    example:
      '<code-block code="const x = 1;" language="typescript"><code-block-copy-button /></code-block>',
  },
  preview: {
    rx: 'ai-code-codeblock--type-script',
    ng: 'artifacts-codeblock--workbench',
  },
  figma: { nodeId: null },
});
