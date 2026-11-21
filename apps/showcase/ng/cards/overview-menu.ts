import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeftRight,
  lucideChartPie,
  lucideFileChartColumn,
  lucideFileText,
  lucideLandmark,
  lucideLayoutGrid,
  lucidePiggyBank,
  lucideTarget,
  lucideTrendingUp,
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
};

// The main navigation of a personal-finance app, shown as a card. The
// badge counts transactions still waiting for a category.
const GROUPS: { label: string; items: Entry[] }[] = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', icon: 'lucideLayoutGrid', active: true },
      { title: 'Transactions', icon: 'lucideArrowLeftRight', badge: '12' },
      { title: 'Investments', icon: 'lucideTrendingUp' },
      { title: 'Accounts', icon: 'lucideLandmark' },
      { title: 'Spending', icon: 'lucideChartPie' },
    ],
  },
  {
    label: 'Planning',
    items: [
      { title: 'Goals', icon: 'lucideTarget' },
      { title: 'Budget', icon: 'lucidePiggyBank' },
      { title: 'Reports', icon: 'lucideFileChartColumn' },
      { title: 'Documents', icon: 'lucideFileText' },
    ],
  },
];

/** Showcase card: the app's section navigation, grouped. */
@Component({
  selector: 'showcase-overview-menu',
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
      lucideArrowLeftRight,
      lucideChartPie,
      lucideFileChartColumn,
      lucideFileText,
      lucideLandmark,
      lucideLayoutGrid,
      lucidePiggyBank,
      lucideTarget,
      lucideTrendingUp,
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
                </li>
              }
            </ul>
          </gr-sidebar-group>
        }
      </gr-sidebar-content>
    </gr-card>
  `,
})
export class OverviewMenu {
  protected readonly groups = GROUPS.map((g) => ({
    label: g.label,
    items: g.items.map((i) => ({
      ...i,
      href: `#${i.title.toLowerCase().replace(/ /g, '-')}`,
    })),
  }));
}
