import { defineContract } from '../../types';

/**
 * Collapsible - a single-section expandable region.
 * React: `@gremorie/rx-display` (wraps Radix Collapsible).
 * Angular: `@gremorie/ng-display` (wraps spartan brain `BrnCollapsible`).
 */
export const collapsible = defineContract({
  name: 'collapsible',
  category: 'display',
  status: 'stable',
  anatomy: `
    <collapsible> (root: open / defaultOpen / disabled)
    ├─ collapsible-trigger (the toggle button)
    └─ collapsible-content (region revealed when open)`,
  props: [
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: false,
      desc: 'Initial open state (uncontrolled).',
    },
    {
      name: 'open',
      type: 'boolean',
      default: false,
      adapts: { ng: 'two-way model: [(open)]' },
      desc: 'Controlled open state.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      adapts: { ng: 'output via the open two-way model' },
      desc: 'Fires when the open state changes.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      desc: 'Prevents toggling.',
    },
  ],
  guidance: {
    summary:
      'The minimal show/hide building block for a single expandable region.',
    whenToUse: [
      'A card\'s "more details" toggle, a sidebar group expand/collapse, an inline disclosure.',
    ],
    whenNotToUse: [
      {
        text: 'Multiple coordinated sections in a stack',
        use: 'accordion',
      },
    ],
    rules: [
      'Collapsible ships unstyled — visuals come from the consumer.',
      'For multiple coordinated sections use Accordion (which is built on this primitive).',
      'React exposes open / onOpenChange; Angular exposes a two-way [(open)] model plus defaultOpen.',
    ],
    example:
      '<collapsible defaultOpen><collapsible-trigger>Toggle</collapsible-trigger><collapsible-content>Hidden content</collapsible-content></collapsible>',
  },
  preview: {
    rx: 'layout-display-display-collapsible--workbench',
    ng: 'layout-display-display-collapsible--workbench',
  },
  tag: { rx: 'Collapsible', ng: 'gr-collapsible' },
  example: { defaultOpen: true },
  figma: { nodeId: null },
});
