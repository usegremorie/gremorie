import type { Meta, StoryObj } from '@storybook/react';
import {
  CalendarIcon,
  HomeIcon,
  InboxIcon,
  SearchIcon,
  SettingsIcon,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
  SidebarTrigger,
} from './sidebar';

/**
 * # Sidebar
 *
 * The composable app-shell sidebar — the heaviest primitive in the KDS,
 * exposing 20+ subcomponents that compose into header / content / footer
 * regions with collapsible state, icon-only mode, a mobile sheet, badge slots,
 * sub-menus, and skeleton loaders.
 *
 * Any subtree using the sidebar must be wrapped in `SidebarProvider` —
 * including each story below. The provider also installs the `⌘B` / `Ctrl+B`
 * toggle shortcut.
 *
 * ## Anatomy
 *
 * - **SidebarProvider** — context + width vars + keyboard shortcut.
 * - **Sidebar** — the panel; `variant` (sidebar/floating/inset), `side`, `collapsible`.
 * - **SidebarHeader** / **SidebarFooter** — top/bottom regions.
 * - **SidebarContent** — the scrollable middle.
 * - **SidebarGroup** + **SidebarGroupLabel** + **SidebarGroupContent** — labelled sections.
 * - **SidebarMenu** / **SidebarMenuItem** / **SidebarMenuButton** — the nav rows.
 * - **SidebarMenuBadge** / **SidebarMenuSkeleton** — count slot / loading row.
 * - **SidebarInset** — the main content area beside the sidebar.
 * - **SidebarTrigger** / **SidebarRail** — toggle controls.
 *
 * ## Props (Sidebar)
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `side` | `"left" \| "right"` | `"left"` | Which edge it docks to. |
 * | `variant` | `"sidebar" \| "floating" \| "inset"` | `"sidebar"` | Visual treatment. |
 * | `collapsible` | `"offcanvas" \| "icon" \| "none"` | `"offcanvas"` | Collapse behavior. |
 *
 * `SidebarMenuButton` adds CVA `variant` (`default \| outline`) and `size`
 * (`default \| sm \| lg`), plus `isActive` and a `tooltip` (shown when collapsed).
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `SidebarProvider` | Required context wrapper. |
 * | `SidebarHeader` / `SidebarContent` / `SidebarFooter` | Layout regions. |
 * | `SidebarGroup` / `SidebarGroupLabel` / `SidebarGroupContent` | Labelled sections. |
 * | `SidebarMenu` / `SidebarMenuItem` / `SidebarMenuButton` | Nav rows. |
 * | `SidebarMenuBadge` / `SidebarMenuSkeleton` | Count + loading. |
 * | `SidebarInset` | Main content beside the sidebar. |
 * | `SidebarTrigger` / `SidebarRail` | Toggle controls. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--sidebar` / `--sidebar-foreground` | Panel surface + text |
 * | `--sidebar-accent` / `--sidebar-accent-foreground` | Hover + active rows |
 * | `--sidebar-border` | Borders + sub-menu rule |
 * | `--sidebar-ring` | Keyboard focus ring |
 * | `--sidebar-width` / `--sidebar-width-icon` | Expanded vs icon widths |
 */
const meta = {
  title: 'Interaction/Navigation/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const NAV = [
  { title: 'Home', icon: HomeIcon, badge: undefined as string | undefined },
  { title: 'Inbox', icon: InboxIcon, badge: '12' },
  { title: 'Calendar', icon: CalendarIcon, badge: undefined },
  { title: 'Search', icon: SearchIcon, badge: undefined },
  { title: 'Settings', icon: SettingsIcon, badge: undefined },
];

function AppShell({
  collapsible = 'offcanvas',
  variant = 'sidebar',
}: {
  collapsible?: 'offcanvas' | 'icon' | 'none';
  variant?: 'sidebar' | 'floating' | 'inset';
}) {
  return (
    <SidebarProvider>
      <Sidebar collapsible={collapsible} variant={variant}>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1 font-semibold">
            <div className="flex size-6 items-center justify-center rounded bg-sidebar-primary text-sidebar-primary-foreground">
              G
            </div>
            <span className="group-data-[collapsible=icon]:hidden">
              Gremorie
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV.map((item, i) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={i === 0} tooltip={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {item.badge ? (
                      <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Account">
                <SettingsIcon />
                <span>Account</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <span className="text-sm font-medium">Dashboard</span>
        </header>
        <div className="p-6 text-sm text-muted-foreground">
          Main content area. Use the trigger (or ⌘B / Ctrl+B) to toggle the
          sidebar.
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

/** A full app shell: provider + sidebar with a labelled group, badges, footer, and an inset. */
export const Default: Story = {
  render: () => <AppShell />,
};

/** `collapsible="icon"` — collapsing shrinks to an icon rail (tooltips appear on hover). */
export const IconCollapsible: Story = {
  render: () => <AppShell collapsible="icon" />,
};

/** The `floating` variant — a detached, rounded, shadowed panel. */
export const Floating: Story = {
  render: () => <AppShell variant="floating" collapsible="icon" />,
};

/** The `inset` variant — the main area floats as an inset card. */
export const Inset: Story = {
  render: () => <AppShell variant="inset" collapsible="icon" />,
};

/** Skeleton rows for the loading state of a sidebar menu. */
export const LoadingSkeleton: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {Array.from({ length: 5 }).map((_, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-6 text-sm text-muted-foreground">Loading…</div>
      </SidebarInset>
    </SidebarProvider>
  ),
};
