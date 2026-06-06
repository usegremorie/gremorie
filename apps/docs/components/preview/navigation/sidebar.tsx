'use client';

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
  SidebarProvider,
  SidebarTrigger,
} from '@gremorie/rx-navigation';
import {
  CalendarIcon,
  HomeIcon,
  InboxIcon,
  SearchIcon,
  SettingsIcon,
} from 'lucide-react';

const SIDEBAR_NAV: { title: string; icon: typeof HomeIcon; badge?: string }[] =
  [
    { title: 'Home', icon: HomeIcon },
    { title: 'Inbox', icon: InboxIcon, badge: '12' },
    { title: 'Calendar', icon: CalendarIcon },
    { title: 'Search', icon: SearchIcon },
    { title: 'Settings', icon: SettingsIcon },
  ];

export function SidebarPreview() {
  return (
    // transform-gpu makes this box the containing block for the sidebar's
    // fixed-positioned panel, so the whole app shell stays inside the card.
    <div className="relative h-[420px] w-full transform-gpu overflow-hidden rounded-md border">
      <SidebarProvider className="!min-h-0 h-full min-h-full">
        <Sidebar collapsible="icon">
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
                  {SIDEBAR_NAV.map((item, i) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={i === 0}
                        tooltip={item.title}
                      >
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
            <span className="font-medium text-sm">Dashboard</span>
          </header>
          <div className="p-6 text-muted-foreground text-sm">
            Main content area. Use the trigger to toggle the sidebar.
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
