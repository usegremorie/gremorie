'use client';

import type * as PageTree from 'fumadocs-core/page-tree';
import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  useFolder,
  useFolderDepth,
} from 'fumadocs-ui/components/sidebar/base';
import { type ReactNode } from 'react';

/**
 * Sidebar folder that never auto-expands, not even for the active page's
 * category. Fumadocs' default folder forces open when active (the open state is
 * `collapsible === false || active || (defaultOpen ?? defaultOpenLevel >= depth)`).
 * Pinning `active` to false makes every category start closed; the reader
 * expands it on demand.
 *
 * The default Folder lives inside the docs layout slot (not exported), so it is
 * replicated here. The styling mirrors fumadocs-ui's styled sidebar
 * (dist/layouts/docs/slots/sidebar.js): the bare headless trigger/link/content
 * from `.../sidebar/base` carry no layout classes, so the `itemVariants` flex
 * base, the depth-based inline offset, and the folder guide line are reapplied.
 * Without them the chevron and icons stack vertically instead of sitting inline.
 */
const cn = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ');

// Mirrors getItemOffset() from the styled docs sidebar slot.
const itemOffset = (depth: number) => `calc(${2 + 3 * depth} * var(--spacing))`;

// Mirrors the itemVariants cva (base + the link/button variants).
const ITEM_BASE =
  'relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0';
const VARIANT_LINK =
  'transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary data-[active=true]:hover:transition-colors';
const VARIANT_BUTTON =
  'transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none';

function StyledTrigger({ children }: { children: ReactNode }) {
  const { depth, collapsible } = useFolder();
  return (
    <SidebarFolderTrigger
      className={cn(ITEM_BASE, collapsible && VARIANT_BUTTON, 'w-full')}
      style={{ paddingInlineStart: itemOffset(depth - 1) }}
    >
      {children}
    </SidebarFolderTrigger>
  );
}

function StyledLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) {
  const depth = useFolderDepth();
  return (
    <SidebarFolderLink
      active={false}
      external={external}
      href={href}
      className={cn(ITEM_BASE, VARIANT_LINK, 'w-full')}
      style={{ paddingInlineStart: itemOffset(depth - 1) }}
    >
      {children}
    </SidebarFolderLink>
  );
}

function StyledContent({ children }: { children: ReactNode }) {
  const depth = useFolderDepth();
  return (
    <SidebarFolderContent
      className={cn(
        'relative',
        depth === 1 &&
          "before:content-[''] before:absolute before:w-px before:inset-y-1 before:bg-fd-border before:inset-s-2.5",
      )}
    >
      <div className="flex flex-col gap-0.5 pt-0.5">{children}</div>
    </SidebarFolderContent>
  );
}

export function ClosedFolder({
  item,
  children,
}: {
  item: PageTree.Folder;
  children: ReactNode;
}) {
  return (
    <SidebarFolder
      active={false}
      collapsible={item.collapsible}
      defaultOpen={item.defaultOpen}
    >
      {item.index ? (
        <StyledLink href={item.index.url} external={item.index.external}>
          {item.icon}
          {item.name}
        </StyledLink>
      ) : (
        <StyledTrigger>
          {item.icon}
          {item.name}
        </StyledTrigger>
      )}
      <StyledContent>{children}</StyledContent>
    </SidebarFolder>
  );
}
