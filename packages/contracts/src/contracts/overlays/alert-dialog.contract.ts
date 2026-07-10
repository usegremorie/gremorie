import { defineContract } from '../../types';

/**
 * AlertDialog - modal, blocking confirmation dialog that forces a choice.
 * React: `@gremorie/rx-overlays` (Radix AlertDialog). Angular:
 * `@gremorie/ng-overlays` (spartan brain `BrnAlertDialog`).
 */
export const alertDialog = defineContract({
  name: 'alert-dialog',
  category: 'overlays',
  status: 'stable',
  anatomy: `
    <alert-dialog>
    └─ AlertDialog (root, holds open state)
       ├─ AlertDialogTrigger (opens the dialog)
       └─ AlertDialogContent (portalled, centered panel; size default | sm)
          ├─ AlertDialogHeader
          │  ├─ AlertDialogMedia (optional leading icon)
          │  ├─ AlertDialogTitle
          │  └─ AlertDialogDescription
          └─ AlertDialogFooter
             ├─ AlertDialogCancel (dismiss, Button outline)
             └─ AlertDialogAction (confirm, Button default)`,
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
      adapts: { ng: 'output: openChange (via BrnAlertDialog)' },
      desc: 'Fires when the open state changes.',
    },
    {
      name: 'size',
      type: "'default' | 'sm'",
      default: 'default',
      options: ['default', 'sm'],
      desc: 'AlertDialogContent: panel width preset (sm gives a 2-column footer).',
    },
    {
      name: 'variant',
      type: 'ButtonVariant',
      default: 'default',
      desc: 'AlertDialogAction / AlertDialogCancel: Button visual variant (Cancel defaults to outline).',
    },
    {
      name: 'size',
      type: 'ButtonSize',
      default: 'default',
      desc: 'AlertDialogAction / AlertDialogCancel: Button size preset.',
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
      'A modal, blocking confirmation dialog opened by a trigger - the user must choose, it does not dismiss itself.',
    whenToUse: [
      'A destructive or irreversible action that needs explicit confirmation: delete, discard, account removal.',
    ],
    whenNotToUse: [
      {
        text: 'A non-blocking short form or detail panel',
        use: 'dialog',
      },
      { text: 'A transient, non-blocking status message', use: 'sonner' },
    ],
    rules: [
      'AlertDialogTrigger opens the dialog on click; unlike Dialog it does NOT close on overlay click or Escape by default - the user must pick Action or Cancel.',
      'AlertDialogAction and AlertDialogCancel delegate styling to the Button primitive (Action default, Cancel outline); pair a destructive variant Action with a neutral Cancel.',
      'Angular renders the panel from a `<ng-template brnAlertDialogContent>` (CDK overlay); Action/Cancel are real `<button brnDialogClose>` elements styled via the shared buttonVariants, since the Angular Button renders its own inner button and cannot host the brain close directive.',
    ],
    example:
      '<AlertDialog><AlertDialogTrigger>Delete</AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction variant="destructive">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>',
  },
  preview: {
    rx: 'interaction-overlays-alertdialog--workbench',
    ng: 'interaction-overlays-alertdialog--workbench',
  },
  tag: { rx: 'AlertDialog', ng: 'gn-alert-dialog' },
  example: {
    defaultOpen: false,
    size: 'default',
    variant: 'default',
  },
  figma: { nodeId: null },
});
