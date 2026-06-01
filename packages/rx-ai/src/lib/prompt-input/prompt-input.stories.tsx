import type { Meta, StoryObj } from '@storybook/react';

import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from './prompt-input';

/**
 * PromptInput - container for AI prompt entry (React edition).
 *
 * Mirrors the ng-ai PromptInput/Container stories. PromptInput owns the form,
 * keyboard shortcuts, and attachment validation. The submit button reflects the
 * request lifecycle (ready -> submitted -> streaming -> error) via its `status`
 * prop. Compose with PromptInputTextarea, PromptInputFooter, PromptInputTools
 * and PromptInputSubmit.
 */
const meta = {
  title: 'AI/PromptInput/Container',
  component: PromptInput,
  tags: ['autodocs'],
  args: { onSubmit: () => {} },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'PromptInput is the container for AI prompt entry. It owns the form ' +
          'submission, keyboard shortcuts, and attachment validation. The submit ' +
          'button surfaces the status machine (ready -> submitted -> streaming -> ' +
          'error). Compose with PromptInputTextarea, PromptInputFooter, ' +
          'PromptInputTools and PromptInputSubmit.',
      },
    },
  },
} satisfies Meta<typeof PromptInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <PromptInput className="max-w-lg" onSubmit={() => {}}>
      <PromptInputBody>
        <PromptInputTextarea placeholder="Ask anything..." />
        <PromptInputFooter>
          <PromptInputTools />
          <PromptInputSubmit status="ready" />
        </PromptInputFooter>
      </PromptInputBody>
    </PromptInput>
  ),
};

export const Submitted: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <PromptInput className="max-w-lg" onSubmit={() => {}}>
      <PromptInputBody>
        <PromptInputTextarea placeholder="Ask anything..." />
        <PromptInputFooter>
          <PromptInputTools />
          <PromptInputSubmit status="submitted" />
        </PromptInputFooter>
      </PromptInputBody>
    </PromptInput>
  ),
};

export const Streaming: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <PromptInput className="max-w-lg" onSubmit={() => {}}>
      <PromptInputBody>
        <PromptInputTextarea placeholder="Ask anything..." />
        <PromptInputFooter>
          <PromptInputTools />
          <PromptInputSubmit status="streaming" />
        </PromptInputFooter>
      </PromptInputBody>
    </PromptInput>
  ),
};

export const Error: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <PromptInput className="max-w-lg" onSubmit={() => {}}>
      <PromptInputBody>
        <PromptInputTextarea placeholder="Ask anything..." />
        <PromptInputFooter>
          <PromptInputTools />
          <PromptInputSubmit status="error" />
        </PromptInputFooter>
      </PromptInputBody>
    </PromptInput>
  ),
};
