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
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
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

export const Default: Story = {
  args: { variant: 'default' },
  render: (args) => ({
    props: args,
    template: `
      <gn-alert [variant]="variant">
        <gn-alert-title>Heads up!</gn-alert-title>
        <gn-alert-description>
          You can configure additional notification channels in your settings.
        </gn-alert-description>
      </gn-alert>
    `,
  }),
};

export const DefaultWithIcon: Story = {
  args: { variant: 'default' },
  render: (args) => ({
    props: args,
    template: `
      <gn-alert [variant]="variant">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4"/>
          <path d="M12 8h.01"/>
        </svg>
        <gn-alert-title>Heads up!</gn-alert-title>
        <gn-alert-description>
          You can configure additional notification channels in your settings.
        </gn-alert-description>
      </gn-alert>
    `,
  }),
};

export const Destructive: Story = {
  args: { variant: 'destructive' },
  render: (args) => ({
    props: args,
    template: `
      <gn-alert [variant]="variant">
        <gn-alert-title>Something went wrong</gn-alert-title>
        <gn-alert-description>
          We could not save your changes. Please try again.
        </gn-alert-description>
      </gn-alert>
    `,
  }),
};

export const DestructiveWithIcon: Story = {
  args: { variant: 'destructive' },
  render: (args) => ({
    props: args,
    template: `
      <gn-alert [variant]="variant">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <gn-alert-title>Error</gn-alert-title>
        <gn-alert-description>
          The deployment failed. Check the logs for details.
        </gn-alert-description>
      </gn-alert>
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
      <gn-alert>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20 6 9 17l-5-5"/>
        </svg>
        <gn-alert-title>Changes saved successfully.</gn-alert-title>
      </gn-alert>
    `,
  }),
};
