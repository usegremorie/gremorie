import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { CodeBlock } from './code-block';
import { CodeBlockCopyButton } from './code-block-copy-button';

/**
 * CodeBlock — Shiki-highlighted code container.
 *
 * Stories exercise the canonical languages (ts, json, python), the
 * line-numbers transformer, and the optional copy button companion.
 *
 * Note: Shiki highlight is async — the snapshot may briefly appear as
 * plain text before the highlighter resolves.
 */
type CodeBlockArgs = {
  code: string;
  language: string;
  showLineNumbers: boolean;
};

const meta: Meta<CodeBlockArgs> = {
  title: 'AI/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CodeBlock, CodeBlockCopyButton],
    }),
  ],
  argTypes: {
    language: {
      control: 'select',
      options: ['typescript', 'tsx', 'json', 'python', 'bash'],
    },
    showLineNumbers: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<CodeBlockArgs>;

const TS_CODE = `import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',
  standalone: true,
  template: \`<p>Hello {{ name }}</p>\`,
})
export class Hello {
  name = 'world';
}`;

const JSON_CODE = `{
  "name": "@gremorie/ng-ai",
  "version": "0.0.1",
  "peerDependencies": {
    "@angular/core": "^21.2.0",
    "shiki": "^4.0.0"
  }
}`;

const PYTHON_CODE = `def fib(n: int) -> int:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print([fib(i) for i in range(10)])`;

export const TypeScript: Story = {
  args: { code: TS_CODE, language: 'typescript', showLineNumbers: false },
  render: (args) => ({
    props: args,
    template: `
      <code-block [code]="code" [language]="language" [showLineNumbers]="showLineNumbers" />
    `,
  }),
};

export const Json: Story = {
  name: 'JSON',
  args: { code: JSON_CODE, language: 'json', showLineNumbers: false },
  render: (args) => ({
    props: args,
    template: `
      <code-block [code]="code" [language]="language" [showLineNumbers]="showLineNumbers" />
    `,
  }),
};

export const Python: Story = {
  args: { code: PYTHON_CODE, language: 'python', showLineNumbers: false },
  render: (args) => ({
    props: args,
    template: `
      <code-block [code]="code" [language]="language" [showLineNumbers]="showLineNumbers" />
    `,
  }),
};

/**
 * Line numbers — Shiki transformer prepends a line-number span on each
 * line.
 */
export const WithLineNumbers: Story = {
  name: 'With line numbers',
  args: { code: TS_CODE, language: 'typescript', showLineNumbers: true },
  render: (args) => ({
    props: args,
    template: `
      <code-block [code]="code" [language]="language" [showLineNumbers]="showLineNumbers" />
    `,
  }),
};

/**
 * With copy button — `<code-block-copy-button>` reads the raw code via DI
 * from the parent CodeBlock and writes to the clipboard.
 */
export const WithCopyButton: Story = {
  name: 'With copy button',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <code-block [code]="code" language="typescript">
        <code-block-copy-button />
      </code-block>
    `,
    props: {
      code: TS_CODE,
    },
  }),
};
