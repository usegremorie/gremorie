import { Assistant } from './assistant';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * Assistant - the Gremorie standard chat block. A complete, B2B-ready chat
 * surface: a scrolling conversation with reasoning, sources, response branches
 * and message actions; a generated artifact panel; suggestion chips; and the
 * B2B PromptInput composer (mentions, mode, model with provider icons,
 * attachments). It ships a local mock so it is testable end to end.
 *
 * ## Anatomy
 *
 * ```text
 * Assistant
 * ├─ header                          thread switcher + actions (DropdownMenu · Button)
 * ├─ Conversation
 * │  └─ ConversationContent
 * │     ├─ Message (user)
 * │     │  ├─ MessageAttachments → MessageAttachment
 * │     │  └─ MessageContent
 * │     └─ Message (assistant)
 * │        └─ MessageBranch
 * │           ├─ MessageBranchContent
 * │           │  ├─ Reasoning
 * │           │  ├─ MessageResponse
 * │           │  ├─ Artifact          inline generated document
 * │           │  └─ Sources
 * │           └─ MessageToolbar       MessageActions + MessageBranchSelector
 * ├─ Suggestions → Suggestion
 * └─ PromptInput                      the B2B composer (see PromptInput)
 * ```
 */
const meta = {
  title: 'Blocks/Assistant',
  component: Assistant,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
} satisfies Meta<typeof Assistant>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
