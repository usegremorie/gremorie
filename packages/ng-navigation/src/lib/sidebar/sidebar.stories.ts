import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from './sidebar';

/**
 * Sidebar — composable app-shell sidebar. Mirrors React `Sidebar`. Wrap every
 * usage (including each story) in a `gr-sidebar-provider`, which owns the
 * collapsible state.
 */
const meta: Meta<Sidebar> = {
  title: 'Interaction/Navigation/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [
        SidebarProvider,
        Sidebar,
        SidebarHeader,
        SidebarContent,
        SidebarFooter,
        SidebarGroup,
        SidebarGroupLabel,
        SidebarGroupContent,
        SidebarMenu,
        SidebarMenuItem,
        SidebarMenuButton,
        SidebarInset,
        SidebarTrigger,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<Sidebar>;

/** Workbench — a labelled navigation group inside the app shell. */
export const Workbench: Story = {
  render: () => ({
    template: `
      <gr-sidebar-provider class="min-h-[420px] rounded-lg border">
        <gr-sidebar collapsible="none" class="border-r">
          <gr-sidebar-header class="text-sm font-semibold">Acme Inc</gr-sidebar-header>
          <gr-sidebar-content>
            <gr-sidebar-group>
              <gr-sidebar-group-label>Platform</gr-sidebar-group-label>
              <gr-sidebar-group-content>
                <ul gr-sidebar-menu>
                  <li gr-sidebar-menu-item>
                    <button gr-sidebar-menu-button [isActive]="true">Dashboard</button>
                  </li>
                  <li gr-sidebar-menu-item>
                    <button gr-sidebar-menu-button>Projects</button>
                  </li>
                  <li gr-sidebar-menu-item>
                    <button gr-sidebar-menu-button>Settings</button>
                  </li>
                </ul>
              </gr-sidebar-group-content>
            </gr-sidebar-group>
          </gr-sidebar-content>
          <gr-sidebar-footer class="text-xs text-muted-foreground">v1.0.0</gr-sidebar-footer>
        </gr-sidebar>
        <gr-sidebar-inset class="p-4">
          <gr-sidebar-trigger></gr-sidebar-trigger>
          <p class="mt-2 text-sm text-muted-foreground">Main content area.</p>
        </gr-sidebar-inset>
      </gr-sidebar-provider>
    `,
  }),
};

/** IconCollapsible — `collapsible="icon"` shrinks the panel to an icon rail. */
export const IconCollapsible: Story = {
  render: () => ({
    template: `
      <gr-sidebar-provider class="min-h-[420px] rounded-lg border">
        <gr-sidebar collapsible="icon" class="border-r">
          <gr-sidebar-header class="text-sm font-semibold">Acme Inc</gr-sidebar-header>
          <gr-sidebar-content>
            <gr-sidebar-group>
              <gr-sidebar-group-label>Platform</gr-sidebar-group-label>
              <gr-sidebar-group-content>
                <ul gr-sidebar-menu>
                  <li gr-sidebar-menu-item>
                    <button gr-sidebar-menu-button [isActive]="true">Dashboard</button>
                  </li>
                  <li gr-sidebar-menu-item>
                    <button gr-sidebar-menu-button>Projects</button>
                  </li>
                  <li gr-sidebar-menu-item>
                    <button gr-sidebar-menu-button>Settings</button>
                  </li>
                </ul>
              </gr-sidebar-group-content>
            </gr-sidebar-group>
          </gr-sidebar-content>
        </gr-sidebar>
        <gr-sidebar-inset class="p-4">
          <gr-sidebar-trigger></gr-sidebar-trigger>
          <p class="mt-2 text-sm text-muted-foreground">Main content area.</p>
        </gr-sidebar-inset>
      </gr-sidebar-provider>
    `,
  }),
};

/** Floating — the `floating` variant with a rounded, bordered surface. */
export const Floating: Story = {
  render: () => ({
    template: `
      <gr-sidebar-provider class="min-h-[420px] rounded-lg border">
        <gr-sidebar collapsible="none" variant="floating">
          <gr-sidebar-content>
            <gr-sidebar-group>
              <gr-sidebar-group-content>
                <ul gr-sidebar-menu>
                  <li gr-sidebar-menu-item>
                    <button gr-sidebar-menu-button>Home</button>
                  </li>
                  <li gr-sidebar-menu-item>
                    <button gr-sidebar-menu-button>Inbox</button>
                  </li>
                </ul>
              </gr-sidebar-group-content>
            </gr-sidebar-group>
          </gr-sidebar-content>
        </gr-sidebar>
        <gr-sidebar-inset class="p-4">
          <gr-sidebar-trigger></gr-sidebar-trigger>
        </gr-sidebar-inset>
      </gr-sidebar-provider>
    `,
  }),
};

/** Inset — the `inset` variant floats the main area as an inset card. */
export const Inset: Story = {
  render: () => ({
    template: `
      <gr-sidebar-provider class="min-h-[420px] rounded-lg border">
        <gr-sidebar collapsible="icon" variant="inset">
          <gr-sidebar-content>
            <gr-sidebar-group>
              <gr-sidebar-group-content>
                <ul gr-sidebar-menu>
                  <li gr-sidebar-menu-item>
                    <button gr-sidebar-menu-button [isActive]="true">Home</button>
                  </li>
                  <li gr-sidebar-menu-item>
                    <button gr-sidebar-menu-button>Inbox</button>
                  </li>
                </ul>
              </gr-sidebar-group-content>
            </gr-sidebar-group>
          </gr-sidebar-content>
        </gr-sidebar>
        <gr-sidebar-inset class="p-4">
          <gr-sidebar-trigger></gr-sidebar-trigger>
          <p class="mt-2 text-sm text-muted-foreground">Main content area.</p>
        </gr-sidebar-inset>
      </gr-sidebar-provider>
    `,
  }),
};
