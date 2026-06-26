import type { Meta, StoryObj } from '@storybook/react';

import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
} from './confirmation';

/**
 * # Confirmation
 *
 * A faithful port of the Vercel AI Elements **Confirmation** — a human-in-the-
 * loop approval card for tool calls that need consent before running (e.g. a
 * destructive action). It is driven by the AI SDK `state` plus an `approval`
 * object and conditionally renders the requested / accepted / rejected slots.
 *
 * The card renders nothing while `state` is `"input-streaming"` /
 * `"input-available"` or when `approval` is missing. The `Request` slot shows
 * during `"approval-requested"`; the `Accepted` / `Rejected` slots show once a
 * response exists (`"approval-responded"`, `"output-available"`,
 * `"output-denied"`) based on `approval.approved`.
 *
 * ## Anatomy
 *
 * - **Confirmation** — the `Alert` shell; takes `state` and `approval`.
 * - **ConfirmationTitle** — inline description line.
 * - **ConfirmationRequest** — shown only while approval is pending.
 * - **ConfirmationActions** / **ConfirmationAction** — the accept/reject buttons
 *   (visible only while pending).
 * - **ConfirmationAccepted** / **ConfirmationRejected** — outcome messages once
 *   the user has responded.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `state` | `ToolUIPart["state"]` | — | AI SDK tool state driving visibility. |
 * | `approval` | `{ id: string; approved?: boolean; reason?: string }` | — | The approval request/response. |
 * | `className` | `string` | — | Extra classes on the `Alert`. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `ConfirmationTitle` | Inline description text. |
 * | `ConfirmationRequest` | Children shown only during `approval-requested`. |
 * | `ConfirmationActions` | Right-aligned button row (pending only). |
 * | `ConfirmationAction` | A small action `Button`. |
 * | `ConfirmationAccepted` | Children shown when `approved === true` and responded. |
 * | `ConfirmationRejected` | Children shown when `approved === false` and responded. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--card` / `--border` | Alert surface and border. |
 * | `--muted-foreground` | Description text. |
 *
 * ## Anatomy
 *
 * ```text
 * Confirmation
 * ├─ ConfirmationTitle
 * ├─ ConfirmationRequest      shown while pending
 * ├─ ConfirmationActions
 * │  └─ ConfirmationAction    accept / reject buttons
 * ├─ ConfirmationAccepted     shown when approved
 * └─ ConfirmationRejected     shown when rejected
 * ```
 */
const meta = {
  title: 'AI/Chatbot/Confirmation',
  component: Confirmation,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    state: {
      control: 'select',
      options: [
        'approval-requested',
        'approval-responded',
        'output-available',
        'output-denied',
      ],
    },
  },
} satisfies Meta<typeof Confirmation>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pending — the user is asked to approve a destructive action. */
export const Requested: Story = {
  name: 'State: approval-requested',
  args: {
    state: 'approval-requested',
    approval: { id: 'appr_1' },
  },
  render: (args) => (
    <div className="max-w-md">
      <Confirmation {...args}>
        <ConfirmationRequest>
          <ConfirmationTitle>
            Allow <strong>deleteFile</strong> to remove{' '}
            <code>src/legacy/config.ts</code>?
          </ConfirmationTitle>
        </ConfirmationRequest>
        <ConfirmationActions>
          <ConfirmationAction variant="outline">Reject</ConfirmationAction>
          <ConfirmationAction>Approve</ConfirmationAction>
        </ConfirmationActions>
      </Confirmation>
    </div>
  ),
};

/** Accepted — the user approved; the accepted message is shown. */
export const Accepted: Story = {
  name: 'State: accepted',
  args: {
    state: 'approval-responded',
    approval: { id: 'appr_1', approved: true },
  },
  render: (args) => (
    <div className="max-w-md">
      <Confirmation {...args}>
        <ConfirmationAccepted>
          <ConfirmationTitle>
            Approved — <strong>deleteFile</strong> may run.
          </ConfirmationTitle>
        </ConfirmationAccepted>
        <ConfirmationRejected>
          <ConfirmationTitle>Rejected.</ConfirmationTitle>
        </ConfirmationRejected>
      </Confirmation>
    </div>
  ),
};

/** Rejected — the user declined; the rejected message (with reason) is shown. */
export const Rejected: Story = {
  name: 'State: rejected',
  args: {
    state: 'output-denied',
    approval: {
      id: 'appr_1',
      approved: false,
      reason: 'Looks risky — keep the file.',
    },
  },
  render: (args) => (
    <div className="max-w-md">
      <Confirmation {...args}>
        <ConfirmationAccepted>
          <ConfirmationTitle>Approved.</ConfirmationTitle>
        </ConfirmationAccepted>
        <ConfirmationRejected>
          <ConfirmationTitle>
            Rejected — Looks risky, keep the file.
          </ConfirmationTitle>
        </ConfirmationRejected>
      </Confirmation>
    </div>
  ),
};
