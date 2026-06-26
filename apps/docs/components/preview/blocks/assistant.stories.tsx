import { Assistant } from './assistant';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * Assistant - the Gremorie standard chat block. A complete, B2B-ready chat
 * surface: a scrolling conversation with reasoning, sources, response branches
 * and message actions; an inline generated chart artifact (chart/table toggle
 * with working downloads); and the B2B PromptInput composer (mentions, mode,
 * model with provider icons, attachments) floating over the conversation. The
 * content fades into the header at the top and behind the composer at the
 * bottom, and the scrollbar reveals only while the user scrolls. It ships a
 * local mock so it is testable end to end.
 *
 * It has two surfaces driven by the header's chat switcher: the live
 * conversation (`filled`) and the new-chat start state (`empty`) - a centered
 * welcome heading over the composer. Open the chat menu and pick "New chat" to
 * reach the empty state, or pick a recent chat to return to the conversation.
 *
 * ## Anatomy
 *
 * ```text
 * Assistant
 * ├─ header                          thread switcher + actions (DropdownMenu · Button)
 * ├─ Conversation                    auto-scroll log; scrollbar reveals only while scrolling
 * │  └─ ConversationContent
 * │     ├─ Message (user)
 * │     │  ├─ MessageContent
 * │     │  └─ MessageToolbar          hover actions: MessageActions (Copy · Edit)
 * │     └─ Message (assistant)
 * │        └─ MessageBranch
 * │           ├─ MessageBranchContent
 * │           │  ├─ Reasoning
 * │           │  ├─ MessageResponse
 * │           │  └─ ChartArtifact     inline chart with chart/table toggle + downloads
 * │           └─ MessageToolbar        MessageActions (left) · Sources + MessageBranchSelector (right)
 * └─ PromptInput                      floating B2B composer (see PromptInput)
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

/**
 * Default - the live conversation (`filled`). Open the chat switcher in the
 * header and choose "New chat" to flip to the empty start state, then pick a
 * recent chat to come back.
 */
export const Default: Story = {};

/**
 * New chat - the empty start state: a centered welcome heading over the
 * composer, mirroring the Claude home screen. Sending a message drops you into
 * the conversation.
 */
export const NewChat: Story = {
  args: { initialView: 'empty' },
};
