import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Checkpoint, CheckpointIcon, CheckpointTrigger } from './checkpoint';

/**
 * Checkpoint — a conversation save-point row with a trailing separator.
 * Mirrors React `Checkpoint` from `@gremorie/rx-ai`.
 */
const meta: Meta<Checkpoint> = {
  title: 'AI/Checkpoint',
  component: Checkpoint,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [Checkpoint, CheckpointIcon, CheckpointTrigger],
    }),
  ],
};

export default meta;
type Story = StoryObj<Checkpoint>;

/**
 * Workbench — fixed-width preview frame matching the catalog convention.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: () => ({
    template: `
      <div style="width: 420px;">
        <checkpoint>
          <checkpoint-trigger tooltip="Restore to this checkpoint">
            <checkpoint-icon />
            Checkpoint
          </checkpoint-trigger>
        </checkpoint>
      </div>
    `,
  }),
};

/**
 * Default — icon + label trigger with the trailing separator.
 */
export const Default: Story = {
  render: () => ({
    template: `
      <checkpoint class="w-[420px]">
        <checkpoint-trigger>
          <checkpoint-icon />
          Restore checkpoint
        </checkpoint-trigger>
      </checkpoint>
    `,
  }),
};

/**
 * With tooltip — hover the trigger to reveal the tooltip (side: bottom).
 */
export const WithTooltip: Story = {
  render: () => ({
    template: `
      <checkpoint class="w-[420px]">
        <checkpoint-trigger tooltip="Revert the conversation to this point">
          <checkpoint-icon />
          v3 · 2:14 PM
        </checkpoint-trigger>
      </checkpoint>
    `,
  }),
};
