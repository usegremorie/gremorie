'use client';

import {
  Plan,
  PlanContent,
  PlanDescription,
  PlanHeader,
  PlanTitle,
} from '@gremorie/rx-ai';

export function PlanExpandedPreview() {
  return (
    <Plan defaultOpen>
      <PlanHeader>
        <PlanTitle>Generate landing page</PlanTitle>
        <PlanDescription>3 steps - 12s estimated</PlanDescription>
      </PlanHeader>
      <PlanContent>
        Hero, features, CTA section composed from rx-display and rx-forms.
      </PlanContent>
    </Plan>
  );
}
