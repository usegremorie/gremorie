'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@gremorie/rx-display';

export function AccordionDisabledPreview() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="account">
        <AccordionTrigger>Account</AccordionTrigger>
        <AccordionContent>
          Update your profile, email, and password.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="billing" disabled>
        <AccordionTrigger>Billing (upgrade required)</AccordionTrigger>
        <AccordionContent>
          Billing settings are available on paid plans.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="notifications">
        <AccordionTrigger>Notifications</AccordionTrigger>
        <AccordionContent>
          Choose which events send you an email.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
