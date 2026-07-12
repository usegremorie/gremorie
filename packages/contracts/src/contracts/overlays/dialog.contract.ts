import { defineContract } from '../../types';

/**
 * Dialog - modal overlay anchored at viewport center, opened by a trigger.
 * React: `@gremorie/rx-overlays` (Radix Dialog). Angular: `@gremorie/ng-overlays`
 * (spartan brain `BrnDialog`, CDK overlay).
 */
export const dialog = defineContract({
  name: 'dialog',
  category: 'overlays',
  status: 'stable',
  anatomy: `
    <dialog>
    └─ Dialog (root, holds open state)
       ├─ DialogTrigger (opens the dialog)
       └─ DialogContent (portalled, centered panel + overlay + corner close)
          ├─ DialogHeader
          │  ├─ DialogTitle
          │  └─ DialogDescription
          ├─ (body content)
          └─ DialogFooter
             └─ DialogClose (dismiss action)`,
  props: [
    {
      name: 'open',
      type: 'boolean',
      desc: 'Controlled open state of the dialog.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: false,
      desc: 'Uncontrolled initial open state.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      adapts: { ng: 'output: openChange (via BrnDialog)' },
      desc: 'Fires when the open state changes.',
    },
    {
      name: 'modal',
      type: 'boolean',
      default: true,
      desc: 'Blocks interaction with the page behind the dialog.',
    },
    {
      name: 'showCloseButton',
      type: 'boolean',
      default: true,
      desc: 'DialogContent: render the corner X close button.',
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
      'A modal overlay anchored at viewport center, opened by a trigger - for focused decisions or short flows.',
    whenToUse: [
      'A short, focused flow that should interrupt the user: a single-step form, a detail card, or a confirmation.',
    ],
    whenNotToUse: [
      {
        text: 'A destructive/irreversible confirmation that must force a choice',
        use: 'alert-dialog',
      },
      {
        text: 'A longer side flow that does not need full focus',
        use: 'sheet',
      },
      {
        text: 'Inline contextual content anchored to a trigger',
        use: 'popover',
      },
    ],
    rules: [
      'DialogTrigger is required - the dialog opens on click of the trigger.',
      'Closes on overlay click and Escape (set modal to keep the page behind inert).',
      'Angular renders the panel from a `<ng-template brnDialogContent>` inside `<gr-dialog>` (CDK overlay), whereas React composes DialogContent inline through a Radix portal; DialogPortal/DialogOverlay are not separate Angular parts (the brain owns the backdrop).',
    ],
    example:
      '<Dialog><DialogTrigger>Edit</DialogTrigger><DialogContent><DialogHeader><DialogTitle>Edit profile</DialogTitle></DialogHeader><DialogFooter><DialogClose>Cancel</DialogClose></DialogFooter></DialogContent></Dialog>',
  },
  preview: {
    rx: 'interaction-overlays-dialog--workbench',
    ng: 'interaction-overlays-dialog--workbench',
  },
  tag: { rx: 'Dialog', ng: 'gr-dialog' },
  example: {
    defaultOpen: false,
    modal: true,
    showCloseButton: true,
  },
  figma: { nodeId: null },
});
