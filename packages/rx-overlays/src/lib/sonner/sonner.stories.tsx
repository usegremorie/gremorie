import type { Meta, StoryObj } from '@storybook/react';

import { Toaster, toast } from './sonner';
import { Button } from '@gremorie/rx-forms';

/**
 * # Toaster (Sonner)
 *
 * The root mount for transient toast notifications, wrapping `sonner` with
 * Gremorie tokens and themed status icons. Mount `<Toaster />` once at the app
 * root, then call `toast()` from anywhere. Use for transient feedback ("Saved",
 * "Invite sent"); for persistent in-flow messages use `Alert`, and for critical
 * errors needing acknowledgment use `AlertDialog`.
 *
 * ## Anatomy
 *
 * ```text
 * Toaster                    singleton mount that renders the toast region
 * ├─ toast(message, opts)    imperative API fired from anywhere
 * │  ├─ toast.success        positive confirmation
 * │  ├─ toast.error          failure the user should know about
 * │  ├─ toast.warning        risky state, not yet a failure
 * │  ├─ toast.info           neutral system message
 * │  ├─ toast.loading        pending operation
 * │  └─ toast.promise        auto-transitions loading → success/error
 * └─ action                  optional inline action button on a toast
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `theme` | `"light" \| "dark" \| "system"` | follows `.dark` class | Color theme. |
 * | `position` | `ToasterProps["position"]` | `"bottom-right"` | Region placement. |
 * | `richColors` | `boolean` | `false` | Use saturated status colors. |
 * | `expand` | `boolean` | `false` | Expand stacked toasts on hover. |
 *
 * (All other `sonner` `ToasterProps` pass through.)
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--popover` | `--normal-bg` toast surface |
 * | `--popover-foreground` | `--normal-text` toast text |
 * | `--border` | `--normal-border` toast border |
 * | `--radius` | `--border-radius` |
 */
const meta = {
  title: 'Interaction/Overlays/Sonner',
  component: Toaster,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A row of buttons firing every toast variant. */
export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() =>
          toast('Event created', { description: 'Monday at 10:00 AM' })
        }
      >
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success('Changes saved successfully')}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error('Something went wrong')}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning('Your trial ends in 3 days')}
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info('A new version is available')}
      >
        Info
      </Button>
    </div>
  ),
};

/** A loading toast that is dismissed after a delay. */
export const Loading: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => {
        const id = toast.loading('Uploading file...');
        setTimeout(() => toast.success('Upload complete', { id }), 2000);
      }}
    >
      Loading → success
    </Button>
  ),
};

/** A promise toast that transitions loading → success / error automatically. */
export const PromiseToast: Story = {
  name: 'Promise',
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast.promise(
          new Promise<void>((resolve) => setTimeout(resolve, 2000)),
          {
            loading: 'Saving...',
            success: 'Settings saved',
            error: 'Could not save',
          },
        )
      }
    >
      Run promise
    </Button>
  ),
};

/** A toast with an action button. */
export const WithAction: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast('File deleted', {
          description: 'report.pdf was moved to trash',
          action: { label: 'Undo', onClick: () => toast.success('Restored') },
        })
      }
    >
      With action
    </Button>
  ),
};
