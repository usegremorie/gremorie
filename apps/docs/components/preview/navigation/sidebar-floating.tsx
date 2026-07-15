'use client';

import {
  Sidebar,
  SidebarContent,
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
} from '@gremorie/rx-navigation';
import { CalendarIcon, HomeIcon, InboxIcon, SettingsIcon } from 'lucide-react';

const SIDEBAR_NAV: { title: string; icon: typeof HomeIcon }[] = [
  { title: 'Home', icon: HomeIcon },
  { title: 'Inbox', icon: InboxIcon },
  { title: 'Calendar', icon: CalendarIcon },
  { title: 'Settings', icon: SettingsIcon },
];

export function SidebarFloatingPreview() {
  return (
    // transform-gpu makes this box the containing block for the sidebar's
    // fixed-positioned panel, so the whole app shell stays inside the card.
    <div className="relative h-[420px] w-full transform-gpu overflow-hidden rounded-md border bg-sidebar">
      <SidebarProvider className="!min-h-0 h-full min-h-full">
        <Sidebar variant="floating" collapsible="icon">
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
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {SIDEBAR_NAV.map((item, i) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={i === 0}
                        tooltip={item.title}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <span className="font-medium text-sm">Overview</span>
          </header>
          <div className="p-6 text-muted-foreground text-sm">
            The floating variant detaches the panel with a rounded border and
            shadow. Toggle to see the icon-only collapsed state.
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
