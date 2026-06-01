import type { Meta, StoryObj } from '@storybook/react';

import {
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
} from './prompt-input';

type ModelOption = {
  id: string;
  label: string;
  description: string;
  disabled?: boolean;
};

const MODELS: readonly ModelOption[] = [
  {
    id: 'claude-opus-4-7',
    label: 'Claude Opus 4.7',
    description: 'Highest quality, slower',
  },
  {
    id: 'claude-sonnet-4-6',
    label: 'Claude Sonnet 4.6',
    description: 'Balanced',
  },
  {
    id: 'claude-haiku-4-5',
    label: 'Claude Haiku 4.5',
    description: 'Fastest, cheapest',
  },
  { id: 'gpt-5', label: 'GPT-5', description: 'Coming soon', disabled: true },
];

/**
 * PromptInputSelect - in-input model picker (React edition).
 *
 * Mirrors the ng-ai PromptInput/ModelSelect stories. The React edition has no
 * dedicated `PromptInputModelSelect`; the equivalent is the `PromptInputSelect`
 * family (a styled Select), driven by a list of model options.
 */
const meta = {
  title: 'AI/PromptInput/ModelSelect',
  component: PromptInputSelect,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PromptInputSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Sonnet 4.6 selected',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="p-16">
      <PromptInputSelect defaultValue="claude-sonnet-4-6">
        <PromptInputSelectTrigger>
          <PromptInputSelectValue placeholder="Choose model" />
        </PromptInputSelectTrigger>
        <PromptInputSelectContent>
          {MODELS.map((model) => (
            <PromptInputSelectItem
              disabled={model.disabled}
              key={model.id}
              value={model.id}
            >
              {model.label}
            </PromptInputSelectItem>
          ))}
        </PromptInputSelectContent>
      </PromptInputSelect>
    </div>
  ),
};

/**
 * Unselected - no default value, so the placeholder is shown until the user
 * picks a model.
 */
export const Unselected: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="p-16">
      <PromptInputSelect>
        <PromptInputSelectTrigger>
          <PromptInputSelectValue placeholder="Choose model" />
        </PromptInputSelectTrigger>
        <PromptInputSelectContent>
          {MODELS.map((model) => (
            <PromptInputSelectItem
              disabled={model.disabled}
              key={model.id}
              value={model.id}
            >
              {model.label}
            </PromptInputSelectItem>
          ))}
        </PromptInputSelectContent>
      </PromptInputSelect>
    </div>
  ),
};

/**
 * Disabled - the whole trigger is disabled and cannot be opened.
 */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="p-16">
      <PromptInputSelect defaultValue="claude-sonnet-4-6" disabled>
        <PromptInputSelectTrigger>
          <PromptInputSelectValue placeholder="Choose model" />
        </PromptInputSelectTrigger>
        <PromptInputSelectContent>
          {MODELS.map((model) => (
            <PromptInputSelectItem
              disabled={model.disabled}
              key={model.id}
              value={model.id}
            >
              {model.label}
            </PromptInputSelectItem>
          ))}
        </PromptInputSelectContent>
      </PromptInputSelect>
    </div>
  ),
};
