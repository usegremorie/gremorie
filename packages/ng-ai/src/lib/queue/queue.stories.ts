import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  Queue,
  QueueItem,
  QueueItemActions,
  QueueItemContent,
  QueueItemDescription,
  QueueItemFile,
  QueueItemIndicator,
  QueueList,
  QueueSection,
  QueueSectionContent,
  QueueSectionLabel,
  QueueSectionTrigger,
} from './queue';

/**
 * Queue — a list of queued messages / todos. Mirrors React `Queue` from
 * `@gremorie/rx-ai`.
 */
const meta: Meta<Queue> = {
  title: 'AI/Chatbot/Queue',
  component: Queue,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        Queue,
        QueueList,
        QueueItem,
        QueueItemIndicator,
        QueueItemContent,
        QueueItemDescription,
        QueueItemActions,
        QueueItemFile,
        QueueSection,
        QueueSectionTrigger,
        QueueSectionLabel,
        QueueSectionContent,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<Queue>;

/**
 * Workbench — fixed-width preview frame matching the catalog convention.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: () => ({
    template: `
      <div style="width: 420px;">
        <queue>
          <queue-list>
            <queue-item>
              <div class="flex items-center gap-2">
                <queue-item-indicator />
                <queue-item-content>Summarize the PR description</queue-item-content>
              </div>
            </queue-item>
            <queue-item>
              <div class="flex items-center gap-2">
                <queue-item-indicator [completed]="true" />
                <queue-item-content [completed]="true">Generate release notes</queue-item-content>
              </div>
              <queue-item-description [completed]="true">Done · 12s ago</queue-item-description>
            </queue-item>
            <queue-item>
              <div class="flex items-center gap-2">
                <queue-item-indicator />
                <queue-item-content>Draft the changelog entry</queue-item-content>
              </div>
            </queue-item>
          </queue-list>
        </queue>
      </div>
    `,
  }),
};

/**
 * With attachments — items carry a file chip below the title.
 */
export const WithAttachments: Story = {
  render: () => ({
    template: `
      <queue class="w-[420px]">
        <queue-list>
          <queue-item>
            <div class="flex items-center gap-2">
              <queue-item-indicator />
              <queue-item-content>Review the attached spec</queue-item-content>
            </div>
            <div class="ml-6 mt-1 flex flex-wrap gap-2">
              <queue-item-file>spec.pdf</queue-item-file>
              <queue-item-file>diagram.png</queue-item-file>
            </div>
          </queue-item>
        </queue-list>
      </queue>
    `,
  }),
};

/**
 * Collapsible sections — group queued items under collapsible headers.
 */
export const Sections: Story = {
  render: () => ({
    template: `
      <queue class="w-[420px]">
        <queue-section [defaultOpen]="true">
          <queue-section-trigger>
            <queue-section-label [count]="2" label="pending" />
          </queue-section-trigger>
          <queue-section-content>
            <queue-list>
              <queue-item>
                <div class="flex items-center gap-2">
                  <queue-item-indicator />
                  <queue-item-content>Fix the flaky test</queue-item-content>
                </div>
              </queue-item>
              <queue-item>
                <div class="flex items-center gap-2">
                  <queue-item-indicator />
                  <queue-item-content>Update the docs</queue-item-content>
                </div>
              </queue-item>
            </queue-list>
          </queue-section-content>
        </queue-section>
      </queue>
    `,
  }),
};
