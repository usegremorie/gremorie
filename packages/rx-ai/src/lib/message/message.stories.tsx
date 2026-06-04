import type { Meta, StoryObj } from '@storybook/react';
import { Copy, RefreshCw, ThumbsUp } from 'lucide-react';

import {
  Message,
  MessageAction,
  MessageActions,
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
  MessageToolbar,
} from './message';

/**
 * Message - atomic chat bubble (React edition).
 *
 * Mirrors the ng-ai Message stories so both editions share one anatomy:
 * the canonical roles (user, assistant, system) plus the compound recipes
 * (actions toolbar, branch selector, markdown response).
 */
const meta = {
  title: 'AI/Chatbot/Message',
  component: Message,
  tags: ['autodocs'],
  argTypes: {
    from: {
      control: 'inline-radio',
      options: ['user', 'assistant', 'system'],
      description: 'Author role - drives bubble alignment and tone.',
    },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default - a full message turn (content plus an actions toolbar). Drive the
 * `from` control to walk the canonical roles user, assistant and system, which
 * change the bubble alignment and tone.
 */
export const Default: Story = {
  args: { from: 'assistant' },
  render: (args) => (
    <Message {...args}>
      <MessageContent>
        Here&apos;s a draft of the project plan. Let me know if you want to
        revise.
      </MessageContent>
      <MessageToolbar>
        <MessageActions>
          <MessageAction tooltip="Copy" label="Copy">
            <Copy className="size-3.5" aria-hidden="true" />
          </MessageAction>
          <MessageAction tooltip="Regenerate" label="Regenerate">
            <RefreshCw className="size-3.5" aria-hidden="true" />
          </MessageAction>
          <MessageAction tooltip="Thumbs up" label="Thumbs up">
            <ThumbsUp className="size-3.5" aria-hidden="true" />
          </MessageAction>
        </MessageActions>
      </MessageToolbar>
    </Message>
  ),
};

/**
 * Markdown response - `MessageResponse` renders streamed markdown (lists,
 * bold, code) instead of plain text.
 */
export const WithResponse: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Message from="assistant">
      <MessageContent>
        <MessageResponse>
          {`Here is a quick recap:

**Shipped**
- Auth flow
- Dashboard widget

Run \`npx gremorie add rx-message\` to install.`}
        </MessageResponse>
      </MessageContent>
    </Message>
  ),
};

/**
 * Branch navigation - two regenerated alternates with prev / page / next
 * controls inside the toolbar.
 */
export const WithBranches: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Message from="assistant">
      <MessageBranch defaultBranch={0}>
        <MessageBranchContent>
          <MessageContent key="a">
            Option A - short summary: ship Friday, delay migration, revisit
            auth.
          </MessageContent>
          <MessageContent key="b">
            Option B - detailed plan: 1) Dashboard goes live Friday, 2)
            Migration moves to Q3, 3) Auth review next sprint.
          </MessageContent>
        </MessageBranchContent>
        <MessageToolbar>
          <MessageBranchSelector from="assistant">
            <MessageBranchPrevious />
            <MessageBranchPage />
            <MessageBranchNext />
          </MessageBranchSelector>
        </MessageToolbar>
      </MessageBranch>
    </Message>
  ),
};
