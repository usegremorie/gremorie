import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Assistant } from './assistant';

/**
 * Assistant — the Gremorie standard chat block, at full parity with the React
 * `Blocks/Assistant`. A complete, B2B-ready chat surface: a scrolling
 * conversation with reasoning, sources, response branches and message actions;
 * an inline generated chart artifact (chart/table toggle with working
 * downloads); and the B2B PromptInput composer (mentions, mode, model with
 * provider icons, attachments) floating over the conversation. The content fades
 * into the header at the top and behind the composer at the bottom. It ships a
 * local mock so it is testable end to end.
 *
 * It has two surfaces driven by the header's chat switcher: the live
 * conversation (`filled`) and the new-chat start state (`empty`) — a centered
 * welcome heading over the composer. Open the chat menu and pick "New chat" to
 * reach the empty state, or pick a recent chat to return to the conversation.
 *
 * ## Anatomy
 *
 * ```text
 * ai-assistant
 * ├─ header                          thread switcher + actions
 * ├─ conversation                    auto-scroll log
 * │  └─ conversation-content
 * │     ├─ message (user)
 * │     │  ├─ message-content
 * │     │  └─ message-toolbar         hover actions: copy · edit
 * │     └─ message (assistant)
 * │        └─ message-branch
 * │           ├─ message-branch-content
 * │           │  ├─ reasoning
 * │           │  ├─ message-response
 * │           │  └─ chart-artifact    inline chart with chart/table toggle + downloads
 * │           └─ message-toolbar       actions (left) · Sources + branch selector (right)
 * └─ prompt-input                    floating B2B composer
 * ```
 */
const meta: Meta<Assistant> = {
  title: 'Blocks/Assistant',
  component: Assistant,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [Assistant] })],
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The flagship Gremorie AI surface: a stick-to-bottom conversation log ' +
          'with reasoning, an inline generated chart artifact, sources, response ' +
          'branches and message actions, plus a floating B2B PromptInput composer ' +
          '(context, mode, model). Wire `(submitted)` to your AI SDK to make it real.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<Assistant>;

/**
 * Default — the live conversation (`filled`). Open the chat switcher in the
 * header and choose "New chat" to flip to the empty start state, then pick a
 * recent chat to come back.
 */
export const Default: Story = {
  render: () => ({
    template: `
      <div class="mx-auto max-w-3xl p-6">
        <ai-assistant [initialView]="'filled'" />
      </div>
    `,
  }),
};

/**
 * New chat — the empty start state: a centered welcome heading over the
 * composer, mirroring the Claude home screen. Sending a message drops you into
 * the conversation.
 */
export const NewChat: Story = {
  render: () => ({
    template: `
      <div class="mx-auto max-w-3xl p-6">
        <ai-assistant [initialView]="'empty'" />
      </div>
    `,
  }),
};
