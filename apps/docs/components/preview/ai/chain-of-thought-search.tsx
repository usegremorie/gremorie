'use client';

import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
} from '@gremorie/rx-ai';
import { FileSearch, Search } from 'lucide-react';

export function ChainOfThoughtSearchPreview() {
  return (
    <ChainOfThought defaultOpen>
      <ChainOfThoughtHeader>Searching the registry</ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        <ChainOfThoughtStep
          icon={Search}
          label="Querying for 'rx-tool'"
          status="complete"
        />
        <ChainOfThoughtStep
          icon={FileSearch}
          label="Found 4 candidate entries"
          status="complete"
        />
      </ChainOfThoughtContent>
    </ChainOfThought>
  );
}
