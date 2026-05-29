import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Tool } from './tool';
import { ToolContent } from './tool-content';
import { ToolHeader } from './tool-header';
import { ToolInput } from './tool-input';
import { ToolOutput } from './tool-output';
import type { ToolState } from './tool.types';

/**
 * Tool — collapsible card for an AI SDK tool invocation.
 *
 * Each state on `ToolHeader` paints a distinct badge color via the
 * STATE_BADGE_COLORS map. Stories cover every state in the
 * `ToolUIPart["state"]` union so the badge palette is testable as a unit.
 */
type ToolArgs = {
  open: boolean;
  state: ToolState;
  type: string;
};

const meta: Meta<ToolArgs> = {
  title: 'AI/Tool',
  component: Tool,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [Tool, ToolHeader, ToolContent, ToolInput, ToolOutput],
    }),
  ],
  argTypes: {
    open: { control: 'boolean' },
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
      ],
    },
    type: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<ToolArgs>;

export const InputStreaming: Story = {
  name: 'State: input-streaming',
  args: { open: true, state: 'input-streaming', type: 'tool-readFile' },
  render: (args) => ({
    props: args,
    template: `
      <tool [open]="open">
        <tool-header [type]="type" [state]="state" />
        <tool-content>
          <tool-input [input]="{ path: 'pa…' }" />
        </tool-content>
      </tool>
    `,
  }),
};

export const InputAvailable: Story = {
  name: 'State: input-available',
  args: { open: true, state: 'input-available', type: 'tool-readFile' },
  render: (args) => ({
    props: args,
    template: `
      <tool [open]="open">
        <tool-header [type]="type" [state]="state" />
        <tool-content>
          <tool-input [input]="{ path: 'packages/ng-ai/src/lib/tool/tool.ts' }" />
        </tool-content>
      </tool>
    `,
  }),
};

export const ApprovalRequested: Story = {
  name: 'State: approval-requested',
  args: { open: true, state: 'approval-requested', type: 'tool-deleteFile' },
  render: (args) => ({
    props: args,
    template: `
      <tool [open]="open">
        <tool-header [type]="type" [state]="state" />
        <tool-content>
          <tool-input [input]="{ path: 'src/temp.log' }" />
        </tool-content>
      </tool>
    `,
  }),
};

export const ApprovalResponded: Story = {
  name: 'State: approval-responded',
  args: { open: true, state: 'approval-responded', type: 'tool-deleteFile' },
  render: (args) => ({
    props: args,
    template: `
      <tool [open]="open">
        <tool-header [type]="type" [state]="state" />
        <tool-content>
          <tool-input [input]="{ path: 'src/temp.log' }" />
        </tool-content>
      </tool>
    `,
  }),
};

export const OutputAvailable: Story = {
  name: 'State: output-available',
  args: { open: true, state: 'output-available', type: 'tool-readFile' },
  render: (args) => ({
    props: args,
    template: `
      <tool [open]="open">
        <tool-header [type]="type" [state]="state" />
        <tool-content>
          <tool-input [input]="{ path: 'README.md' }" />
          <tool-output [output]="{ content: '# Gremorie\\n\\nAI-native design system.', size: 42 }" />
        </tool-content>
      </tool>
    `,
  }),
};

export const OutputError: Story = {
  name: 'State: output-error',
  args: { open: true, state: 'output-error', type: 'tool-readFile' },
  render: (args) => ({
    props: args,
    template: `
      <tool [open]="open">
        <tool-header [type]="type" [state]="state" />
        <tool-content>
          <tool-input [input]="{ path: 'missing.txt' }" />
          <tool-output [errorText]="'ENOENT: file not found at missing.txt'" />
        </tool-content>
      </tool>
    `,
  }),
};

export const OutputDenied: Story = {
  name: 'State: output-denied',
  args: { open: true, state: 'output-denied', type: 'tool-deleteFile' },
  render: (args) => ({
    props: args,
    template: `
      <tool [open]="open">
        <tool-header [type]="type" [state]="state" />
        <tool-content>
          <tool-input [input]="{ path: 'src/temp.log' }" />
          <tool-output [errorText]="'User denied the destructive action.'" />
        </tool-content>
      </tool>
    `,
  }),
};

/**
 * Collapsed — header alone, no body. Useful regression for the chevron
 * rotation when `open` is `false`.
 */
export const Collapsed: Story = {
  args: { open: false, state: 'output-available', type: 'tool-readFile' },
  render: (args) => ({
    props: args,
    template: `
      <tool [open]="open">
        <tool-header [type]="type" [state]="state" />
        <tool-content>
          <tool-input [input]="{ path: 'README.md' }" />
          <tool-output [output]="{ content: 'hidden' }" />
        </tool-content>
      </tool>
    `,
  }),
};

/**
 * All states — every state in one canvas. Use this to validate the
 * STATE_BADGE_COLORS / STATE_LABELS maps when they change.
 */
export const AllStates: Story = {
  name: 'All states (matrix)',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex flex-col gap-3">
        <tool [open]="false"><tool-header type="tool-readFile" state="input-streaming" /></tool>
        <tool [open]="false"><tool-header type="tool-readFile" state="input-available" /></tool>
        <tool [open]="false"><tool-header type="tool-deleteFile" state="approval-requested" /></tool>
        <tool [open]="false"><tool-header type="tool-deleteFile" state="approval-responded" /></tool>
        <tool [open]="false"><tool-header type="tool-readFile" state="output-available" /></tool>
        <tool [open]="false"><tool-header type="tool-readFile" state="output-error" /></tool>
        <tool [open]="false"><tool-header type="tool-deleteFile" state="output-denied" /></tool>
      </div>
    `,
  }),
};
