'use client';

import { ToggleGroup, ToggleGroupItem } from '@gremorie/rx-forms';
import { Bold, Italic, Underline } from 'lucide-react';

export function ToggleGroupPreview() {
  return (
    <ToggleGroup type="single" defaultValue="bold">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
