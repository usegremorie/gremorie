'use client';

import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
} from '@gremorie/rx-ai';
import { CheckCircle2, FileSearch, Search } from 'lucide-react';

export function ChainOfThoughtPreview() {
  return (
    <ChainOfThought defaultOpen>
      <ChainOfThoughtHeader>Researching the answer</ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        <ChainOfThoughtStep
          icon={Search}
          label="Searching docs"
          status="complete"
        />
        <ChainOfThoughtStep
          icon={FileSearch}
          label="Reading 3 registry entries"
          status="complete"
        />
        <ChainOfThoughtStep
          icon={CheckCircle2}
          label="Drafting response"
          status="active"
        />
      </ChainOfThoughtContent>
    </ChainOfThought>
  );
}
