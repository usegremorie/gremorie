'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import { ChevronDown } from 'lucide-react';

export function CollapsibleOpenPreview() {
  return (
    <Collapsible defaultOpen className="w-full max-w-md">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          Show full bio
          <ChevronDown className="size-4 transition-transform data-[state=open]:rotate-180" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 rounded-md border p-4 text-sm text-muted-foreground">
        Nog is the chief engineer of the Kalvner crew. Implements code, infra,
        and ships. Backs up before destructive changes. Never commits secrets.
      </CollapsibleContent>
    </Collapsible>
  );
}
