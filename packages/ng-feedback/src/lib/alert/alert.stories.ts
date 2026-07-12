import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Alert, AlertDescription, AlertTitle } from './alert';

/**
 * Alert — in-flow feedback message.
 *
 * 2 variants (default, destructive). Layout flips to icon + body when an
 * SVG is projected as the first child. Stories cover both orientations
 * plus pure-body usage.
 */
const meta: Meta<Alert> = {
  title: 'Interaction/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [Alert, AlertTitle, AlertDescription],
    }),
  ],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'destructive'],
    },
  },
};

export default meta;
type Story = StoryObj<Alert>;

/** Workbench — informational alert with icon, title and description. */
export const Workbench: Story = {
  args: { variant: 'default' },
  render: (args) => ({
    props: args,
    template: `
      <gr-alert [variant]="variant" class="max-w-lg">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4"/>
          <path d="M12 8h.01"/>
        </svg>
        <gr-alert-title>Heads up!</gr-alert-title>
        <gr-alert-description>
          You can configure additional notification channels in your settings.
        </gr-alert-description>
      </gr-alert>
    `,
  }),
};

export const Default: Story = {
  args: { variant: 'default' },
  render: (args) => ({
    props: args,
    template: `
      <gr-alert [variant]="variant">
        <gr-alert-title>Heads up!</gr-alert-title>
        <gr-alert-description>
          You can configure additional notification channels in your settings.
        </gr-alert-description>
      </gr-alert>
    `,
  }),
};

export const DefaultWithIcon: Story = {
  args: { variant: 'default' },
  render: (args) => ({
    props: args,
    template: `
      <gr-alert [variant]="variant">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4"/>
          <path d="M12 8h.01"/>
        </svg>
        <gr-alert-title>Heads up!</gr-alert-title>
        <gr-alert-description>
          You can configure additional notification channels in your settings.
        </gr-alert-description>
      </gr-alert>
    `,
  }),
};

export const Destructive: Story = {
  args: { variant: 'destructive' },
  render: (args) => ({
    props: args,
    template: `
      <gr-alert [variant]="variant">
        <gr-alert-title>Something went wrong</gr-alert-title>
        <gr-alert-description>
          We could not save your changes. Please try again.
        </gr-alert-description>
      </gr-alert>
    `,
  }),
};

export const DestructiveWithIcon: Story = {
  args: { variant: 'destructive' },
  render: (args) => ({
    props: args,
    template: `
      <gr-alert [variant]="variant">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <gr-alert-title>Error</gr-alert-title>
        <gr-alert-description>
          The deployment failed. Check the logs for details.
        </gr-alert-description>
      </gr-alert>
    `,
  }),
};

/**
 * Title only — Alert collapses gracefully without description.
 */
export const TitleOnly: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gr-alert>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20 6 9 17l-5-5"/>
        </svg>
        <gr-alert-title>Changes saved successfully.</gr-alert-title>
      </gr-alert>
    `,
  }),
};
