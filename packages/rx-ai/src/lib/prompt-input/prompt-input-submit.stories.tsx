import type { Meta, StoryObj } from "@storybook/react";

import {
  type ChatStatus,
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
} from "./prompt-input";

const STATES: ChatStatus[] = ["ready", "submitted", "streaming", "error"];

/**
 * PromptInputSubmit - status-driven submit button (React edition).
 *
 * Mirrors the ng-ai PromptInput/Submit stories. The icon reflects the request
 * lifecycle: ready (send arrow), submitted (spinner), streaming (stop square),
 * error (cross). Pass the current `status` to keep it in sync.
 */
const meta = {
  title: "PromptInput/Submit",
  component: PromptInputSubmit,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof PromptInputSubmit>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * All four lifecycle states rendered side-by-side so the icon transitions are
 * easy to compare at a glance.
 */
export const AllStates: Story = {
  name: "All 4 states side-by-side",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap gap-4">
      {STATES.map((state) => (
        <div className="flex flex-col items-start gap-1" key={state}>
          <span className="text-muted-foreground text-xs uppercase tracking-wide">
            {state}
          </span>
          <PromptInput onSubmit={() => {}}>
            <PromptInputBody>
              <PromptInputTextarea className="sr-only" />
              <PromptInputSubmit status={state} />
            </PromptInputBody>
          </PromptInput>
        </div>
      ))}
    </div>
  ),
};

/**
 * Disabled - the submit button can be disabled (e.g. empty prompt) while still
 * reflecting the current status icon.
 */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap gap-4">
      {STATES.map((state) => (
        <div className="flex flex-col items-start gap-1" key={state}>
          <span className="text-muted-foreground text-xs uppercase tracking-wide">
            {state}
          </span>
          <PromptInput onSubmit={() => {}}>
            <PromptInputBody>
              <PromptInputTextarea className="sr-only" />
              <PromptInputSubmit disabled status={state} />
            </PromptInputBody>
          </PromptInput>
        </div>
      ))}
    </div>
  ),
};
