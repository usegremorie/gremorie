'use client';

import { Button } from '@gremorie/rx-forms';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/rx-overlays';
import {
  CornerDownLeftIcon,
  GlobeIcon,
  MicIcon,
  PaperclipIcon,
  type LucideIcon,
} from 'lucide-react';

const TOOLS: { label: string; icon: LucideIcon }[] = [
  { label: 'Search the web', icon: GlobeIcon },
  { label: 'Attach files', icon: PaperclipIcon },
  { label: 'Voice input', icon: MicIcon },
];

export function ButtonIconGroupPreview() {
  return (
    <TooltipProvider>
      {/* The group and the next control: gap-2. Inside the group: no gap. */}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {TOOLS.map(({ label, icon: Icon }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <Button aria-label={label} size="icon-sm" variant="ghost">
                  <Icon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
        <Button className="gap-2 pr-2.5 pl-3" size="sm">
          Chat
          <CornerDownLeftIcon />
        </Button>
      </div>
    </TooltipProvider>
  );
}
