'use client';

import { Button } from '@gremorie/rx-forms';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/rx-overlays';

const sides = ['top', 'right', 'bottom', 'left'] as const;

export function TooltipSidesPreview() {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-wrap gap-2">
        {sides.map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger asChild>
              <Button variant="outline" className="capitalize">
                {side}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={side}>Tooltip on the {side}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
