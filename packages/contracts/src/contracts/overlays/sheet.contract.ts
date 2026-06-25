import { defineContract } from '../../types';

/**
 * Sheet - edge-anchored panel that slides in from a viewport side.
 * React: `@gremorie/rx-overlays` (Radix Dialog). Angular:
 * `@gremorie/ng-overlays` (spartan brain `BrnSheet`).
 */
export const sheet = defineContract({
  name: 'sheet',
  category: 'overlays',
  status: 'stable',
  anatomy: `
    <sheet>
    └─ Sheet (root, holds open state)
       ├─ SheetTrigger (opens the sheet)
       └─ SheetContent (portalled side panel + overlay + corner close)
          ├─ SheetHeader
          │  ├─ SheetTitle
          │  └─ SheetDescription
          ├─ (body content)
          └─ SheetFooter
             └─ SheetClose`,
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
      adapts: { ng: 'output: openChange (via BrnSheet)' },
      desc: 'Fires when the open state changes.',
    },
    {
      name: 'modal',
      type: 'boolean',
      default: true,
      desc: 'Blocks interaction with the page behind the sheet.',
    },
    {
      name: 'side',
      type: "'top' | 'right' | 'bottom' | 'left'",
      default: 'right',
      options: ['top', 'right', 'bottom', 'left'],
      adapts: { ng: 'side on the root (gn-sheet) AND gn-sheet-content' },
      desc: 'SheetContent: which viewport edge the panel slides in from.',
    },
    {
      name: 'showCloseButton',
      type: 'boolean',
      default: true,
      desc: 'SheetContent: render the corner X close button.',
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
      'An edge-anchored panel that slides in from a side - for longer side flows that need not block focus.',
    whenToUse: [
      'A longer secondary flow, a navigation drawer, or a detail/edit panel that slides in from a screen edge.',
    ],
    whenNotToUse: [
      {
        text: 'A short focused form or detail centered on screen',
        use: 'dialog',
      },
      {
        text: 'A bottom panel optimized for touch/drag dismissal',
        use: 'drawer',
      },
      { text: 'Small anchored content next to a trigger', use: 'popover' },
    ],
    rules: [
      'SheetTrigger opens the sheet on click; it closes on overlay click and Escape.',
      'side picks the edge; in Angular the same side must be passed to both gn-sheet (root) and gn-sheet-content so the brain animation and the panel layout agree.',
      'Angular renders the panel from a `<ng-template brnSheetContent>` (CDK overlay); SheetPortal/SheetOverlay are not separate Angular parts (the brain owns the backdrop).',
    ],
    example:
      '<Sheet><SheetTrigger>Open</SheetTrigger><SheetContent side="right"><SheetHeader><SheetTitle>Edit</SheetTitle></SheetHeader><SheetFooter><SheetClose>Done</SheetClose></SheetFooter></SheetContent></Sheet>',
  },
  preview: {
    rx: 'interaction-overlays-sheet--default',
    ng: 'overlays-sheet--workbench',
  },
  tag: { rx: 'Sheet', ng: 'gn-sheet' },
  example: {
    defaultOpen: false,
    modal: true,
    side: 'right',
    showCloseButton: true,
  },
  figma: { nodeId: null },
});
