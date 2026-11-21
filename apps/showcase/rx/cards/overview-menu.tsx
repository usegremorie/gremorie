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
  ArrowLeftRightIcon,
  ChartPieIcon,
  FileChartColumnIcon,
  FileTextIcon,
  LandmarkIcon,
  LayoutGridIcon,
  PiggyBankIcon,
  TargetIcon,
  TrendingUpIcon,
  type LucideIcon,
} from 'lucide-react';

// The main navigation of a personal-finance app, shown as a card. The
// badge counts transactions still waiting for a category.
type Entry = {
  title: string;
  icon: LucideIcon;
  active?: boolean;
  badge?: string;
};

const GROUPS: { label: string; items: Entry[] }[] = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', icon: LayoutGridIcon, active: true },
      { title: 'Transactions', icon: ArrowLeftRightIcon, badge: '12' },
      { title: 'Investments', icon: TrendingUpIcon },
      { title: 'Accounts', icon: LandmarkIcon },
      { title: 'Spending', icon: ChartPieIcon },
    ],
  },
  {
    label: 'Planning',
    items: [
      { title: 'Goals', icon: TargetIcon },
      { title: 'Budget', icon: PiggyBankIcon },
      { title: 'Reports', icon: FileChartColumnIcon },
      { title: 'Documents', icon: FileTextIcon },
    ],
  },
];

/** Showcase card: the app's section navigation, grouped. */
export function OverviewMenu() {
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
