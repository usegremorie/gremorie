'use client';

import { Button } from '@gremorie/rx-forms';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@gremorie/rx-overlays';

export function DropdownMenuPreview() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Open in chat</DropdownMenuItem>
        <DropdownMenuItem>Copy URL</DropdownMenuItem>
        <DropdownMenuItem>Export</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
