import { Assistant } from './assistant';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * Assistant - the Gremorie standard chat block. A complete, B2B-ready chat
 * surface: a scrolling conversation with reasoning, sources, response branches
 * and message actions; a generated artifact panel; suggestion chips; and the
 * B2B PromptInput composer (context, mode, model with provider icons,
 * attachments). It ships a local mock so it is testable end to end.
 */
const meta = {
  title: 'Blocks/Assistant',
  component: Assistant,
  parameters: { layout: 'fullscreen', controls: { disable: true } },
} satisfies Meta<typeof Assistant>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
