import type { Meta, StoryObj } from '@storybook/react';
import type { ToolUIPart } from 'ai';

import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from './tool';

/**
 * Tool - collapsible card for an AI SDK tool invocation (React edition).
 *
 * Mirrors the ng-ai Tool stories: each `state` on `ToolHeader` paints a
 * distinct status badge. Stories cover every state in the
 * `ToolUIPart["state"]` union plus the collapsed case and an all-states
 * matrix.
 *
 * ## Anatomy
 *
 * ```text
 * Tool
 * ├─ ToolHeader    type + status badge
 * └─ ToolContent
 *    ├─ ToolInput  the call arguments
 *    └─ ToolOutput the result / error
 * ```
 */
const meta = {
  title: 'AI/Chatbot/Tool',
  component: ToolHeader,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'text' },
    state: {
      control: 'select',
      options: [
        'input-streaming',
        'input-available',
        'approval-requested',
        'approval-responded',
        'output-available',
        'output-error',
        'output-denied',
      ] satisfies ToolUIPart['state'][],
    },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ToolHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Playground - a full tool invocation. Drive the `state` control to walk every
 * state in the ToolUIPart union; the status badge and the output (or error)
 * adapt. The body shows the input and, for the output states, the result.
 */
export const Playground: Story = {
  args: { state: 'output-available', type: 'tool-readFile' },
  render: (args) => {
    const isError =
      args.state === 'output-error' || args.state === 'output-denied';
    const hasOutput = args.state === 'output-available';
    return (
      <Tool defaultOpen={true}>
        <ToolHeader {...args} />
        <ToolContent>
          <ToolInput input={{ path: 'README.md' }} />
          {(hasOutput || isError) && (
            <ToolOutput
              errorText={
                args.state === 'output-error'
                  ? 'ENOENT: file not found at README.md'
                  : args.state === 'output-denied'
                    ? 'User denied the destructive action.'
                    : undefined
              }
              output={
                hasOutput
                  ? {
                      content: '# Gremorie\n\nAI-native design system.',
                      size: 42,
                    }
                  : undefined
              }
            />
          )}
        </ToolContent>
      </Tool>
    );
  },
};

/**
 * All states - every state in one canvas. Use this to validate the status
 * badge palette when it changes.
 */
export const AllStates: Story = {
  name: 'All states (matrix)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-3">
      <Tool defaultOpen={false}>
        <ToolHeader state="input-streaming" type="tool-readFile" />
      </Tool>
      <Tool defaultOpen={false}>
        <ToolHeader state="input-available" type="tool-readFile" />
      </Tool>
      <Tool defaultOpen={false}>
        <ToolHeader state="approval-requested" type="tool-deleteFile" />
      </Tool>
      <Tool defaultOpen={false}>
        <ToolHeader state="approval-responded" type="tool-deleteFile" />
      </Tool>
      <Tool defaultOpen={false}>
        <ToolHeader state="output-available" type="tool-readFile" />
      </Tool>
      <Tool defaultOpen={false}>
        <ToolHeader state="output-error" type="tool-readFile" />
      </Tool>
      <Tool defaultOpen={false}>
        <ToolHeader state="output-denied" type="tool-deleteFile" />
      </Tool>
    </div>
  ),
};
