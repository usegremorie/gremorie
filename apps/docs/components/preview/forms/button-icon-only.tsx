'use client';

import { Button } from '@gremorie/rx-forms';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/rx-overlays';
import { Trash2 } from 'lucide-react';

const SIZES = ['icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const;

export function ButtonIconOnlyPreview() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-3">
        {SIZES.map((size) => (
          <Tooltip key={size}>
            <TooltipTrigger asChild>
              <Button size={size} variant="ghost" aria-label="Delete row">
                <Trash2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete row</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
