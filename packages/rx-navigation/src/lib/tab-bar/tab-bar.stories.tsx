import type { Meta, StoryObj } from '@storybook/react';
import {
  BellIcon,
  HomeIcon,
  LibraryIcon,
  SearchIcon,
  UserIcon,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { TabBar, TabBarItem, type TabBarProps } from './tab-bar';

/**
 * # Tab Bar
 *
 * The app's top-level destinations, docked to the bottom of a phone screen.
 * Three looks share one API: `material` (full-width bar with a pill
 * indicator), `ios` (floating translucent capsule) and `floating` (compact
 * icon-only pill).
 *
 * ## Anatomy
 *
 * ```text
 * TabBar                nav, fixed to the bottom, safe-area aware
 * └─ TabBarItem         one destination: icon, label, optional badge
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `variant` | `"material" \| "ios" \| "floating"` | `"material"` | The look. |
 * | `labels` | `"always" \| "active" \| "never"` | `"always"` | When labels show; `floating` hides them. |
 * | `value` / `defaultValue` | `string` | — | Active item. |
 * | `onValueChange` | `(value) => void` | — | Item chosen. |
 * | `hideOnScroll` | `boolean` | `false` | Slide away while scrolling down. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--surface-opacity`, `--surface-backdrop` | Translucent bar and capsules |
 * | `--accent` | Active indicator |
 * | `--primary` | Active item in `ios` |
 * | `--destructive` | Badge |
 */
const meta = {
  title: 'Interaction/Navigation/Tab Bar',
  component: TabBar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { variant: 'material', labels: 'always' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['material', 'ios', 'floating'],
    },
    labels: { control: 'inline-radio', options: ['always', 'active', 'never'] },
  },
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A phone-sized frame so the fixed bar sits inside the story. */
function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-[560px] w-[375px] overflow-hidden rounded-[2.5rem] border border-border bg-background">
      <div className="space-y-3 p-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-20 rounded-xl bg-muted" />
        ))}
      </div>
      {children}
    </div>
  );
}

function Demo(args: TabBarProps) {
  const [tab, setTab] = useState('home');
  return (
    <Phone>
      <TabBar {...args} className="absolute" value={tab} onValueChange={setTab}>
        <TabBarItem value="home" label="Home" icon={HomeIcon} />
        <TabBarItem value="search" label="Search" icon={SearchIcon} />
        <TabBarItem value="library" label="Library" icon={LibraryIcon} />
        <TabBarItem value="inbox" label="Inbox" icon={BellIcon} badge={3} />
        <TabBarItem value="profile" label="Profile" icon={UserIcon} />
      </TabBar>
    </Phone>
  );
}

/**
 * Workbench preset: material bar, Home active, a badge on Inbox, in a 375px
 * phone frame. The IDENTICAL use case as the Angular `Workbench` story.
 */
export const Workbench: Story = {
  render: (args) => <Demo {...args} />,
};

/** Full-width bar; the active icon sits on a pill indicator. */
export const Material: Story = {
  args: { variant: 'material' },
  render: (args) => <Demo {...args} />,
};

/** Floating translucent capsule, icon over label. */
export const IOS: Story = {
  name: 'iOS',
  args: { variant: 'ios' },
  render: (args) => <Demo {...args} />,
};

/** Compact icon-only pill; labels become the accessible name and a tooltip. */
export const Floating: Story = {
  args: { variant: 'floating' },
  render: (args) => <Demo {...args} />,
};

/** Only the active item shows its label. */
export const ActiveLabelOnly: Story = {
  args: { variant: 'material', labels: 'active' },
  render: (args) => <Demo {...args} />,
};
