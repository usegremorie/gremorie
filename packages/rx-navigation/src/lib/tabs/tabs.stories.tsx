import type { Meta, StoryObj } from '@storybook/react';
import { CodeIcon, EyeIcon, SettingsIcon, UserIcon } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

/**
 * # Tabs
 *
 * Content switcher within a single view. Wraps Radix Tabs with two list
 * variants — a pill-style `default` (rounded background) and a minimal `line`
 * indicator — and honors `orientation` so vertical tabs work for sidebar-like
 * menus inside one panel.
 *
 * Use Tabs for mutually exclusive views of the same scope (Code/Preview,
 * Overview/Details). For cross-section navigation use Sidebar or
 * NavigationMenu; for filters use ToggleGroup.
 *
 * ## Anatomy
 *
 * - **Tabs** — the Radix root; carries `value` / `orientation`.
 * - **TabsList** — the trigger track; `variant` is `default` (pill) or `line`.
 * - **TabsTrigger** — one selectable tab.
 * - **TabsContent** — the panel shown for the active tab.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `defaultValue` | `string` | — | Initially active tab (uncontrolled). |
 * | `value` | `string` | — | Active tab (controlled). |
 * | `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Tab axis. |
 *
 * `TabsList` adds a CVA `variant` (`"default" \| "line"`).
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `TabsList` | Trigger track; `variant` pill vs line. |
 * | `TabsTrigger` | A single tab. |
 * | `TabsContent` | Panel for the matching `value`. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--muted` | `default` list background |
 * | `--background` | Active pill surface |
 * | `--foreground` | Active label + `line` indicator |
 * | `--ring` | Keyboard focus ring |
 */
const meta = {
  title: 'Interaction/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-[26rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const PANEL = 'mt-2 rounded-md border p-4 text-sm text-muted-foreground';

/** The default pill-style list. */
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className={PANEL}>
        Manage your account details and email.
      </TabsContent>
      <TabsContent value="password" className={PANEL}>
        Change your password here.
      </TabsContent>
      <TabsContent value="team" className={PANEL}>
        Invite and manage team members.
      </TabsContent>
    </Tabs>
  ),
};

/** The minimal `line` variant — an underline marks the active tab. */
export const LineVariant: Story = {
  render: () => (
    <Tabs defaultValue="preview">
      <TabsList variant="line">
        <TabsTrigger value="preview">
          <EyeIcon />
          Preview
        </TabsTrigger>
        <TabsTrigger value="code">
          <CodeIcon />
          Code
        </TabsTrigger>
      </TabsList>
      <TabsContent value="preview" className={PANEL}>
        The rendered preview.
      </TabsContent>
      <TabsContent value="code" className={PANEL}>
        The source code.
      </TabsContent>
    </Tabs>
  ),
};

/** Both list variants side by side for comparison. */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="a">
        <span className="mb-1 text-xs text-muted-foreground">default</span>
        <TabsList>
          <TabsTrigger value="a">One</TabsTrigger>
          <TabsTrigger value="b">Two</TabsTrigger>
          <TabsTrigger value="c">Three</TabsTrigger>
        </TabsList>
      </Tabs>
      <Tabs defaultValue="a">
        <span className="mb-1 text-xs text-muted-foreground">line</span>
        <TabsList variant="line">
          <TabsTrigger value="a">One</TabsTrigger>
          <TabsTrigger value="b">Two</TabsTrigger>
          <TabsTrigger value="c">Three</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  ),
};

/** Vertical orientation — tabs stack on the left of their panels. */
export const Vertical: Story = {
  render: () => (
    <Tabs
      defaultValue="profile"
      orientation="vertical"
      className="data-[orientation=vertical]:flex-row"
    >
      <TabsList>
        <TabsTrigger value="profile">
          <UserIcon />
          Profile
        </TabsTrigger>
        <TabsTrigger value="settings">
          <SettingsIcon />
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="profile"
        className="rounded-md border p-4 text-sm text-muted-foreground"
      >
        Your public profile.
      </TabsContent>
      <TabsContent
        value="settings"
        className="rounded-md border p-4 text-sm text-muted-foreground"
      >
        Application settings.
      </TabsContent>
    </Tabs>
  ),
};

/** A disabled trigger. */
export const DisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="active">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
      </TabsList>
      <TabsContent value="active" className={PANEL}>
        This tab is selectable.
      </TabsContent>
    </Tabs>
  ),
};
