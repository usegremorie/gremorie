import { defineContract } from '../../types';

/**
 * Accordion - a vertical stack of expandable sections.
 * React: `@gremorie/rx-display` (wraps Radix Accordion).
 * Angular: `@gremorie/ng-display` (wraps spartan brain `BrnAccordion`).
 */
export const accordion = defineContract({
  name: 'accordion',
  category: 'display',
  status: 'stable',
  anatomy: `
    <accordion> (root: type, defaultValue)
    └─ accordion-item (one section, keyed by value)
       ├─ accordion-trigger (header button + rotating chevron)
       └─ accordion-content (animated collapsible body)`,
  props: [
    {
      name: 'type',
      type: "'single' | 'multiple'",
      default: 'single',
      options: ['single', 'multiple'],
      desc: 'One-open-at-a-time vs. several sections open at once.',
    },
    {
      name: 'defaultValue',
      type: 'string | string[]',
      desc: 'Initially-open item(s), keyed by item value (uncontrolled).',
    },
    {
      name: 'collapsible',
      type: 'boolean',
      default: false,
      adapts: {
        ng: 'not exposed (spartan brain drives open state per-item via isOpened)',
      },
      desc: '(single only) Allow closing the currently-open item.',
    },
    {
      name: 'value',
      type: 'string',
      required: true,
      desc: 'AccordionItem: unique key for this section. (On the root, Radix also forwards controlled value / onValueChange via spread props; Angular drives open state per-item instead.)',
    },
    {
      name: 'isOpened',
      type: 'boolean',
      default: false,
      adapts: { rx: 'expressed via root defaultValue / value instead' },
      desc: 'AccordionItem (Angular): whether this item starts opened (uncontrolled).',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      desc: 'AccordionItem: prevents toggling this section.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto the part (item adds the bottom-border divider).',
    },
  ],
  guidance: {
    summary:
      'A vertical stack of expandable sections; one or several open at a time.',
    whenToUse: [
      'FAQs, settings groups, release notes — sibling sections should stay visible while one expands.',
      'Group long content into scannable, collapsible chunks.',
    ],
    whenNotToUse: [
      {
        text: 'A single show/hide region with no siblings',
        use: 'collapsible',
      },
      {
        text: 'Swapping between mutually-exclusive panels (context fully replaced)',
        use: 'tabs',
      },
    ],
    rules: [
      "type='single' shows one section at a time; type='multiple' lets several stay open.",
      'Each AccordionItem needs a unique value; defaultValue references those values.',
      'Do not nest more than 2 levels deep.',
      'Angular diverges from Radix: open state is uncontrolled (defaultValue / item isOpened); there is no root controlled value / onValueChange.',
    ],
    example:
      '<accordion type="single" defaultValue="shipping"><accordion-item value="shipping"><accordion-trigger>How long does shipping take?</accordion-trigger><accordion-content>1-2 business days.</accordion-content></accordion-item></accordion>',
  },
  preview: {
    rx: 'layout-display-display-accordion--default',
    ng: 'display-accordion--workbench',
  },
  tag: { rx: 'Accordion', ng: 'gn-accordion' },
  example: { type: 'single', defaultValue: 'shipping' },
  figma: { nodeId: null },
});
