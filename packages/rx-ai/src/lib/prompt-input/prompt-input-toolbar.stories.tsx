import type { Meta, StoryObj } from '@storybook/react';
import { PaperclipIcon } from 'lucide-react';

import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from './prompt-input';

/**
 * PromptInput toolbar - the footer row that holds tools and submit (React edition).
 *
 * Mirrors the ng-ai PromptInput/Toolbar stories. The React edition has no
 * dedicated `PromptInputToolbar`; the equivalent is `PromptInputFooter`, which
 * lays out leading tools and a trailing submit button with space-between.
 */
const meta = {
  title: 'AI/PromptInput/Toolbar',
  component: PromptInputFooter,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PromptInputFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Tools left, submit right',
  parameters: { controls: { disable: true } },
  render: () => (
    <PromptInput
      className="max-w-lg"
      onSubmit={() => {
        /* noop */
      }}
    >
      <PromptInputBody>
        <PromptInputTextarea placeholder="Ask anything..." />
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputButton aria-label="Attach file">
              <PaperclipIcon className="size-4" />
            </PromptInputButton>
          </PromptInputTools>
          <PromptInputSubmit status="ready" />
        </PromptInputFooter>
      </PromptInputBody>
    </PromptInput>
  ),
};
