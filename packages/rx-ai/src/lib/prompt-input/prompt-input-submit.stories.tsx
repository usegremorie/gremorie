import type { Meta, StoryObj } from '@storybook/react';
import { TooltipProvider } from '@gremorie/rx-overlays';

import { PromptInputSubmit, type ChatStatus } from './prompt-input';

/**
 * # PromptInputSubmit
 *
 * The send button for the PromptInput, wired to the request lifecycle. It is a
 * `type="submit"` control whose icon tracks `status`, giving the user a single
 * affordance that doubles as a live progress indicator:
 *
 * | `status` | Icon | Meaning |
 * | --- | --- | --- |
 * | `ready` | ↵ corner-down-left | Idle, ready to send. |
 * | `submitted` | ⟳ spinner | Request sent, awaiting the first token. |
 * | `streaming` | ◼ square | Response streaming — the button now stops it. |
 * | `error` | ✕ | The request failed. |
 *
 * Pass `children` to override the icon (e.g. an arrow-up) and `tooltip` for a
 * hover label. Inherits `variant` / `size` from the underlying button.
 */
const meta = {
  title: 'AI/Chatbot/PromptInput/Submit',
  component: PromptInputSubmit,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  argTypes: {
    status: {
      control: 'select',
      options: ['ready', 'submitted', 'streaming', 'error'],
      description: 'Request lifecycle state that picks the icon.',
    },
  },
  args: {
    status: 'ready',
    tooltip: 'Send',
  },
} satisfies Meta<typeof PromptInputSubmit>;

export default meta;
type Story = StoryObj<typeof meta>;

const STATUSES: ChatStatus[] = ['ready', 'submitted', 'streaming', 'error'];

/** Playground — drive the `status` control to watch the icon swap. */
export const Playground: Story = {};

/** All four lifecycle states side by side. */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-end gap-6">
      {STATUSES.map((status) => (
        <div className="flex flex-col items-center gap-2" key={status}>
          <PromptInputSubmit status={status} />
          <span className="font-mono text-muted-foreground text-xs">
            {status}
          </span>
        </div>
      ))}
    </div>
  ),
};
