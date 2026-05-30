import type { Meta, StoryObj } from "@storybook/react";

import { Task, TaskContent, TaskItem, TaskItemFile, TaskTrigger } from "./task";

/**
 * Task - collapsible card with file-attachment items (React edition).
 *
 * Mirrors the ng-ai Task stories: collapsed, expanded, with multiple files,
 * with mixed item types (plain text + file chip), and a custom trigger.
 */
const meta = {
  title: "AI/Task",
  component: Task,
  tags: ["autodocs"],
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description: "Whether the task starts expanded.",
    },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Task>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Task {...args}>
      <TaskTrigger title="Found 3 files matching 'config'" />
      <TaskContent>
        <TaskItem>
          Searched the workspace for <TaskItemFile>config.ts</TaskItemFile>
        </TaskItem>
        <TaskItem>
          Also found <TaskItemFile>app.config.ts</TaskItemFile> and{" "}
          <TaskItemFile>vite.config.ts</TaskItemFile>
        </TaskItem>
      </TaskContent>
    </Task>
  ),
};

export const Collapsed: Story = {
  args: { defaultOpen: false },
  render: (args) => (
    <Task {...args}>
      <TaskTrigger title="Searched 12 files (collapsed)" />
      <TaskContent>
        <TaskItem>Hidden until expanded.</TaskItem>
      </TaskContent>
    </Task>
  ),
};

/**
 * With many files - chips wrap naturally inside a `TaskItem`.
 */
export const WithManyFiles: Story = {
  name: "With many files",
  args: { defaultOpen: true },
  render: (args) => (
    <Task {...args}>
      <TaskTrigger title="Reviewed all .ts files in src/lib" />
      <TaskContent>
        <TaskItem>
          Inspected: <TaskItemFile>message.ts</TaskItemFile>{" "}
          <TaskItemFile>message-content.ts</TaskItemFile>{" "}
          <TaskItemFile>message-actions.ts</TaskItemFile>{" "}
          <TaskItemFile>message-avatar.ts</TaskItemFile>{" "}
          <TaskItemFile>message-toolbar.ts</TaskItemFile>
        </TaskItem>
      </TaskContent>
    </Task>
  ),
};

export const MultipleSteps: Story = {
  name: "Multiple steps",
  args: { defaultOpen: true },
  render: (args) => (
    <Task {...args}>
      <TaskTrigger title="Refactored the authentication flow" />
      <TaskContent>
        <TaskItem>
          1. Created <TaskItemFile>auth.service.ts</TaskItemFile>
        </TaskItem>
        <TaskItem>
          2. Updated <TaskItemFile>app.config.ts</TaskItemFile>
        </TaskItem>
        <TaskItem>
          3. Removed <TaskItemFile>legacy-auth.ts</TaskItemFile>
        </TaskItem>
        <TaskItem>
          4. Added tests in <TaskItemFile>auth.spec.ts</TaskItemFile>
        </TaskItem>
      </TaskContent>
    </Task>
  ),
};

/**
 * Custom trigger - override the search-icon + chevron default by projecting
 * children into `TaskTrigger`.
 */
export const CustomTrigger: Story = {
  name: "Custom trigger",
  parameters: { controls: { disable: true } },
  render: () => (
    <Task defaultOpen={true}>
      <TaskTrigger title="">
        <p className="font-medium text-sm">Custom trigger content</p>
      </TaskTrigger>
      <TaskContent>
        <TaskItem>Body content.</TaskItem>
      </TaskContent>
    </Task>
  ),
};
