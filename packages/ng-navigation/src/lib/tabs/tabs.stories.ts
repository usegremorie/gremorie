import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

/**
 * Tabs — content switcher within a single view. Mirrors React `Tabs`. Behavior
 * delegated to spartan brain `BrnTabs`. `variant="line"` swaps the pill list
 * for a minimal underline indicator.
 */
const meta: Meta<Tabs> = {
  title: 'Navigation/Tabs',
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
  <gn-tabs-content value="overview" class="text-sm text-muted-foreground">
    Make changes to your account here.
  </gn-tabs-content>
  <gn-tabs-content value="password" class="text-sm text-muted-foreground">
    Change your password here.
  </gn-tabs-content>
`;

/** Workbench — pill-style list, first tab active by default. */
export const Workbench: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => ({
    props: args,
    template: `
      <gn-tabs [orientation]="orientation" defaultValue="overview" class="w-96">
        <gn-tabs-list>
          <gn-tabs-trigger value="overview">Overview</gn-tabs-trigger>
          <gn-tabs-trigger value="password">Password</gn-tabs-trigger>
        </gn-tabs-list>
        ${PANELS}
      </gn-tabs>
    `,
  }),
};

/** Line — minimal underline indicator instead of the pill background. */
export const Line: Story = {
  render: () => ({
    template: `
      <gn-tabs defaultValue="overview" class="w-96">
        <gn-tabs-list variant="line">
          <gn-tabs-trigger value="overview">Overview</gn-tabs-trigger>
          <gn-tabs-trigger value="password">Password</gn-tabs-trigger>
        </gn-tabs-list>
        ${PANELS}
      </gn-tabs>
    `,
  }),
};
