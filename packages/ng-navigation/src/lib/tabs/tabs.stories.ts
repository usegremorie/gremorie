import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

/**
 * Tabs — content switcher within a single view. Mirrors React `Tabs`. Behavior
 * delegated to spartan brain `BrnTabs`. `variant="line"` swaps the pill list
 * for a minimal underline indicator.
 */
const meta: Meta<Tabs> = {
  title: 'Interaction/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [Tabs, TabsList, TabsTrigger, TabsContent],
    }),
  ],
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;
type Story = StoryObj<Tabs>;

const PANELS = `
  <gr-tabs-content value="overview" class="text-sm text-muted-foreground">
    Make changes to your account here.
  </gr-tabs-content>
  <gr-tabs-content value="password" class="text-sm text-muted-foreground">
    Change your password here.
  </gr-tabs-content>
`;

/** Workbench — pill-style list, first tab active by default. */
export const Workbench: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => ({
    props: args,
    template: `
      <gr-tabs [orientation]="orientation" defaultValue="overview" class="w-96">
        <gr-tabs-list>
          <gr-tabs-trigger value="overview">Overview</gr-tabs-trigger>
          <gr-tabs-trigger value="password">Password</gr-tabs-trigger>
        </gr-tabs-list>
        ${PANELS}
      </gr-tabs>
    `,
  }),
};

/** Line — minimal underline indicator instead of the pill background. */
export const Line: Story = {
  render: () => ({
    template: `
      <gr-tabs defaultValue="overview" class="w-96">
        <gr-tabs-list variant="line">
          <gr-tabs-trigger value="overview">Overview</gr-tabs-trigger>
          <gr-tabs-trigger value="password">Password</gr-tabs-trigger>
        </gr-tabs-list>
        ${PANELS}
      </gr-tabs>
    `,
  }),
};

/** Vertical — tabs stack on the left of their panels. */
export const Vertical: Story = {
  render: () => ({
    template: `
      <gr-tabs orientation="vertical" defaultValue="profile">
        <gr-tabs-list>
          <gr-tabs-trigger value="profile">Profile</gr-tabs-trigger>
          <gr-tabs-trigger value="settings">Settings</gr-tabs-trigger>
        </gr-tabs-list>
        <gr-tabs-content value="profile" class="rounded-md border p-4 text-sm text-muted-foreground">
          Your public profile.
        </gr-tabs-content>
        <gr-tabs-content value="settings" class="rounded-md border p-4 text-sm text-muted-foreground">
          Application settings.
        </gr-tabs-content>
      </gr-tabs>
    `,
  }),
};

/** DisabledTab — a disabled trigger. */
export const DisabledTab: Story = {
  render: () => ({
    template: `
      <gr-tabs defaultValue="active" class="w-96">
        <gr-tabs-list>
          <gr-tabs-trigger value="active">Active</gr-tabs-trigger>
          <gr-tabs-trigger value="disabled" [disabled]="true">Disabled</gr-tabs-trigger>
        </gr-tabs-list>
        <gr-tabs-content value="active" class="text-sm text-muted-foreground">
          This tab is selectable.
        </gr-tabs-content>
      </gr-tabs>
    `,
  }),
};
