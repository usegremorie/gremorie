'use client';

import { Button } from '@gremorie/rx-forms';
import { Popover, PopoverContent, PopoverTrigger } from '@gremorie/rx-overlays';

export function PopoverPreview() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-medium">Quick settings</h4>
          <p className="text-xs text-muted-foreground">
            Toggle preferences for this session.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
