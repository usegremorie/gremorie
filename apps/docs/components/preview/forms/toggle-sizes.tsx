'use client';

import { Toggle } from '@gremorie/rx-forms';
import { Bold } from 'lucide-react';

export function ToggleSizesPreview() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Toggle aria-label="Bold" size="sm">
        <Bold />
      </Toggle>
      <Toggle aria-label="Bold" size="default">
        <Bold />
      </Toggle>
      <Toggle aria-label="Bold" size="lg">
        <Bold />
      </Toggle>
    </div>
  );
}
