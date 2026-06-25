import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

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
 * Confirmation — a tool-approval alert. Mirrors React `Confirmation` from
 * `@gremorie/rx-ai`. Reveals request / accepted / rejected content based on
 * `state` + `approval`.
 */
const meta: Meta<Confirmation> = {
  title: 'AI/Confirmation',
  component: Confirmation,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        Confirmation,
        ConfirmationTitle,
        ConfirmationRequest,
        ConfirmationAccepted,
        ConfirmationRejected,
        ConfirmationActions,
        ConfirmationAction,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<Confirmation>;

/**
 * Workbench — fixed-width preview frame matching the catalog convention.
 * State is `approval-requested`, so the request prompt + action buttons show.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: () => ({
    props: { approval: { id: 't1' } },
    template: `
      <div style="width: 420px;">
        <confirmation [approval]="approval" state="approval-requested">
          <confirmation-request>
            <confirmation-title>
              Allow the agent to delete <strong>node_modules</strong>?
            </confirmation-title>
          </confirmation-request>
          <confirmation-actions>
            <confirmation-action variant="outline">Deny</confirmation-action>
            <confirmation-action>Allow</confirmation-action>
          </confirmation-actions>
        </confirmation>
      </div>
    `,
  }),
};

/**
 * Accepted — the request was approved; the accepted message is shown.
 */
export const Accepted: Story = {
  render: () => ({
    props: { approval: { id: 't1', approved: true } },
    template: `
      <confirmation class="w-[420px]" [approval]="approval" state="approval-responded">
        <confirmation-accepted>
          <confirmation-title>Approved — running the tool.</confirmation-title>
        </confirmation-accepted>
      </confirmation>
    `,
  }),
};

/**
 * Rejected — the request was denied; the rejected message is shown.
 */
export const Rejected: Story = {
  render: () => ({
    props: { approval: { id: 't1', approved: false, reason: 'Too risky' } },
    template: `
      <confirmation class="w-[420px]" [approval]="approval" state="output-denied">
        <confirmation-rejected>
          <confirmation-title>Denied — the tool was not run.</confirmation-title>
        </confirmation-rejected>
      </confirmation>
    `,
  }),
};
