import { defineContract } from '../../types';

/**
 * Drawer - touch-friendly panel that slides in from an edge (bottom by default).
 * React: `@gremorie/rx-overlays` (vaul). Angular: `@gremorie/ng-overlays`
 * (spartan brain `BrnSheet`, no vaul drag physics).
 */
export const drawer = defineContract({
  name: 'drawer',
  category: 'overlays',
  status: 'stable',
  anatomy: `
    <drawer>
    └─ Drawer (root, holds open state)
       ├─ DrawerTrigger (opens the drawer)
       └─ DrawerContent (portalled edge panel + overlay + drag handle)
          ├─ DrawerHeader
          │  ├─ DrawerTitle
          │  └─ DrawerDescription
          ├─ (body content)
          └─ DrawerFooter
             └─ DrawerClose`,
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
      name: 'direction',
      type: "'top' | 'right' | 'bottom' | 'left'",
      default: 'bottom',
      options: ['top', 'right', 'bottom', 'left'],
      adapts: {
        ng: 'direction on gn-drawer-content (+ side on gn-drawer root)',
      },
      desc: 'Which edge the drawer slides in from.',
    },
    {
      name: 'shouldScaleBackground',
      type: 'boolean',
      adapts: { ng: 'n/a - no vaul background scale' },
      desc: 'Vaul: scale down the page behind while the drawer is open.',
    },
    {
      name: 'modal',
      type: 'boolean',
      default: true,
      desc: 'Blocks interaction with the page behind the drawer.',
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
      'A touch-friendly panel that slides in from a viewport edge (bottom by default), opened by a trigger.',
    whenToUse: [
      'A mobile/touch-first secondary surface, typically rising from the bottom, that the user can swipe to dismiss (React).',
    ],
    whenNotToUse: [
      {
        text: 'A desktop side panel with no drag affordance',
        use: 'sheet',
      },
      { text: 'A short focused dialog centered on screen', use: 'dialog' },
    ],
    rules: [
      'DrawerTrigger opens the drawer on click; it closes on overlay click, Escape, or (React) drag-down.',
      'React uses vaul, which adds drag-to-dismiss, momentum, and shouldScaleBackground; the Angular edition is built on the brain BrnSheet and has no vaul drag physics - it renders a static handle and sets data-vaul-drawer-direction for class parity.',
      'Angular renders the panel from a `<ng-template brnSheetContent>`; pass direction to gn-drawer-content (and the matching side to the gn-drawer root).',
    ],
    example:
      '<Drawer><DrawerTrigger>Open</DrawerTrigger><DrawerContent><DrawerHeader><DrawerTitle>Filters</DrawerTitle></DrawerHeader><DrawerFooter><DrawerClose>Close</DrawerClose></DrawerFooter></DrawerContent></Drawer>',
  },
  preview: {
    rx: 'interaction-overlays-drawer--workbench',
    ng: 'interaction-overlays-drawer--workbench',
  },
  tag: { rx: 'Drawer', ng: 'gn-drawer' },
  example: {
    defaultOpen: false,
    direction: 'bottom',
    modal: true,
  },
  figma: { nodeId: null },
});
