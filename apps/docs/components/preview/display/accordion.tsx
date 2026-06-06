'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@gremorie/rx-display';

export function AccordionPreview() {
  return (
    <Accordion type="single" collapsible defaultValue="reg" className="w-full">
      <AccordionItem value="reg">
        <AccordionTrigger>What is the registry?</AccordionTrigger>
        <AccordionContent>
          The registry is the single source of truth for Gremorie primitives.
          Each item lists its files, dependencies, and peers so an agent can
          install it deterministically.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="mcp">
        <AccordionTrigger>What does the MCP server do?</AccordionTrigger>
        <AccordionContent>
          It exposes the registry as MCP tools so any compatible client can
          search, read, and apply Gremorie items.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="rx">
        <AccordionTrigger>What is rx-?</AccordionTrigger>
        <AccordionContent>
          rx- is the React edition prefix. ng- is the Angular edition prefix.
          Both ship side by side.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
