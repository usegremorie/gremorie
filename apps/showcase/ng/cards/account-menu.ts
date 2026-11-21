import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideActivity,
  lucideBell,
  lucideBookOpen,
  lucideCircleHelp,
  lucideCreditCard,
  lucideMessageSquare,
  lucidePaintbrush,
  lucideShield,
  lucideUser,
} from '@ng-icons/lucide';
import { Card } from '@gremorie/ng-display';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarService,
} from '@gremorie/ng-navigation';

type Entry = {
  title: string;
  icon: string;
  active?: boolean;
  badge?: string;
  operational?: boolean;
};

// The settings navigation of a personal-finance app, shown as a card. The
// Status entry carries a live service mark, which takes the success slot of
// the data-viz palette.
const GROUPS: { label: string; items: Entry[] }[] = [
  {
    label: 'Account',
    items: [
      { title: 'Profile', icon: 'lucideUser' },
      { title: 'Billing', icon: 'lucideCreditCard', active: true },
      { title: 'Notifications', icon: 'lucideBell', badge: '3' },
      { title: 'Security', icon: 'lucideShield' },
      { title: 'Appearance', icon: 'lucidePaintbrush' },
    ],
  },
  {
    label: 'Support',
    items: [
      { title: 'Help Center', icon: 'lucideCircleHelp' },
      { title: 'Contact Us', icon: 'lucideMessageSquare' },
      { title: 'Documentation', icon: 'lucideBookOpen' },
      { title: 'Status', icon: 'lucideActivity', operational: true },
    ],
  },
];

/** Showcase card: account settings and support links, grouped. */
@Component({
  selector: 'showcase-account-menu',
  standalone: true,
  imports: [
    Card,
    NgIcon,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
  ],
  // The menu buttons read the sidebar state (for collapsed tooltips); the
  // service stands in for gr-sidebar-provider, whose wrapper is full-height.
  providers: [
    SidebarService,
    provideIcons({
      lucideActivity,
      lucideBell,
      lucideBookOpen,
      lucideCircleHelp,
      lucideCreditCard,
      lucideMessageSquare,
      lucidePaintbrush,
      lucideShield,
      lucideUser,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-sidebar-content>
        @for (group of groups; track group.label; let first = $first) {
          @if (!first) {
            <gr-sidebar-separator />
          }
          <gr-sidebar-group>
            <gr-sidebar-group-label>{{ group.label }}</gr-sidebar-group-label>
            <ul gr-sidebar-menu>
              @for (item of group.items; track item.title) {
                <li gr-sidebar-menu-item>
                  <a
                    gr-sidebar-menu-button
                    [isActive]="!!item.active"
                    [attr.aria-current]="item.active ? 'page' : null"
                    [href]="item.href"
                  >
                    <ng-icon [name]="item.icon" size="16" aria-hidden="true" />
                    <span>{{ item.title }}</span>
                  </a>
                  @if (item.badge) {
                    <gr-sidebar-menu-badge>{{
                      item.badge
                    }}</gr-sidebar-menu-badge>
                  }
                  @if (item.operational) {
                    <gr-sidebar-menu-badge>
                      <span
                        aria-hidden="true"
                        class="size-2 rounded-full"
                        style="background-color: var(--chart-status-success)"
                      ></span>
                      <span class="sr-only">All systems operational</span>
                    </gr-sidebar-menu-badge>
                  }
                </li>
              }
            </ul>
          </gr-sidebar-group>
        }
      </gr-sidebar-content>
    </gr-card>
  `,
})
export class AccountMenu {
  protected readonly groups = GROUPS.map((g) => ({
    label: g.label,
    items: g.items.map((i) => ({
      ...i,
      href: `#${i.title.toLowerCase().replace(/ /g, '-')}`,
    })),
  }));
}
