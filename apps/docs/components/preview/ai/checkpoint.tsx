'use client';

import { Checkpoint, CheckpointTrigger } from '@gremorie/rx-ai';
import { TooltipProvider } from '@gremorie/rx-overlays';
import { GitBranch } from 'lucide-react';

export function CheckpointPreview() {
  return (
    <TooltipProvider>
      <Checkpoint className="my-4">
        <CheckpointTrigger tooltip="Branch from here">
          <GitBranch className="size-4" />
        </CheckpointTrigger>
      </Checkpoint>
    </TooltipProvider>
  );
}
