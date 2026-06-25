import { defineContract } from '../../types';

/**
 * DropdownMenu - click-triggered menu of actions anchored to a button.
 * React: `@gremorie/rx-overlays` (Radix DropdownMenu). Angular:
 * `@gremorie/ng-overlays` (built on spartan brain `BrnPopover`).
 */
export const dropdownMenu = defineContract({
  name: 'dropdown-menu',
  category: 'overlays',
  status: 'stable',
  anatomy: `
    <dropdown-menu>
    └─ DropdownMenu (root, holds open state)
       ├─ DropdownMenuTrigger (the button that opens the menu)
       └─ DropdownMenuContent (portalled menu surface)
          ├─ DropdownMenuLabel
          ├─ DropdownMenuGroup
          │  ├─ DropdownMenuItem (variant default | destructive)
          │  │  └─ DropdownMenuShortcut
          │  ├─ DropdownMenuCheckboxItem
          │  └─ DropdownMenuRadioGroup
          │     └─ DropdownMenuRadioItem
          ├─ DropdownMenuSeparator
          └─ DropdownMenuSub
             ├─ DropdownMenuSubTrigger
             └─ DropdownMenuSubContent`,
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
      default: true,
      desc: 'Blocks interaction with the page behind the open menu.',
    },
    {
      name: 'sideOffset',
      type: 'number',
      default: 4,
      desc: 'DropdownMenuContent: gap between trigger and menu.',
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end'",
      options: ['start', 'center', 'end'],
      desc: 'DropdownMenuContent: alignment against the trigger.',
    },
    {
      name: 'inset',
      type: 'boolean',
      default: false,
      desc: 'Item / Label / SubTrigger: indent to align with checkbox/radio rows.',
    },
    {
      name: 'variant',
      type: "'default' | 'destructive'",
      default: 'default',
      options: ['default', 'destructive'],
      desc: 'DropdownMenuItem: visual variant.',
    },
    {
      name: 'checked',
      type: 'boolean',
      adapts: { ng: 'checked input' },
      desc: 'DropdownMenuCheckboxItem: controlled checked state.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'class input' },
      desc: 'Merged onto the relevant part.',
    },
  ],
  guidance: {
    summary:
      'A click-triggered menu of actions, toggles and choices anchored to a button.',
    whenToUse: [
      'A list of commands or options opened from a button: row actions, account menu, view options with checkbox/radio items.',
    ],
    whenNotToUse: [
      {
        text: 'A menu opened by right-click on a target element',
        use: 'context-menu',
      },
      { text: 'A searchable command palette', use: 'command' },
      { text: 'A single picked value from a list', use: 'select' },
      { text: 'Free-form anchored interactive content', use: 'popover' },
    ],
    rules: [
      'DropdownMenuTrigger opens the menu on click; items close it on select (checkbox/radio items can keep it open).',
      'Use inset on plain Items/Labels to align them with rows that have a leading checkbox or radio indicator.',
      'Angular has no spartan dropdown-menu primitive, so it is composed on BrnPopover: the trigger is a button with `[brnPopoverTriggerFor]` pointing at a `<ng-template brnPopoverContent>`, and nested submenus are styled placeholders (the brain popover has no real submenu behavior).',
    ],
    example:
      '<DropdownMenu><DropdownMenuTrigger>Open</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Edit</DropdownMenuItem><DropdownMenuItem variant="destructive">Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu>',
  },
  preview: {
    rx: 'interaction-overlays-dropdownmenu--default',
    ng: 'overlays-dropdownmenu--workbench',
  },
  figma: { nodeId: null },
});
