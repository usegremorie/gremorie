'use client';

import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorTrigger,
} from '@gremorie/rx-ai';
import { Button } from '@gremorie/rx-forms';

export function ModelSelectorPreview() {
  return (
    <ModelSelector>
      <ModelSelectorTrigger asChild>
        <Button variant="outline">Select model</Button>
      </ModelSelectorTrigger>
      <ModelSelectorContent>
        <div className="p-4 text-sm">
          <p className="font-medium">Pick a model</p>
          <p className="mt-1 text-muted-foreground">
            Models would be listed here.
          </p>
        </div>
      </ModelSelectorContent>
    </ModelSelector>
  );
}
