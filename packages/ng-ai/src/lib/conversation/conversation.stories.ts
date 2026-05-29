import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from './';
import { Message, MessageContent } from '../message';

/**
 * Conversation — scrollable container that auto-sticks to bottom.
 *
 * Stories use a fixed height frame to demonstrate the scroll behavior
 * (auto-stick, scroll-button visibility). True auto-scroll behavior is
 * runtime-only; comments call out what to look for.
 */
const meta: Meta<Conversation> = {
  title: 'AI/Conversation',
  component: Conversation,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        Conversation,
        ConversationContent,
        ConversationEmptyState,
        ConversationScrollButton,
        Message,
        MessageContent,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<Conversation>;

export const Empty: Story = {
  render: () => ({
    template: `
      <div class="h-72 w-96 rounded-lg border">
        <conversation>
          <conversation-empty-state />
        </conversation>
      </div>
    `,
  }),
};

export const CustomEmpty: Story = {
  name: 'Empty (custom)',
  render: () => ({
    template: `
      <div class="h-72 w-96 rounded-lg border">
        <conversation>
          <conversation-empty-state
            title="Nothing here yet"
            description="Send a message to start the conversation."
          />
        </conversation>
      </div>
    `,
  }),
};

/**
 * Short thread — a handful of messages, all visible without scrolling.
 */
export const ShortThread: Story = {
  name: 'Short thread',
  render: () => ({
    template: `
      <div class="h-80 w-96 rounded-lg border">
        <conversation>
          <conversation-content>
            <message from="assistant">
              <message-content>Hey! How can I help?</message-content>
            </message>
            <message from="user">
              <message-content>What's the weather like?</message-content>
            </message>
            <message from="assistant">
              <message-content>I can't check the weather, but I can help you find a service that does.</message-content>
            </message>
          </conversation-content>
        </conversation>
      </div>
    `,
  }),
};

/**
 * Long thread — fixed-height frame; expect scroll. Scroll-button shows
 * only when user scrolls up. Auto-stick keeps the latest message in view.
 */
export const LongThread: Story = {
  name: 'Long thread (scrollable)',
  render: () => ({
    template: `
      <div class="h-80 w-96 rounded-lg border">
        <conversation>
          <conversation-content>
            @for (i of [0,1,2,3,4,5,6,7,8,9,10,11]; track i) {
              <message [from]="i % 2 === 0 ? 'user' : 'assistant'">
                <message-content>Message #{{ i }} — Lorem ipsum dolor sit amet, consectetur adipiscing elit.</message-content>
              </message>
            }
          </conversation-content>
          <conversation-scroll-button />
        </conversation>
      </div>
    `,
  }),
};
