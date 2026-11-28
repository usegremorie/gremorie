'use client';

import { cn } from '@gremorie/rx-core';
import { Button } from '@gremorie/rx-forms';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/rx-overlays';
import {
  FullSearchTrigger,
  SearchTrigger,
} from 'fumadocs-ui/layouts/shared/slots/search-trigger';
import {
  BlocksIcon,
  ComponentIcon,
  LayoutDashboardIcon,
  LibraryIcon,
  MenuIcon,
  PaletteIcon,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import { AppearanceControls } from '@/components/appearance/appearance-controls';
import { copyFor } from '@/components/appearance/copy';
import { GithubMark } from '@/components/github-mark';
import { GremorieSymbol } from '@/components/gremorie-symbol';

/**
 * Site top bar:
 *
 *   header (sticky, 56px)
 *   ├─ logo                     left: the symbol, home link
 *   ├─ nav                      centre: icon + label, 14px / 500 in every state
 *   └─ actions                  right: Fumadocs' search field, GitHub and
 *                               the appearance controls (accent, translucency,
 *                               tonal, theme) as DS ghost icon buttons; below
 *                               md the search is an icon and the nav moves
 *                               into a bottom drawer here
 *
 * At the top of the page the bar has no surface and no border. Once the page
 * scrolls it gets the bottom border and the DS translucent treatment (60% of
 * the page background, blur 16px, saturate 1.5), opaque again for
 * data-translucency="solid" or reduced transparency, as the floating surfaces.
 */

const NAV: { text: string; path: string; icon: LucideIcon }[] = [
  { text: 'Components', path: '/components', icon: ComponentIcon },
  { text: 'Blocks', path: '/blocks', icon: BlocksIcon },
  { text: 'Tokens', path: '/tokens', icon: PaletteIcon },
  { text: 'Corpus', path: '/corpus', icon: LibraryIcon },
  { text: 'Showcase', path: '/showcase', icon: LayoutDashboardIcon },
];

function IconAction({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function SiteHeader({ lang }: { lang: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 0);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const links = NAV.map((item) => ({
    ...item,
    url: `/${lang}${item.path}`,
  }));
  const isActive = (url: string) =>
    pathname === url || pathname.startsWith(`${url}/`);

  return (
    <TooltipProvider>
      <header
        className={cn(
          'sticky top-0 z-40 h-14 border-b border-transparent transition-[background-color,border-color] duration-200',
          scrolled && 'border-border bg-background-surface',
        )}
        data-scrolled={scrolled || undefined}
        data-slot="site-header"
      >
        <div className="relative flex h-full items-center px-6">
          <Link
            className="inline-flex items-center rounded-md text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            data-slot="site-header-logo"
            href={`/${lang}`}
          >
            <GremorieSymbol className="size-6" />
            <span className="sr-only">Gremorie</span>
          </Link>

          <nav
            aria-label="Main"
            className="-translate-x-1/2 absolute left-1/2 flex items-center gap-1 max-md:hidden"
            data-slot="site-header-nav"
          >
            {links.map(({ text, url, icon: Icon }) => (
              <Link
                aria-current={isActive(url) ? 'page' : undefined}
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-[current=page]:text-foreground"
                href={url}
                key={url}
              >
                <Icon aria-hidden="true" className="size-4" />
                {text}
              </Link>
            ))}
          </nav>

          <div
            className="ml-auto flex items-center"
            data-slot="site-header-actions"
          >
            {/* Search is Fumadocs' own control, the same as on the docs
                pages: the search field (with its shortcut) from md up, the
                icon trigger below it. */}
            <FullSearchTrigger
              className="mr-2 w-56 rounded-full ps-2.5 max-md:hidden"
              hideIfDisabled
            />
            <SearchTrigger className="p-2 md:hidden" hideIfDisabled />
            <IconAction label="GitHub">
              <Button asChild size="icon-sm" variant="ghost">
                <a
                  aria-label="GitHub"
                  href="https://github.com/usegremorie/gremorie"
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  <GithubMark aria-hidden="true" className="size-4" />
                </a>
              </Button>
            </IconAction>
            <AppearanceControls lang={lang} />
            <Drawer>
              <IconAction label={copyFor(lang).menu}>
                <DrawerTrigger asChild>
                  <Button
                    aria-label={copyFor(lang).menu}
                    className="md:hidden"
                    size="icon-sm"
                    variant="ghost"
                  >
                    <MenuIcon />
                  </Button>
                </DrawerTrigger>
              </IconAction>
              <DrawerContent>
                <DrawerHeader className="sr-only">
                  <DrawerTitle>{copyFor(lang).menu}</DrawerTitle>
                </DrawerHeader>
                <nav
                  aria-label="Main"
                  className="grid gap-0.5 px-2 pt-2 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
                >
                  {links.map(({ text, url, icon: Icon }) => (
                    <Link
                      aria-current={isActive(url) ? 'page' : undefined}
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 font-medium text-sm transition-colors hover:bg-accent aria-[current=page]:bg-accent"
                      href={url}
                      key={url}
                    >
                      <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
                      {text}
                    </Link>
                  ))}
                </nav>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
