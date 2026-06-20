'use client';

import { Toggle } from '@gremorie/rx-forms';
import { Italic } from 'lucide-react';

export function ToggleDisabledPreview() {
  return (
    <Toggle aria-label="Italic" disabled defaultPressed>
      <Italic />
    </Toggle>
  );
}
