'use client';

import { Toggle } from '@gremorie/rx-forms';
import { Bold, Italic, Underline } from 'lucide-react';

export function TogglePreview() {
  return (
    <div className="flex gap-2">
      <Toggle aria-label="Bold">
        <Bold className="size-4" />
      </Toggle>
      <Toggle aria-label="Italic" defaultPressed>
        <Italic className="size-4" />
      </Toggle>
      <Toggle aria-label="Underline">
        <Underline className="size-4" />
      </Toggle>
    </div>
  );
}
