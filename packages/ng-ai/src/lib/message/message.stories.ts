import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  Message,
  MessageActions,
  MessageAction,
  MessageAvatar,
  MessageBranch,
  MessageBranchContent,
  MessageBranchItem,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageToolbar,
} from './';

/**
 * Message — atomic chat bubble.
 *
 * Stories cover the canonical roles (user, assistant, system) plus the
 * compound recipes: avatar + content, content + actions toolbar, and
 * the BranchSelector for regenerated alternates.
 */
const meta: Meta<Message> = {
  title: 'AI/Message',
  component: Message,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        Message,
        MessageContent,
        MessageAvatar,
        MessageActions,
        MessageAction,
        MessageToolbar,
        MessageBranch,
        MessageBranchItem,
        MessageBranchContent,
        MessageBranchSelector,
        MessageBranchPrevious,
        MessageBranchNext,
        MessageBranchPage,
      ],
    }),
  ],
  argTypes: {
    from: {
      control: 'inline-radio',
      options: ['user', 'assistant', 'system'],
    },
  },
};

export default meta;
type Story = StoryObj<Message>;

export const FromUser: Story = {
  args: { from: 'user' },
  render: (args) => ({
    props: args,
    template: `
      <message [from]="from">
        <message-content>
          Can you summarize the key points from our last meeting?
        </message-content>
      </message>
    `,
  }),
};

export const FromAssistant: Story = {
  args: { from: 'assistant' },
  render: (args) => ({
    props: args,
    template: `
      <message [from]="from">
        <message-content>
          Sure — the three main decisions were: ship the new dashboard by Friday,
          delay the migration, and revisit the auth flow next sprint.
        </message-content>
      </message>
    `,
  }),
};

export const FromSystem: Story = {
  args: { from: 'system' },
  render: (args) => ({
    props: args,
    template: `
      <message [from]="from">
        <message-content>
          Conversation started · Switched to GPT-4 · 3 tools enabled
        </message-content>
      </message>
    `,
  }),
};

/**
 * With avatar — assistant turn with an avatar slot. `MessageAvatar` renders
 * `<img>` when `src` is set, otherwise falls back to projected initials.
 */
export const WithAvatar: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <message from="assistant">
        <div class="flex items-start gap-2">
          <message-avatar name="AI">AI</message-avatar>
          <message-content>
            Hi! How can I help you today?
          </message-content>
        </div>
      </message>
    `,
  }),
};

/**
 * With actions — assistant turn with a toolbar of icon actions (copy,
 * regenerate, thumbs). Actions use BrnTooltip via `tooltip` input.
 */
export const WithActions: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <message from="assistant">
        <message-content>
          Here's a draft of the project plan. Let me know if you want to revise.
        </message-content>
        <message-toolbar>
          <message-actions>
            <message-action tooltip="Copy" label="Copy">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5" aria-hidden="true">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
            </message-action>
            <message-action tooltip="Regenerate" label="Regenerate">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5" aria-hidden="true">
                <path d="M3 12a9 9 0 1 0 9-9"/>
                <path d="M3 4v5h5"/>
              </svg>
            </message-action>
            <message-action tooltip="Thumbs up" label="Thumbs up">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5" aria-hidden="true">
                <path d="M7 10v12"/>
                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7"/>
              </svg>
            </message-action>
          </message-actions>
        </message-toolbar>
      </message>
    `,
  }),
};

/**
 * Branch navigation — two regenerated variants with prev / current / next
 * controls inside the MessageToolbar. The compound `<message-branch>`
 * tracks the currently-selected branch via injected state.
 */
export const WithBranches: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <message from="assistant">
        <message-branch>
          <message-branch-content>
            <ng-template messageBranchItem>
              <message-content>
                Option A — short summary: ship Friday, delay migration, revisit auth.
              </message-content>
            </ng-template>
            <ng-template messageBranchItem>
              <message-content>
                Option B — detailed plan: 1) Dashboard goes live Friday,
                2) Database migration moves to Q3, 3) Auth flow review scheduled next sprint.
              </message-content>
            </ng-template>
          </message-branch-content>
          <message-toolbar>
            <message-branch-selector from="assistant">
              <message-branch-previous />
              <message-branch-page />
              <message-branch-next />
            </message-branch-selector>
          </message-toolbar>
        </message-branch>
      </message>
    `,
  }),
};
