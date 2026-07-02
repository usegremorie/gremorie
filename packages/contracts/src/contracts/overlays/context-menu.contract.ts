import { defineContract } from '../../types';

/**
 * ContextMenu - right-click triggered menu anchored at the pointer.
 * React: `@gremorie/rx-overlays` (Radix ContextMenu). Angular:
 * `@gremorie/ng-overlays` (built on spartan brain `BrnPopover`).
 */
export const contextMenu = defineContract({
  name: 'context-menu',
  category: 'overlays',
  status: 'stable',
  anatomy: `
    <context-menu>
    └─ ContextMenu (root, holds open state)
       ├─ ContextMenuTrigger (target element; right-click opens)
       └─ ContextMenuContent (portalled menu surface)
          ├─ ContextMenuLabel
          ├─ ContextMenuGroup
          │  ├─ ContextMenuItem (variant default | destructive)
          │  │  └─ ContextMenuShortcut
          │  ├─ ContextMenuCheckboxItem
          │  └─ ContextMenuRadioGroup
          │     └─ ContextMenuRadioItem
          ├─ ContextMenuSeparator
          └─ ContextMenuSub
             ├─ ContextMenuSubTrigger
             └─ ContextMenuSubContent`,
  props: [
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
      desc: 'ContextMenuItem: visual variant.',
    },
    {
      name: 'checked',
      type: 'boolean',
      adapts: { ng: 'checked input' },
      desc: 'ContextMenuCheckboxItem: controlled checked state.',
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
      'A menu opened by right-click (or long-press) on a target element, anchored at the pointer.',
    whenToUse: [
      'Contextual actions for a specific element revealed via right-click: a file row, a canvas item, an editor selection.',
    ],
    whenNotToUse: [
      {
        text: 'A menu opened from a visible button',
        use: 'dropdown-menu',
      },
      { text: 'A searchable command palette', use: 'command' },
      { text: 'Anchored interactive (non-menu) content', use: 'popover' },
    ],
    rules: [
      'ContextMenuTrigger opens the menu on the contextmenu (right-click) event over the target, not on a normal click; provide a discoverable alternative for keyboard/touch users.',
      'Use inset on plain Items/Labels to align them with checkbox/radio rows.',
      'Angular has no spartan context-menu primitive, so it is composed on BrnPopover: the trigger wires a `(contextmenu)` handler that prevents the browser menu and opens the popover, and submenus are styled placeholders (no nested submenu behavior).',
    ],
    example:
      '<ContextMenu><ContextMenuTrigger>Right-click me</ContextMenuTrigger><ContextMenuContent><ContextMenuItem>Back</ContextMenuItem><ContextMenuItem variant="destructive">Delete</ContextMenuItem></ContextMenuContent></ContextMenu>',
  },
  preview: {
    rx: 'interaction-overlays-contextmenu--default',
    ng: 'overlays-contextmenu--workbench',
  },
  tag: { rx: 'ContextMenu', ng: 'gn-context-menu' },
  example: {
    modal: true,
    inset: false,
    variant: 'default',
  },
  figma: { nodeId: null },
});
