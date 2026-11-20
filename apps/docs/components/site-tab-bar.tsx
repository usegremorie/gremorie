'use client';

import { TabBar, TabBarItem } from '@gremorie/rx-navigation';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import {
  BookOpenIcon,
  ComponentIcon,
  HouseIcon,
  LayoutDashboardIcon,
  SearchIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * The site's navigation on phones: a floating icon-only TabBar docked to the
 * bottom (hidden from md up, where the top bar carries the links). Search
 * opens the same dialog as the top bar's search field.
 */
const LINKS = [
  { value: 'home', label: 'Home', path: '', icon: HouseIcon },
  { value: 'docs', label: 'Docs', path: '/get-started', icon: BookOpenIcon },
  {
    value: 'components',
    label: 'Components',
    path: '/components',
    icon: ComponentIcon,
  },
  {
    value: 'showcase',
    label: 'Showcase',
    path: '/showcase',
    icon: LayoutDashboardIcon,
  },
];

export function SiteTabBar({ lang }: { lang: string }) {
  const pathname = usePathname();
  const { setOpenSearch } = useSearchContext();

  const current = LINKS.slice()
    .reverse()
    .find(({ path }) => {
      const url = `/${lang}${path}`;
      return path === '' ? pathname === url : pathname.startsWith(url);
    })?.value;

  return (
    <TabBar
      className="md:hidden"
      hideOnScroll
      value={current ?? ''}
      variant="floating"
    >
      {LINKS.map(({ value, label, path, icon }) => (
        <TabBarItem asChild icon={icon} key={value} label={label} value={value}>
          <Link href={`/${lang}${path}`} />
        </TabBarItem>
      ))}
      <TabBarItem
        icon={SearchIcon}
        label="Search"
        onClick={() => setOpenSearch(true)}
        value="search"
      />
    </TabBar>
  );
}
