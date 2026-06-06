'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@gremorie/rx-overlays';

export function ContextMenuPreview() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
          Right-click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Paste</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
