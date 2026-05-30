import type { Meta, StoryObj } from "@storybook/react";

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "./reasoning";

/**
 * Reasoning - collapsible "Thinking..." block (React edition).
 *
 * Stories validate the streaming -> done transition (shimmered label,
 * duration label, auto-close), the manual-control mode via `open`,
 * and the override of the trigger via projected content.
 */
const meta = {
  title: "AI/Reasoning",
  component: Reasoning,
  tags: ["autodocs"],
  argTypes: {
    isStreaming: { control: "boolean" },
    defaultOpen: { control: "boolean" },
    open: { control: "boolean" },
    duration: { control: { type: "number", min: 0, max: 60, step: 1 } },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Reasoning>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Streaming: Story = {
  args: { isStreaming: true, defaultOpen: true },
  render: (args) => (
    <Reasoning {...args}>
      <ReasoningTrigger />
      <ReasoningContent>
        Analyzing the data... looking up references... composing the response.
      </ReasoningContent>
    </Reasoning>
  ),
};

export const Done: Story = {
  args: { isStreaming: false, defaultOpen: false, duration: 4 },
  render: (args) => (
    <Reasoning {...args}>
      <ReasoningTrigger />
      <ReasoningContent>
        Considered three approaches, picked the second one because it composed
        better with the existing handlers.
      </ReasoningContent>
    </Reasoning>
  ),
};

/**
 * Done unknown - `duration` undefined renders the "a few seconds" fallback.
 */
export const DoneUnknownDuration: Story = {
  name: "Done (unknown duration)",
  args: { isStreaming: false, defaultOpen: true },
  render: (args) => (
    <Reasoning {...args}>
      <ReasoningTrigger />
      <ReasoningContent>Quick thought.</ReasoningContent>
    </Reasoning>
  ),
};

/**
 * Manual control - drive open/close from the host via the `open` prop.
 * `defaultOpen=false` keeps the auto-open / auto-close logic out of the way.
 */
export const ManualControl: Story = {
  name: "Manual control",
  args: { isStreaming: false, defaultOpen: false, open: true, duration: 12 },
  render: (args) => (
    <Reasoning {...args}>
      <ReasoningTrigger />
      <ReasoningContent>
        Controlled via the `open` prop - toggle the &apos;open&apos; control to
        drive it.
      </ReasoningContent>
    </Reasoning>
  ),
};

/**
 * Custom trigger - project content into `ReasoningTrigger` to fully
 * replace the default brain-icon + shimmer + chevron.
 */
export const CustomTrigger: Story = {
  name: "Custom trigger",
  parameters: { controls: { disable: true } },
  render: () => (
    <Reasoning isStreaming={false} defaultOpen={true} duration={3}>
      <ReasoningTrigger>
        <button className="text-sm font-medium underline-offset-4 hover:underline">
          Show reasoning ↓
        </button>
      </ReasoningTrigger>
      <ReasoningContent>Detailed reasoning content goes here.</ReasoningContent>
    </Reasoning>
  ),
};
