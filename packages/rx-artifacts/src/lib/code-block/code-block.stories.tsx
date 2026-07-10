import type { Meta, StoryObj } from '@storybook/react';

import { CodeBlock, CodeBlockCopyButton } from './code-block';

/**
 * CodeBlock - Shiki-highlighted code container (React edition).
 *
 * Mirrors the ng-ai CodeBlock stories: the canonical languages (ts, json,
 * python), the line-numbers transformer, and the optional copy button
 * companion.
 *
 * Note: Shiki highlight is async - the snapshot may briefly appear as plain
 * text before the highlighter resolves.
 *
 * ## Anatomy
 *
 * ```text
 * CodeBlock                  Shiki-highlighted code container; exposes the raw code via context
 * └── CodeBlockCopyButton    Optional action-slot child; copies the context code to the clipboard
 * ```
 */
const meta = {
  title: 'AI/Code/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  argTypes: {
    language: {
      control: 'select',
      options: ['typescript', 'tsx', 'json', 'python', 'bash'],
    },
    showLineNumbers: { control: 'boolean' },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const TS_CODE = `import { useState } from 'react';

export function Hello({ name }: { name: string }) {
  const [count, setCount] = useState(0);
  return <p onClick={() => setCount((c) => c + 1)}>Hello {name} ({count})</p>;
}`;

const JSON_CODE = `{
  "name": "@gremorie/rx-ai",
  "version": "0.0.1",
  "peerDependencies": {
    "react": "^19.0.0",
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
  render: (args) => <CodeBlock {...args} />,
};

export const Json: Story = {
  name: 'JSON',
  args: { code: JSON_CODE, language: 'json', showLineNumbers: false },
  render: (args) => <CodeBlock {...args} />,
};

export const Python: Story = {
  args: { code: PYTHON_CODE, language: 'python', showLineNumbers: false },
  render: (args) => <CodeBlock {...args} />,
};

/**
 * Line numbers - the Shiki transformer prepends a line-number span on each
 * line.
 */
export const WithLineNumbers: Story = {
  name: 'With line numbers',
  args: { code: TS_CODE, language: 'typescript', showLineNumbers: true },
  render: (args) => <CodeBlock {...args} />,
};

/**
 * With copy button - `CodeBlockCopyButton` reads the raw code from the parent
 * CodeBlock context and writes it to the clipboard.
 */
export const WithCopyButton: Story = {
  name: 'With copy button',
  parameters: { controls: { disable: true } },
  render: () => (
    <CodeBlock code={TS_CODE} language="typescript">
      <CodeBlockCopyButton />
    </CodeBlock>
  ),
};

// Shared with the Angular `Workbench` story (ng-artifacts) - keep byte-identical
// so the dual-framework workbench highlights the same snippet on both sides.
const WORKBENCH_CODE = `export function fib(n: number): number {
  let a = 0;
  let b = 1;
  for (let i = 0; i < n; i += 1) {
    [a, b] = [b, a + b];
  }
  return a;
}`;

/**
 * Workbench preset: the shared framework-neutral TypeScript snippet with a copy
 * button, at a fixed 32rem width so the dual-framework workbench renders the
 * IDENTICAL use case as the Angular `Workbench` story. Keep both in sync.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => (
    <div className="w-[32rem] max-w-full">
      <CodeBlock code={WORKBENCH_CODE} language="typescript">
        <CodeBlockCopyButton />
      </CodeBlock>
    </div>
  ),
};
