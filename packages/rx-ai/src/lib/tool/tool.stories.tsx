import type { Meta, StoryObj } from "@storybook/react";
import type { ToolUIPart } from "ai";

import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "./tool";

/**
 * Tool - collapsible card for an AI SDK tool invocation (React edition).
 *
 * Mirrors the ng-ai Tool stories: each `state` on `ToolHeader` paints a
 * distinct status badge. Stories cover every state in the
 * `ToolUIPart["state"]` union plus the collapsed case and an all-states
 * matrix.
 */
const meta = {
  title: "AI/Tool",
  component: ToolHeader,
  tags: ["autodocs"],
  argTypes: {
    type: { control: "text" },
    state: {
      control: "select",
      options: [
        "input-streaming",
        "input-available",
        "approval-requested",
        "approval-responded",
        "output-available",
        "output-error",
        "output-denied",
      ] satisfies ToolUIPart["state"][],
    },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof ToolHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InputStreaming: Story = {
  name: "State: input-streaming",
  args: { state: "input-streaming", type: "tool-readFile" },
  render: (args) => (
    <Tool defaultOpen={true}>
      <ToolHeader {...args} />
      <ToolContent>
        <ToolInput input={{ path: "pa…" }} />
      </ToolContent>
    </Tool>
  ),
};

export const InputAvailable: Story = {
  name: "State: input-available",
  args: { state: "input-available", type: "tool-readFile" },
  render: (args) => (
    <Tool defaultOpen={true}>
      <ToolHeader {...args} />
      <ToolContent>
        <ToolInput input={{ path: "packages/rx-ai/src/lib/tool/tool.tsx" }} />
      </ToolContent>
    </Tool>
  ),
};

export const ApprovalRequested: Story = {
  name: "State: approval-requested",
  args: { state: "approval-requested", type: "tool-deleteFile" },
  render: (args) => (
    <Tool defaultOpen={true}>
      <ToolHeader {...args} />
      <ToolContent>
        <ToolInput input={{ path: "src/temp.log" }} />
      </ToolContent>
    </Tool>
  ),
};

export const ApprovalResponded: Story = {
  name: "State: approval-responded",
  args: { state: "approval-responded", type: "tool-deleteFile" },
  render: (args) => (
    <Tool defaultOpen={true}>
      <ToolHeader {...args} />
      <ToolContent>
        <ToolInput input={{ path: "src/temp.log" }} />
      </ToolContent>
    </Tool>
  ),
};

export const OutputAvailable: Story = {
  name: "State: output-available",
  args: { state: "output-available", type: "tool-readFile" },
  render: (args) => (
    <Tool defaultOpen={true}>
      <ToolHeader {...args} />
      <ToolContent>
        <ToolInput input={{ path: "README.md" }} />
        <ToolOutput
          errorText={undefined}
          output={{
            content: "# Gremorie\n\nAI-native design system.",
            size: 42,
          }}
        />
      </ToolContent>
    </Tool>
  ),
};

export const OutputError: Story = {
  name: "State: output-error",
  args: { state: "output-error", type: "tool-readFile" },
  render: (args) => (
    <Tool defaultOpen={true}>
      <ToolHeader {...args} />
      <ToolContent>
        <ToolInput input={{ path: "missing.txt" }} />
        <ToolOutput
          errorText="ENOENT: file not found at missing.txt"
          output={undefined}
        />
      </ToolContent>
    </Tool>
  ),
};

export const OutputDenied: Story = {
  name: "State: output-denied",
  args: { state: "output-denied", type: "tool-deleteFile" },
  render: (args) => (
    <Tool defaultOpen={true}>
      <ToolHeader {...args} />
      <ToolContent>
        <ToolInput input={{ path: "src/temp.log" }} />
        <ToolOutput
          errorText="User denied the destructive action."
          output={undefined}
        />
      </ToolContent>
    </Tool>
  ),
};

/**
 * Collapsed - header alone, no body. Useful regression for the chevron
 * rotation when the tool starts closed.
 */
export const Collapsed: Story = {
  args: { state: "output-available", type: "tool-readFile" },
  render: (args) => (
    <Tool defaultOpen={false}>
      <ToolHeader {...args} />
      <ToolContent>
        <ToolInput input={{ path: "README.md" }} />
        <ToolOutput errorText={undefined} output={{ content: "hidden" }} />
      </ToolContent>
    </Tool>
  ),
};

/**
 * All states - every state in one canvas. Use this to validate the status
 * badge palette when it changes.
 */
export const AllStates: Story = {
  name: "All states (matrix)",
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
