'use client';

import { Button } from '@gremorie/rx-forms';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@gremorie/rx-overlays';
import { MenuIcon, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

export type NavLink = { text: string; url: string; icon: LucideIcon };

/** Site navigation below lg: an icon button that opens a bottom drawer. */
export function MobileNav({
  label,
  links,
  isActive,
}: {
  label: string;
  links: NavLink[];
  isActive: (url: string) => boolean;
}) {
  return (
    <Drawer>
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger asChild>
            <Button
              aria-label={label}
              className="lg:hidden"
              size="icon-sm"
              variant="ghost"
            >
              <MenuIcon />
            </Button>
          </DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle>{label}</DrawerTitle>
        </DrawerHeader>
        <nav
          aria-label={label}
          className="grid gap-0.5 px-2 pt-2 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
        >
          {/* Each link closes the drawer: the header outlives client
              navigation, so the sheet would otherwise cover the new page. */}
          {links.map(({ text, url, icon: Icon }) => (
            <DrawerClose asChild key={url}>
              <Link
                aria-current={isActive(url) ? 'page' : undefined}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 font-medium text-sm transition-colors hover:bg-accent aria-[current=page]:bg-accent"
                href={url}
              >
                <Icon
                  aria-hidden="true"
                  className="size-4 text-muted-foreground"
                />
                {text}
              </Link>
            </DrawerClose>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
