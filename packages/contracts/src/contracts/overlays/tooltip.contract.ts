import { defineContract } from '../../types';

/**
 * Tooltip - hover/focus-triggered text label anchored to a control.
 * React: `@gremorie/rx-overlays` (Radix Tooltip). Angular:
 * `@gremorie/ng-overlays` (spartan brain `BrnTooltip`).
 */
export const tooltip = defineContract({
  name: 'tooltip',
  category: 'overlays',
  status: 'stable',
  anatomy: `
    <tooltip>
    └─ TooltipProvider (shared delay context; wraps the tree)
       └─ Tooltip (root)
          ├─ TooltipTrigger (the control the tooltip describes)
          └─ TooltipContent (portalled label + arrow)`,
  props: [
    {
      name: 'delayDuration',
      type: 'number',
      default: 0,
      adapts: {
        ng: 'delayDuration on gn-tooltip-provider (pass-through) and gn-tooltip',
      },
      desc: 'TooltipProvider: ms hover delay before the tooltip opens.',
    },
    {
      name: 'open',
      type: 'boolean',
      desc: 'Tooltip root: controlled open state.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: false,
      desc: 'Tooltip root: uncontrolled initial open state.',
    },
    {
      name: 'side',
      type: "'top' | 'right' | 'bottom' | 'left'",
      default: 'top',
      options: ['top', 'right', 'bottom', 'left'],
      adapts: { ng: 'side on gn-tooltip' },
      desc: 'TooltipContent: which side of the trigger to render on.',
    },
    {
      name: 'sideOffset',
      type: 'number',
      default: 4,
      adapts: { ng: 'sideOffset on gn-tooltip' },
      desc: 'TooltipContent: gap between trigger and label.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'class input on gn-tooltip-content' },
      desc: 'Merged onto the content label.',
    },
  ],
  guidance: {
    summary:
      'A small hover/focus-triggered text label that names or clarifies a control.',
    whenToUse: [
      'A short, non-interactive label for an icon button or truncated control, revealed on hover or keyboard focus.',
    ],
    whenNotToUse: [
      { text: 'Interactive content (links, forms, buttons)', use: 'popover' },
      {
        text: 'A richer hover preview (avatar, bio, stats)',
        use: 'hover-card',
      },
      { text: 'A list of actions opened on click', use: 'dropdown-menu' },
    ],
    rules: [
      'Opens on hover and on keyboard focus of TooltipTrigger; never put interactive elements inside the content.',
      'Wrap the app (or a region) in a single TooltipProvider so the open delay is shared.',
      'Angular collapses Radix Provider/Root/Trigger/Content onto the brain `brnTooltip` directive: gn-tooltip-provider is a no-op pass-through, and side/delay live on gn-tooltip (the trigger reads them via context).',
    ],
    example:
      '<TooltipProvider><Tooltip><TooltipTrigger>?</TooltipTrigger><TooltipContent>Add to library</TooltipContent></Tooltip></TooltipProvider>',
  },
  preview: {
    rx: 'interaction-overlays-tooltip--default',
    ng: 'overlays-tooltip--workbench',
  },
  figma: { nodeId: null },
});
