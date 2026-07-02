'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@gremorie/rx-display';

export function AccordionMultiplePreview() {
  return (
    <Accordion
      type="multiple"
      defaultValue={['release-1', 'release-2']}
      className="w-full"
    >
      <AccordionItem value="release-1">
        <AccordionTrigger>v1.0 - Initial release</AccordionTrigger>
        <AccordionContent>57 primitives across 8 packages.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="release-2">
        <AccordionTrigger>v1.1 - AI primitives</AccordionTrigger>
        <AccordionContent>Added Message, Prompt, Response.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="release-3">
        <AccordionTrigger>v1.2 - Patterns layer</AccordionTrigger>
        <AccordionContent>
          Composed patterns: DataTable, FormBuilder.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
