"use client";

import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import * as React from "react";

/**
 * Collapsible - single-section expandable region.
 *
 * Imported from shadcn/ui (MIT). The minimal building block for
 * any "show more" toggle. Three parts: `Collapsible` (Root),
 * `CollapsibleTrigger`, `CollapsibleContent`.
 *
 * Use Collapsible when you have **one** thing that expands -
 * a card's "more details" toggle, a sidebar group's expand /
 * collapse, an inline disclosure inside long copy. When you have
 * multiple coordinated sections, use Accordion instead (Accordion
 * is built on top of this primitive).
 */
function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
