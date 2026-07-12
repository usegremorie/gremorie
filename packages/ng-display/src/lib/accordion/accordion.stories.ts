import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion';

/**
 * Accordion — vertical stack of expandable sections.
 *
 * Mirrors React `Accordion`. Behavior delegated to spartan brain
 * `BrnAccordion`. `type="single"` opens one at a time; `type="multiple"`
 * allows several open together.
 */
const meta: Meta<Accordion> = {
  title: 'Layout & display/Display/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [Accordion, AccordionItem, AccordionTrigger, AccordionContent],
    }),
  ],
  argTypes: {
    type: { control: 'inline-radio', options: ['single', 'multiple'] },
  },
};

export default meta;
type Story = StoryObj<Accordion>;

const FAQ = `
  <gr-accordion-item value="shipping">
    <gr-accordion-trigger>How long does shipping take?</gr-accordion-trigger>
    <gr-accordion-content class="text-muted-foreground">
      Orders ship within 1–2 business days and arrive in 3–5 days domestically.
    </gr-accordion-content>
  </gr-accordion-item>
  <gr-accordion-item value="returns">
    <gr-accordion-trigger>What is your return policy?</gr-accordion-trigger>
    <gr-accordion-content class="text-muted-foreground">
      Returns are accepted within 30 days of delivery, no questions asked.
    </gr-accordion-content>
  </gr-accordion-item>
  <gr-accordion-item value="support">
    <gr-accordion-trigger>How do I contact support?</gr-accordion-trigger>
    <gr-accordion-content class="text-muted-foreground">
      Email support&#64;example.com or use the in-app chat — we reply within a day.
    </gr-accordion-content>
  </gr-accordion-item>
`;

/** Workbench — single open at a time, first item open by default. */
export const Workbench: Story = {
  args: { type: 'single' },
  render: (args) => ({
    props: args,
    template: `
      <gr-accordion [type]="type" defaultValue="shipping" class="block w-96">
        ${FAQ}
      </gr-accordion>
    `,
  }),
};

/** Single — one section open at a time (FAQ, settings groups). */
export const Single: Story = {
  render: () => ({
    template: `
      <gr-accordion type="single" defaultValue="shipping" class="block w-96">
        ${FAQ}
      </gr-accordion>
    `,
  }),
};

/** Multiple — any number of sections can stay open together. */
export const Multiple: Story = {
  render: () => ({
    template: `
      <gr-accordion type="multiple" [defaultValue]="['shipping','returns']" class="block w-96">
        ${FAQ}
      </gr-accordion>
    `,
  }),
};
