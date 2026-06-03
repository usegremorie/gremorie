'use client';

import type * as PageTree from 'fumadocs-core/page-tree';
import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
} from 'fumadocs-ui/components/sidebar/base';
import { type ReactNode } from 'react';

/**
 * Sidebar folder that never auto-expands, not even for the active page's
 * category. Fumadocs' default folder forces open when active (the open state is
 * `collapsible === false || active || (defaultOpen ?? defaultOpenLevel >= depth)`).
 * This override pins `active` to false so every category always starts closed
 * and the reader expands it on demand. Mirrors the default folder render in
 * fumadocs-ui's page tree, minus the active auto-open.
 */
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
        <SidebarFolderLink
          active={false}
          external={item.index.external}
          href={item.index.url}
        >
          {item.icon}
          {item.name}
        </SidebarFolderLink>
      ) : (
        <SidebarFolderTrigger>
          {item.icon}
          {item.name}
        </SidebarFolderTrigger>
      )}
      <SidebarFolderContent>{children}</SidebarFolderContent>
    </SidebarFolder>
  );
}
