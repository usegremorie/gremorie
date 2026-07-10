import type { Meta, StoryObj } from '@storybook/react';
import { ListTodoIcon, TrashIcon, XIcon } from 'lucide-react';

import {
  Queue,
  QueueItem,
  QueueItemAction,
  QueueItemActions,
  QueueItemAttachment,
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
 * # Queue
 *
 * A faithful port of the Vercel AI Elements **Queue** primitive — a scrollable
 * list of queued messages / todos with per-item status (pending vs completed),
 * hover actions, descriptions and attachments. Items can be grouped into
 * collapsible sections.
 *
 * ## Anatomy
 *
 * - **Queue** — the bordered card container.
 * - **QueueList** — scroll area wrapping the `<ul>`.
 * - **QueueItem** — a single `<li>` row (reveals actions on hover).
 * - **QueueItemIndicator** — status dot (`completed` greys it out).
 * - **QueueItemContent** — the primary text (strikethrough when completed).
 * - **QueueItemDescription** — secondary line.
 * - **QueueItemActions / QueueItemAction** — hover-revealed buttons.
 * - **QueueItemAttachment / Image / File** — attachment chips.
 * - **QueueSection / Trigger / Label / Content** — collapsible grouping.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `className` | `string` | — | Extra classes on the container. |
 * | `...divProps` | `ComponentProps<"div">` | — | Forwarded to the wrapper. |
 *
 * The `QueueMessage`, `QueueMessagePart` and `QueueTodo` types are exported to
 * describe the data you typically map over.
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `QueueList` | Scrollable list wrapper. |
 * | `QueueItem` | A queue row. |
 * | `QueueItemIndicator` | Status dot; `completed?: boolean`. |
 * | `QueueItemContent` | Primary text; `completed?: boolean`. |
 * | `QueueItemDescription` | Secondary text; `completed?: boolean`. |
 * | `QueueItemActions` | Hover action row. |
 * | `QueueItemAction` | Single ghost action button. |
 * | `QueueItemAttachment` | Attachment chip container. |
 * | `QueueItemImage` | Image attachment thumbnail. |
 * | `QueueItemFile` | File attachment chip. |
 * | `QueueSection` | Collapsible group. |
 * | `QueueSectionTrigger` | Group header button. |
 * | `QueueSectionLabel` | Group label with icon + count. |
 * | `QueueSectionContent` | Collapsible group body. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--background` / `--border` | Container surface and border. |
 * | `--muted` | Item hover and section header background. |
 * | `--muted-foreground` | Text and status colors. |
 *
 * ## Anatomy
 *
 * ```text
 * Queue
 * └─ QueueList
 *    └─ QueueSection                collapsible group
 *       ├─ QueueSectionTrigger
 *       │  └─ QueueSectionLabel      icon + count
 *       └─ QueueSectionContent
 *          └─ QueueItem              one per queued message
 *             ├─ QueueItemIndicator
 *             ├─ QueueItemContent → QueueItemDescription
 *             ├─ QueueItemAttachment → QueueItemImage / QueueItemFile
 *             └─ QueueItemActions → QueueItemAction
 * ```
 */
const meta = {
  title: 'AI/Chatbot/Queue',
  component: Queue,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Queue>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Workbench — fixed-width preview frame matching the catalog convention.
 * Same dataset as the Angular Workbench story.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ width: 420 }}>
      <Queue>
        <QueueList>
          <QueueItem>
            <div className="flex items-center gap-2">
              <QueueItemIndicator />
              <QueueItemContent>Summarize the PR description</QueueItemContent>
            </div>
          </QueueItem>
          <QueueItem>
            <div className="flex items-center gap-2">
              <QueueItemIndicator completed />
              <QueueItemContent completed>
                Generate release notes
              </QueueItemContent>
            </div>
            <QueueItemDescription completed>
              Done · 12s ago
            </QueueItemDescription>
          </QueueItem>
          <QueueItem>
            <div className="flex items-center gap-2">
              <QueueItemIndicator />
              <QueueItemContent>Draft the changelog entry</QueueItemContent>
            </div>
          </QueueItem>
        </QueueList>
      </Queue>
    </div>
  ),
};

/** A simple queue of pending and completed items. */
export const Default: Story = {
  render: () => (
    <div className="w-80">
      <Queue>
        <QueueList>
          <QueueItem>
            <div className="flex items-center gap-2">
              <QueueItemIndicator completed />
              <QueueItemContent completed>
                Summarize the onboarding doc
              </QueueItemContent>
              <QueueItemActions>
                <QueueItemAction>
                  <TrashIcon className="size-3.5" />
                </QueueItemAction>
              </QueueItemActions>
            </div>
          </QueueItem>
          <QueueItem>
            <div className="flex items-center gap-2">
              <QueueItemIndicator />
              <QueueItemContent>Draft the release notes</QueueItemContent>
              <QueueItemActions>
                <QueueItemAction>
                  <XIcon className="size-3.5" />
                </QueueItemAction>
              </QueueItemActions>
            </div>
          </QueueItem>
          <QueueItem>
            <div className="flex items-center gap-2">
              <QueueItemIndicator />
              <QueueItemContent>Review the open PRs</QueueItemContent>
              <QueueItemActions>
                <QueueItemAction>
                  <XIcon className="size-3.5" />
                </QueueItemAction>
              </QueueItemActions>
            </div>
          </QueueItem>
        </QueueList>
      </Queue>
    </div>
  ),
};

/** An item with a description and attachments. */
export const WithDetails: Story = {
  render: () => (
    <div className="w-80">
      <Queue>
        <QueueList>
          <QueueItem>
            <div className="flex items-center gap-2">
              <QueueItemIndicator />
              <QueueItemContent>Generate the cover image</QueueItemContent>
            </div>
            <QueueItemDescription>
              Use the brand palette and a 16:9 aspect ratio.
            </QueueItemDescription>
            <QueueItemAttachment>
              <QueueItemFile>brand-guidelines.pdf</QueueItemFile>
              <QueueItemFile>palette.json</QueueItemFile>
            </QueueItemAttachment>
          </QueueItem>
        </QueueList>
      </Queue>
    </div>
  ),
};

/** A collapsible section grouping the queued items with a count. */
export const Sectioned: Story = {
  render: () => (
    <div className="w-80">
      <Queue>
        <QueueSection defaultOpen>
          <QueueSectionTrigger>
            <QueueSectionLabel
              count={2}
              icon={<ListTodoIcon className="size-4" />}
              label="queued"
            />
          </QueueSectionTrigger>
          <QueueSectionContent>
            <QueueList>
              <QueueItem>
                <div className="flex items-center gap-2">
                  <QueueItemIndicator />
                  <QueueItemContent>Run the linter</QueueItemContent>
                </div>
              </QueueItem>
              <QueueItem>
                <div className="flex items-center gap-2">
                  <QueueItemIndicator />
                  <QueueItemContent>Deploy to staging</QueueItemContent>
                </div>
              </QueueItem>
            </QueueList>
          </QueueSectionContent>
        </QueueSection>
      </Queue>
    </div>
  ),
};
