import { defineContract } from '../../types';

/**
 * Popover - click-anchored interactive content overlay.
 * React: `@gremorie/rx-overlays` (Radix Popover). Angular:
 * `@gremorie/ng-overlays` (spartan brain `BrnPopover`, CDK overlay).
 */
export const popover = defineContract({
  name: 'popover',
  category: 'overlays',
  status: 'stable',
  anatomy: `
    <popover>
    └─ Popover (root, holds open state)
       ├─ PopoverAnchor (optional positioning anchor)
       ├─ PopoverTrigger (opens the popover on click)
       └─ PopoverContent (portalled, anchored panel)
          ├─ PopoverHeader
          │  ├─ PopoverTitle
          │  └─ PopoverDescription
          └─ (interactive content)`,
  props: [
    { name: 'open', type: 'boolean', desc: 'Controlled open state.' },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: false,
      desc: 'Uncontrolled initial open state.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      adapts: { ng: 'output: openChange (via BrnPopover)' },
      desc: 'Fires when the open state changes.',
    },
    {
      name: 'modal',
      type: 'boolean',
      default: false,
      desc: 'Whether the popover traps focus and blocks the page behind.',
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end'",
      default: 'center',
      options: ['start', 'center', 'end'],
      adapts: { ng: 'align on the root (from BrnPopover)' },
      desc: 'PopoverContent: alignment of the panel against the trigger.',
    },
    {
      name: 'sideOffset',
      type: 'number',
      default: 4,
      adapts: { ng: 'sideOffset on the root (from BrnPopover)' },
      desc: 'PopoverContent: gap between trigger and panel.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'class input' },
      desc: 'Merged onto the content panel.',
    },
  ],
  guidance: {
    summary:
      'A click-anchored overlay hosting interactive content next to its trigger.',
    whenToUse: [
      'Anchored interactive content opened on click: a mini form, date/color picker, share menu, or filter panel.',
    ],
    whenNotToUse: [
      { text: 'A simple hover-only text label', use: 'tooltip' },
      { text: 'A hover preview of non-critical content', use: 'hover-card' },
      { text: 'A list of actions/commands', use: 'dropdown-menu' },
      { text: 'Content too long or that should block the page', use: 'dialog' },
    ],
    rules: [
      'Opens on click of PopoverTrigger (intentional, unlike hover-driven Tooltip/HoverCard).',
      'modal defaults to false - the page stays interactive; set true to trap focus.',
      'Angular renders the panel from a `<ng-template brnPopoverContent>` referenced by the trigger via `[content]`/`brnPopoverTriggerFor`; React composes PopoverContent inline through a Radix portal. align/sideOffset live on the Angular root, not on PopoverContent.',
    ],
    example:
      '<Popover><PopoverTrigger>Open</PopoverTrigger><PopoverContent align="start"><PopoverHeader><PopoverTitle>Dimensions</PopoverTitle></PopoverHeader></PopoverContent></Popover>',
  },
  preview: {
    rx: 'interaction-overlays-popover--workbench',
    ng: 'interaction-overlays-popover--workbench',
  },
  tag: { rx: 'Popover', ng: 'gr-popover' },
  example: {
    defaultOpen: false,
    modal: false,
    align: 'center',
    sideOffset: 4,
  },
  figma: { nodeId: null },
});
