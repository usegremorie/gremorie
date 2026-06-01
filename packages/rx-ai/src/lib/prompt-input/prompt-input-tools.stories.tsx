import type { Meta, StoryObj } from '@storybook/react';
import { GlobeIcon, MicIcon, PaperclipIcon } from 'lucide-react';

import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputTools,
} from './prompt-input';

/**
 * PromptInputTools - inline cluster for in-input action buttons (React edition).
 *
 * Mirrors the ng-ai PromptInput/Tools stories. It is a flex row that groups
 * PromptInputButton actions (attach, voice, web search, ...) on the leading
 * side of the footer.
 */
const meta = {
  title: 'AI/PromptInput/Tools',
  component: PromptInputTools,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PromptInputTools>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <PromptInput className="max-w-lg" onSubmit={() => {}}>
      <PromptInputBody>
        <PromptInputTools>
          <PromptInputButton aria-label="Attach file">
            <PaperclipIcon className="size-4" />
          </PromptInputButton>
          <PromptInputButton aria-label="Voice input">
            <MicIcon className="size-4" />
          </PromptInputButton>
          <PromptInputButton aria-label="Web search">
            <GlobeIcon className="size-4" />
          </PromptInputButton>
        </PromptInputTools>
      </PromptInputBody>
    </PromptInput>
  ),
};
