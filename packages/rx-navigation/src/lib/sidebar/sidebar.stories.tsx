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
 * ```text
 * SidebarProvider                 context + CSS width vars + Cmd/Ctrl+B shortcut
 * ├─ Sidebar                      the panel; variant / side / collapsible
 * │  ├─ SidebarHeader             top region (brand, switcher, search)
 * │  │  └─ SidebarInput           sidebar-density input
 * │  ├─ SidebarContent            scrollable middle region
 * │  │  ├─ SidebarGroup           a labelled section block
 * │  │  │  ├─ SidebarGroupLabel        small uppercase section label
 * │  │  │  ├─ SidebarGroupAction       action button in the group header
 * │  │  │  ├─ SidebarGroupContent      group body; hosts the menu
 * │  │  │  │  └─ SidebarMenu            <ul> of nav rows
 * │  │  │  │     └─ SidebarMenuItem     <li> row wrapper
 * │  │  │  │        ├─ SidebarMenuButton    the clickable nav entry
 * │  │  │  │        ├─ SidebarMenuAction    per-row action button
 * │  │  │  │        ├─ SidebarMenuBadge     count / status slot
 * │  │  │  │        ├─ SidebarMenuSkeleton  loading placeholder row
 * │  │  │  │        └─ SidebarMenuSub       <ul> of sub-items
 * │  │  │  │           └─ SidebarMenuSubItem    sub-row <li> wrapper
 * │  │  │  │              └─ SidebarMenuSubButton  nested link row
 * │  │  │  └─ SidebarSeparator         rule between regions / groups
 * │  ├─ SidebarFooter             bottom region (user menu, actions)
 * │  └─ SidebarRail               thin grab handle to toggle
 * └─ SidebarInset                 main content area beside the sidebar
 * ```
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

/**
 * Workbench preset: a labelled navigation group inside the app shell, framed
 * at a fixed `min-h-[420px]` bordered provider — the IDENTICAL use case as the
 * Angular `Workbench` story. Keep both in sync.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <SidebarProvider className="min-h-[420px] rounded-lg border">
      <Sidebar collapsible="none" className="border-r">
        <SidebarHeader className="text-sm font-semibold">
          Acme Inc
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Projects</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Settings</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="text-xs text-muted-foreground">
          v1.0.0
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="p-4">
        <SidebarTrigger />
        <p className="mt-2 text-sm text-muted-foreground">Main content area.</p>
      </SidebarInset>
    </SidebarProvider>
  ),
};

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
