'use client';

import { cn } from '@gremorie/rx-core';
import { Button } from '@gremorie/rx-forms';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/rx-overlays';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import {
  BlocksIcon,
  ComponentIcon,
  LibraryIcon,
  MenuIcon,
  MoonIcon,
  PaletteIcon,
  SearchIcon,
  SunIcon,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState, type ReactNode } from 'react';

import { GithubMark } from '@/components/github-mark';
import { GremorieSymbol } from '@/components/gremorie-symbol';

/**
 * Site top bar, in the Luma app's layout:
 *
 *   header (sticky, 56px)
 *   ├─ logo                     left: the symbol, home link
 *   ├─ nav                      centre: icon + label, 14px / 500 in every state
 *   └─ actions                  right: search, GitHub, theme (ghost icon
 *                               buttons, gap 0, each with a tooltip);
 *                               below md the nav moves into a menu here
 *
 * At the top of the page the bar has no surface and no border. Once the page
 * scrolls it gets the bottom border and the DS translucent treatment (60% of
 * the page background, blur 16px, saturate 1.5), opaque again for
 * data-menu="solid" or reduced transparency, as the floating surfaces.
 */

const NAV: { text: string; path: string; icon: LucideIcon }[] = [
  { text: 'Components', path: '/components', icon: ComponentIcon },
  { text: 'Blocks', path: '/blocks', icon: BlocksIcon },
  { text: 'Tokens', path: '/tokens', icon: PaletteIcon },
  { text: 'Corpus', path: '/corpus', icon: LibraryIcon },
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
  const { setOpenSearch } = useSearchContext();
  const { resolvedTheme, setTheme } = useTheme();
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
          scrolled &&
            'border-border bg-background/60 backdrop-blur-[16px] backdrop-saturate-150 [[data-menu=solid]_&]:bg-background [[data-menu=solid]_&]:backdrop-blur-none [@media(prefers-reduced-transparency:reduce)]:bg-background [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none',
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
            <IconAction label="Search">
              <Button
                aria-label="Search"
                onClick={() => setOpenSearch(true)}
                size="icon-sm"
                variant="ghost"
              >
                <SearchIcon />
              </Button>
            </IconAction>
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
            <IconAction label="Toggle theme">
              <Button
                aria-label="Toggle theme"
                onClick={() =>
                  setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
                }
                size="icon-sm"
                variant="ghost"
              >
                {/* Both glyphs render; CSS shows the right one, so server
                    and client markup match before the theme is known. */}
                <SunIcon className="dark:hidden" />
                <MoonIcon className="hidden dark:block" />
              </Button>
            </IconAction>
            <DropdownMenu>
              <IconAction label="Menu">
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label="Menu"
                    className="md:hidden"
                    size="icon-sm"
                    variant="ghost"
                  >
                    <MenuIcon />
                  </Button>
                </DropdownMenuTrigger>
              </IconAction>
              <DropdownMenuContent align="end" className="w-48">
                {links.map(({ text, url, icon: Icon }) => (
                  <DropdownMenuItem asChild key={url}>
                    <Link href={url}>
                      <Icon aria-hidden="true" />
                      {text}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
