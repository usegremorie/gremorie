'use client';

import { ToggleGroup, ToggleGroupItem } from '@gremorie/rx-forms';
import { LayoutGrid, List, Rows3 } from 'lucide-react';

export function ToggleGroupOutlinePreview() {
  return (
    <ToggleGroup
      type="single"
      defaultValue="grid"
      variant="outline"
      spacing={1}
    >
      <ToggleGroupItem value="list" aria-label="List view">
        <List />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <LayoutGrid />
      </ToggleGroupItem>
      <ToggleGroupItem value="board" aria-label="Board view">
        <Rows3 />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
