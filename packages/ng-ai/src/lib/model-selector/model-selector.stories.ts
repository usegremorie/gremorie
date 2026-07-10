import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorSeparator,
  ModelSelectorShortcut,
} from './model-selector';

/**
 * ModelSelector — a command-palette model picker. Mirrors React
 * `ModelSelector` from `@gremorie/rx-ai`. The list is backed by
 * `@spartan-ng/brain/command` (filter / keyboard nav / selection).
 */
const meta: Meta<ModelSelector> = {
  title: 'AI/Chatbot/ModelSelector',
  component: ModelSelector,
  tags: ['autodocs'],
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [
        ModelSelector,
        ModelSelectorContent,
        ModelSelectorInput,
        ModelSelectorList,
        ModelSelectorEmpty,
        ModelSelectorGroup,
        ModelSelectorItem,
        ModelSelectorSeparator,
        ModelSelectorShortcut,
        ModelSelectorLogo,
        ModelSelectorName,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<ModelSelector>;

/**
 * Workbench — fixed-width preview frame matching the catalog convention.
 * Type to filter the model list.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: () => ({
    template: `
      <div style="width: 420px;">
        <model-selector>
          <model-selector-content>
            <model-selector-input placeholder="Search models…" />
            <model-selector-list>
              <model-selector-empty>No models found.</model-selector-empty>
              <model-selector-group>
                <model-selector-item value="claude-3-5-sonnet">
                  <model-selector-logo provider="anthropic" />
                  <model-selector-name>Claude 3.5 Sonnet</model-selector-name>
                  <model-selector-shortcut>⌘1</model-selector-shortcut>
                </model-selector-item>
                <model-selector-item value="gpt-4o">
                  <model-selector-logo provider="openai" />
                  <model-selector-name>GPT-4o</model-selector-name>
                  <model-selector-shortcut>⌘2</model-selector-shortcut>
                </model-selector-item>
                <model-selector-separator />
                <model-selector-item value="gemini-1.5-pro">
                  <model-selector-logo provider="google" />
                  <model-selector-name>Gemini 1.5 Pro</model-selector-name>
                  <model-selector-shortcut>⌘3</model-selector-shortcut>
                </model-selector-item>
              </model-selector-group>
            </model-selector-list>
          </model-selector-content>
        </model-selector>
      </div>
    `,
  }),
};

/**
 * Grouped by provider — two groups separated by a divider.
 */
export const Grouped: Story = {
  render: () => ({
    template: `
      <div style="width: 420px;">
        <model-selector>
          <model-selector-content>
            <model-selector-input />
            <model-selector-list>
              <model-selector-empty>No models found.</model-selector-empty>
              <model-selector-group>
                <model-selector-item value="claude-3-opus">
                  <model-selector-logo provider="anthropic" />
                  <model-selector-name>Claude 3 Opus</model-selector-name>
                </model-selector-item>
              </model-selector-group>
              <model-selector-separator />
              <model-selector-group>
                <model-selector-item value="gpt-4o-mini">
                  <model-selector-logo provider="openai" />
                  <model-selector-name>GPT-4o mini</model-selector-name>
                </model-selector-item>
              </model-selector-group>
            </model-selector-list>
          </model-selector-content>
        </model-selector>
      </div>
    `,
  }),
};
