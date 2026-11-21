import { Card } from '@gremorie/rx-display';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from '@gremorie/rx-navigation';
import {
  ActivityIcon,
  BellIcon,
  BookOpenIcon,
  CircleHelpIcon,
  CreditCardIcon,
  MessageSquareIcon,
  PaintbrushIcon,
  ShieldIcon,
  UserIcon,
  type LucideIcon,
} from 'lucide-react';

// The settings navigation of a personal-finance app, shown as a card. The
// Status entry carries a live service mark, which takes the success slot of
// the data-viz palette.
type Entry = {
  title: string;
  icon: LucideIcon;
  active?: boolean;
  badge?: string;
  operational?: boolean;
};

const GROUPS: { label: string; items: Entry[] }[] = [
  {
    label: 'Account',
    items: [
      { title: 'Profile', icon: UserIcon },
      { title: 'Billing', icon: CreditCardIcon, active: true },
      { title: 'Notifications', icon: BellIcon, badge: '3' },
      { title: 'Security', icon: ShieldIcon },
      { title: 'Appearance', icon: PaintbrushIcon },
    ],
  },
  {
    label: 'Support',
    items: [
      { title: 'Help Center', icon: CircleHelpIcon },
      { title: 'Contact Us', icon: MessageSquareIcon },
      { title: 'Documentation', icon: BookOpenIcon },
      { title: 'Status', icon: ActivityIcon, operational: true },
    ],
  },
];

/** Showcase card: account settings and support links, grouped. */
export function AccountMenu() {
  return (
    <Card>
      <SidebarProvider className="min-h-0">
        <SidebarContent>
          {GROUPS.map((group, i) => (
            <div className="contents" key={group.label}>
              {/* SidebarSeparator keeps the Separator's w-full next to its
                  mx-2, so it overflows by 16px; w-auto restores the inset
                  (the Angular separator is already w-auto). */}
              {i > 0 && (
                <SidebarSeparator className="data-[orientation=horizontal]:w-auto" />
              )}
              <SidebarGroup>
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={item.active}>
                        <a
                          aria-current={item.active ? 'page' : undefined}
                          href={`#${item.title.toLowerCase().replace(/ /g, '-')}`}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                      {item.badge && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                      {item.operational && (
                        <SidebarMenuBadge>
                          <span
                            aria-hidden="true"
                            className="size-2 rounded-full"
                            style={{
                              backgroundColor: 'var(--chart-status-success)',
                            }}
                          />
                          <span className="sr-only">
                            All systems operational
                          </span>
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </div>
          ))}
        </SidebarContent>
      </SidebarProvider>
    </Card>
  );
}
