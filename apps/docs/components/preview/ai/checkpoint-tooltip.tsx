'use client';

import { Checkpoint, CheckpointTrigger } from '@gremorie/rx-ai';
import { TooltipProvider } from '@gremorie/rx-overlays';
import { GitBranch } from 'lucide-react';

export function CheckpointTooltipPreview() {
  return (
    <TooltipProvider>
      <Checkpoint className="my-4">
        <CheckpointTrigger tooltip="Restore this state">
          <GitBranch className="size-4" />
          Checkpoint
        </CheckpointTrigger>
      </Checkpoint>
    </TooltipProvider>
  );
}
