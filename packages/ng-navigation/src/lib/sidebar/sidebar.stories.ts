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
 * usage (including each story) in a `gn-sidebar-provider`, which owns the
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
      <gn-sidebar-provider class="min-h-[420px] rounded-lg border">
        <gn-sidebar collapsible="none" class="border-r">
          <gn-sidebar-header class="text-sm font-semibold">Acme Inc</gn-sidebar-header>
          <gn-sidebar-content>
            <gn-sidebar-group>
              <gn-sidebar-group-label>Platform</gn-sidebar-group-label>
              <gn-sidebar-group-content>
                <ul gn-sidebar-menu>
                  <li gn-sidebar-menu-item>
                    <button gn-sidebar-menu-button [isActive]="true">Dashboard</button>
                  </li>
                  <li gn-sidebar-menu-item>
                    <button gn-sidebar-menu-button>Projects</button>
                  </li>
                  <li gn-sidebar-menu-item>
                    <button gn-sidebar-menu-button>Settings</button>
                  </li>
                </ul>
              </gn-sidebar-group-content>
            </gn-sidebar-group>
          </gn-sidebar-content>
          <gn-sidebar-footer class="text-xs text-muted-foreground">v1.0.0</gn-sidebar-footer>
        </gn-sidebar>
        <gn-sidebar-inset class="p-4">
          <gn-sidebar-trigger></gn-sidebar-trigger>
          <p class="mt-2 text-sm text-muted-foreground">Main content area.</p>
        </gn-sidebar-inset>
      </gn-sidebar-provider>
    `,
  }),
};

/** IconCollapsible — `collapsible="icon"` shrinks the panel to an icon rail. */
export const IconCollapsible: Story = {
  render: () => ({
    template: `
      <gn-sidebar-provider class="min-h-[420px] rounded-lg border">
        <gn-sidebar collapsible="icon" class="border-r">
          <gn-sidebar-header class="text-sm font-semibold">Acme Inc</gn-sidebar-header>
          <gn-sidebar-content>
            <gn-sidebar-group>
              <gn-sidebar-group-label>Platform</gn-sidebar-group-label>
              <gn-sidebar-group-content>
                <ul gn-sidebar-menu>
                  <li gn-sidebar-menu-item>
                    <button gn-sidebar-menu-button [isActive]="true">Dashboard</button>
                  </li>
                  <li gn-sidebar-menu-item>
                    <button gn-sidebar-menu-button>Projects</button>
                  </li>
                  <li gn-sidebar-menu-item>
                    <button gn-sidebar-menu-button>Settings</button>
                  </li>
                </ul>
              </gn-sidebar-group-content>
            </gn-sidebar-group>
          </gn-sidebar-content>
        </gn-sidebar>
        <gn-sidebar-inset class="p-4">
          <gn-sidebar-trigger></gn-sidebar-trigger>
          <p class="mt-2 text-sm text-muted-foreground">Main content area.</p>
        </gn-sidebar-inset>
      </gn-sidebar-provider>
    `,
  }),
};

/** Floating — the `floating` variant with a rounded, bordered surface. */
export const Floating: Story = {
  render: () => ({
    template: `
      <gn-sidebar-provider class="min-h-[420px] rounded-lg border">
        <gn-sidebar collapsible="none" variant="floating">
          <gn-sidebar-content>
            <gn-sidebar-group>
              <gn-sidebar-group-content>
                <ul gn-sidebar-menu>
                  <li gn-sidebar-menu-item>
                    <button gn-sidebar-menu-button>Home</button>
                  </li>
                  <li gn-sidebar-menu-item>
                    <button gn-sidebar-menu-button>Inbox</button>
                  </li>
                </ul>
              </gn-sidebar-group-content>
            </gn-sidebar-group>
          </gn-sidebar-content>
        </gn-sidebar>
        <gn-sidebar-inset class="p-4">
          <gn-sidebar-trigger></gn-sidebar-trigger>
        </gn-sidebar-inset>
      </gn-sidebar-provider>
    `,
  }),
};

/** Inset — the `inset` variant floats the main area as an inset card. */
export const Inset: Story = {
  render: () => ({
    template: `
      <gn-sidebar-provider class="min-h-[420px] rounded-lg border">
        <gn-sidebar collapsible="icon" variant="inset">
          <gn-sidebar-content>
            <gn-sidebar-group>
              <gn-sidebar-group-content>
                <ul gn-sidebar-menu>
                  <li gn-sidebar-menu-item>
                    <button gn-sidebar-menu-button [isActive]="true">Home</button>
                  </li>
                  <li gn-sidebar-menu-item>
                    <button gn-sidebar-menu-button>Inbox</button>
                  </li>
                </ul>
              </gn-sidebar-group-content>
            </gn-sidebar-group>
          </gn-sidebar-content>
        </gn-sidebar>
        <gn-sidebar-inset class="p-4">
          <gn-sidebar-trigger></gn-sidebar-trigger>
          <p class="mt-2 text-sm text-muted-foreground">Main content area.</p>
        </gn-sidebar-inset>
      </gn-sidebar-provider>
    `,
  }),
};
