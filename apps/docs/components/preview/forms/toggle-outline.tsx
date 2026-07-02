'use client';

import { Toggle } from '@gremorie/rx-forms';
import { Underline } from 'lucide-react';

export function ToggleOutlinePreview() {
  return (
    <Toggle aria-label="Underline" variant="outline">
      <Underline />
    </Toggle>
  );
}
