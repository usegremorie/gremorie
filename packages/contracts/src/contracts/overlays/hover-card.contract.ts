import { defineContract } from '../../types';

/**
 * HoverCard - hover-triggered preview card anchored to a trigger.
 * React: `@gremorie/rx-overlays` (Radix HoverCard). Angular:
 * `@gremorie/ng-overlays` (spartan brain `BrnHoverCard`).
 */
export const hoverCard = defineContract({
  name: 'hover-card',
  category: 'overlays',
  status: 'stable',
  anatomy: `
    <hover-card>
    └─ HoverCard (root, holds open state + delays)
       ├─ HoverCardTrigger (the element being previewed)
       └─ HoverCardContent (portalled preview panel)`,
  props: [
    { name: 'open', type: 'boolean', desc: 'Controlled open state.' },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      adapts: { ng: 'output: openChange (via BrnHoverCard)' },
      desc: 'Fires when the open state changes.',
    },
    {
      name: 'openDelay',
      type: 'number',
      default: 700,
      adapts: { ng: 'showDelay on gn-hover-card-trigger' },
      desc: 'Ms hover delay before the card opens.',
    },
    {
      name: 'closeDelay',
      type: 'number',
      default: 300,
      adapts: { ng: 'hideDelay on gn-hover-card-trigger' },
      desc: 'Ms delay before the card closes after the pointer leaves.',
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end'",
      default: 'center',
      options: ['start', 'center', 'end'],
      adapts: { ng: 'align on gn-hover-card-trigger' },
      desc: 'HoverCardContent: alignment against the trigger.',
    },
    {
      name: 'sideOffset',
      type: 'number',
      default: 4,
      adapts: { ng: 'sideOffset on gn-hover-card-trigger' },
      desc: 'HoverCardContent: gap between trigger and card.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'class input on gn-hover-card-content' },
      desc: 'Merged onto the content panel.',
    },
  ],
  guidance: {
    summary:
      'A hover-triggered card that previews non-critical content about its trigger.',
    whenToUse: [
      'A sighted-user preview revealed on hover: a profile/avatar card, a link preview, a glossary definition.',
    ],
    whenNotToUse: [
      { text: 'A short plain-text label', use: 'tooltip' },
      { text: 'Interactive content opened on click', use: 'popover' },
      { text: 'A list of actions', use: 'dropdown-menu' },
    ],
    rules: [
      'Opens on hover only (not focus/click) - never put essential or keyboard-only content here; it is a sighted-user affordance.',
      'Tune openDelay/closeDelay so the card does not flicker on incidental hover.',
      'Angular renders the panel from a `<ng-template brnHoverCardContent>`; the timing and positioning inputs (showDelay/hideDelay/align/sideOffset) live on gn-hover-card-trigger, not the root or content.',
    ],
    example:
      '<HoverCard><HoverCardTrigger>@ada</HoverCardTrigger><HoverCardContent>Ada Lovelace - first programmer.</HoverCardContent></HoverCard>',
  },
  preview: {
    rx: 'interaction-overlays-hovercard--default',
    ng: 'overlays-hovercard--workbench',
  },
  tag: { rx: 'HoverCard', ng: 'gn-hover-card' },
  example: {
    openDelay: 700,
    closeDelay: 300,
    align: 'center',
    sideOffset: 4,
  },
  figma: { nodeId: null },
});
