'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function CollapsiblePreview() {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-md">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          What&apos;s inside Gremorie?
          <ChevronDown
            className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 rounded-md border p-4 text-sm">
        100 primitives across 9 React packages and 4 Angular packages, plus the
        token engine, registry, and MCP handler.
      </CollapsibleContent>
    </Collapsible>
  );
}
