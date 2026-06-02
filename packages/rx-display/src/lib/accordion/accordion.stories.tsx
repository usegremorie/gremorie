import type { Meta, StoryObj } from '@storybook/react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion';

/**
 * # Accordion
 *
 * A vertical stack of expandable sections, wrapping Radix Accordion. Use
 * `type="single"` for one-open-at-a-time (FAQ, settings groups) and
 * `type="multiple"` when several sections may stay open at once (release notes,
 * feature breakdowns). Prefer it over Tabs when sibling sections should remain
 * visible.
 *
 * ## Anatomy
 *
 * - **Accordion** — the Radix `Root`; carries `type` + `collapsible`.
 * - **AccordionItem** — one section, identified by `value`.
 * - **AccordionTrigger** — the clickable header (renders the chevron).
 * - **AccordionContent** — the collapsible body (animated open/close).
 *
 * ## Props
 *
 * The root forwards Radix `Accordion.Root` props:
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `type` | `"single" \| "multiple"` | — | One vs. many open sections. |
 * | `collapsible` | `boolean` | `false` | (single only) allow closing the open item. |
 * | `defaultValue` | `string \| string[]` | — | Initially-open item(s). |
 * | `value` / `onValueChange` | — | — | Controlled open state. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `AccordionItem` | A section keyed by `value`. |
 * | `AccordionTrigger` | Header button + rotating chevron. |
 * | `AccordionContent` | Animated collapsible panel. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--border` | the `last:border-b-0` item dividers |
 * | `--ring` | focus-visible ring on the trigger |
 * | `--muted-foreground` | chevron icon color |
 */
const meta = {
  title: 'Layout & display/Display/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    type: { control: 'inline-radio', options: ['single', 'multiple'] },
    collapsible: { control: 'boolean' },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS = [
  {
    value: 'shipping',
    q: 'How long does shipping take?',
    a: 'Orders ship within 1–2 business days and arrive in 3–5 days domestically.',
  },
  {
    value: 'returns',
    q: 'What is your return policy?',
    a: 'Returns are accepted within 30 days of delivery, no questions asked.',
  },
  {
    value: 'support',
    q: 'How do I contact support?',
    a: 'Email support@example.com or use the in-app chat — we reply within a day.',
  },
];

/** Single open at a time, collapsible — a 3-item FAQ. */
export const Default: Story = {
  render: () => (
    <Accordion
      type="single"
      collapsible
      defaultValue="shipping"
      className="w-96"
    >
      {ITEMS.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/** `type="multiple"` — any number of sections can stay open together. */
export const Multiple: Story = {
  render: () => (
    <Accordion
      type="multiple"
      defaultValue={['shipping', 'returns']}
      className="w-96"
    >
      {ITEMS.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};
