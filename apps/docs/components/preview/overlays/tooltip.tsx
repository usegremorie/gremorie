'use client';

import { Button } from '@gremorie/rx-forms';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/rx-overlays';

export function TooltipPreview() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Adds an item to the registry</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
