'use client';

import { ToggleGroup, ToggleGroupItem } from '@gremorie/rx-forms';
import { Bold, Italic, Underline } from 'lucide-react';

export function ToggleGroupMultiplePreview() {
  return (
    <ToggleGroup type="multiple" defaultValue={['bold']}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
