import type { Meta, StoryObj } from '@storybook/react';

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from './conversation';
import { Message, MessageContent } from '../message';

/**
 * Conversation - scrollable container that auto-sticks to bottom (React edition).
 *
 * Stories use a fixed height frame to demonstrate the scroll behavior
 * (auto-stick, scroll-button visibility). True auto-scroll behavior is
 * runtime-only; comments call out what to look for.
 *
 * ## Anatomy
 *
 * ```text
 * Conversation
 * ├─ ConversationContent
 * │  ├─ ConversationEmptyState   shown when empty
 * │  └─ Message …                the messages (see Message)
 * └─ ConversationScrollButton    scroll-to-bottom
 * ```
 */
const meta = {
  title: 'AI/Chatbot/Conversation',
  component: Conversation,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Conversation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="h-72 w-96 rounded-lg border">
      <Conversation>
        <ConversationEmptyState />
      </Conversation>
    </div>
  ),
};

export const CustomEmpty: Story = {
  name: 'Empty (custom)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="h-72 w-96 rounded-lg border">
      <Conversation>
        <ConversationEmptyState
          title="Nothing here yet"
          description="Send a message to start the conversation."
        />
      </Conversation>
    </div>
  ),
};

/**
 * Short thread - a handful of messages, all visible without scrolling.
 */
export const ShortThread: Story = {
  name: 'Short thread',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="h-80 w-96 rounded-lg border">
      <Conversation>
        <ConversationContent>
          <Message from="assistant">
            <MessageContent>Hey! How can I help?</MessageContent>
          </Message>
          <Message from="user">
            <MessageContent>What&apos;s the weather like?</MessageContent>
          </Message>
          <Message from="assistant">
            <MessageContent>
              I can&apos;t check the weather, but I can help you find a service
              that does.
            </MessageContent>
          </Message>
        </ConversationContent>
      </Conversation>
    </div>
  ),
};

/**
 * Long thread - fixed-height frame; expect scroll. Scroll-button shows
 * only when user scrolls up. Auto-stick keeps the latest message in view.
 */
export const LongThread: Story = {
  name: 'Long thread (scrollable)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="h-80 w-96 rounded-lg border">
      <Conversation>
        <ConversationContent>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
            <Message key={i} from={i % 2 === 0 ? 'user' : 'assistant'}>
              <MessageContent>
                Message #{i} - Lorem ipsum dolor sit amet, consectetur
                adipiscing elit.
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
    </div>
  ),
};
