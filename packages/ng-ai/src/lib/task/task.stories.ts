import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Task } from './task';
import { TaskContent } from './task-content';
import { TaskItem, TaskItemFile } from './task-item';
import { TaskTrigger } from './task-trigger';

/**
 * Task — collapsible card with file-attachment items.
 *
 * Stories cover: collapsed, expanded, with multiple files, with mixed
 * item types (plain text + file chip).
 */
const meta: Meta<Task> = {
  title: 'AI/Task',
  component: Task,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [Task, TaskTrigger, TaskContent, TaskItem, TaskItemFile],
    }),
  ],
};

export default meta;
type Story = StoryObj<Task>;

export const Expanded: Story = {
  render: () => ({
    template: `
      <task [open]="true">
        <task-trigger title="Found 3 files matching 'config'" />
        <task-content>
          <task-item>
            Searched the workspace for <task-item-file>config.ts</task-item-file>
          </task-item>
          <task-item>
            Also found <task-item-file>app.config.ts</task-item-file> and <task-item-file>vite.config.ts</task-item-file>
          </task-item>
        </task-content>
      </task>
    `,
  }),
};

export const Collapsed: Story = {
  render: () => ({
    template: `
      <task [open]="false">
        <task-trigger title="Searched 12 files (collapsed)" />
        <task-content>
          <task-item>Hidden until expanded.</task-item>
        </task-content>
      </task>
    `,
  }),
};

/**
 * With many files — chips wrap naturally inside a `<task-item>`.
 */
export const WithManyFiles: Story = {
  name: 'With many files',
  render: () => ({
    template: `
      <task [open]="true">
        <task-trigger title="Reviewed all .ts files in src/lib" />
        <task-content>
          <task-item>
            Inspected:
            <task-item-file>message.ts</task-item-file>
            <task-item-file>message-content.ts</task-item-file>
            <task-item-file>message-actions.ts</task-item-file>
            <task-item-file>message-avatar.ts</task-item-file>
            <task-item-file>message-toolbar.ts</task-item-file>
          </task-item>
        </task-content>
      </task>
    `,
  }),
};

export const MultipleSteps: Story = {
  name: 'Multiple steps',
  render: () => ({
    template: `
      <task [open]="true">
        <task-trigger title="Refactored the authentication flow" />
        <task-content>
          <task-item>1. Created <task-item-file>auth.service.ts</task-item-file></task-item>
          <task-item>2. Updated <task-item-file>app.config.ts</task-item-file></task-item>
          <task-item>3. Removed <task-item-file>legacy-auth.ts</task-item-file></task-item>
          <task-item>4. Added tests in <task-item-file>auth.spec.ts</task-item-file></task-item>
        </task-content>
      </task>
    `,
  }),
};

/**
 * Custom trigger — override the search-icon + chevron default by projecting
 * children into `<task-trigger>`.
 */
export const CustomTrigger: Story = {
  name: 'Custom trigger',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <task [open]="true">
        <task-trigger title="">
          <p class="font-medium text-sm">Custom trigger content</p>
        </task-trigger>
        <task-content>
          <task-item>Body content.</task-item>
        </task-content>
      </task>
    `,
  }),
};
