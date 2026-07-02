'use client';

import { Button } from '@gremorie/rx-forms';
import { Trash2 } from 'lucide-react';

export function ButtonIconOnlyPreview() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="icon-xs" variant="ghost" aria-label="Delete row">
        <Trash2 />
      </Button>
      <Button size="icon-sm" variant="ghost" aria-label="Delete row">
        <Trash2 />
      </Button>
      <Button size="icon" variant="ghost" aria-label="Delete row">
        <Trash2 />
      </Button>
      <Button size="icon-lg" variant="ghost" aria-label="Delete row">
        <Trash2 />
      </Button>
    </div>
  );
}
