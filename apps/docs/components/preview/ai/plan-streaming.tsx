'use client';

import {
  Plan,
  PlanContent,
  PlanDescription,
  PlanHeader,
  PlanTitle,
} from '@gremorie/rx-ai';

export function PlanStreamingPreview() {
  return (
    <Plan defaultOpen isStreaming>
      <PlanHeader>
        <PlanTitle>Composing the layout</PlanTitle>
        <PlanDescription>Streaming response from the model...</PlanDescription>
      </PlanHeader>
      <PlanContent>
        Resolving primitives required for this composition.
      </PlanContent>
    </Plan>
  );
}
