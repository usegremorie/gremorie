import { defineContract } from '../../types';

/**
 * Menubar - a desktop-app-style menu bar (File / Edit / View / Help). React:
 * `@gremorie/rx-navigation` (wraps Radix Menubar). Angular: `@gremorie/ng-navigation`.
 */
export const menubar = defineContract({
  name: 'menubar',
  category: 'navigation',
  status: 'stable',
  anatomy: `
    <menubar>
    └─ menubar-menu
       ├─ menubar-trigger
       └─ menubar-content
          ├─ menubar-label
          ├─ menubar-group
          ├─ menubar-item (+ menubar-shortcut)
          ├─ menubar-checkbox-item
          ├─ menubar-radio-group > menubar-radio-item
          ├─ menubar-separator
          └─ menubar-sub
             ├─ menubar-sub-trigger
             └─ menubar-sub-content`,
  props: [
    {
      name: 'value',
      type: 'string',
      adapts: { ng: 'two-way model: [(value)]' },
      desc: 'Menubar: the currently open menu (controlled).',
    },
    {
      name: 'inset',
      type: 'boolean',
      default: false,
      desc: 'Item / Label / SubTrigger: indent to align with items that have a leading icon.',
    },
    {
      name: 'variant',
      type: 'string',
      default: 'default',
      options: ['default', 'destructive'],
      desc: 'MenubarItem: visual intent.',
    },
    {
      name: 'checked',
      type: 'boolean | "indeterminate"',
      adapts: { ng: 'two-way model: [(checked)]' },
      desc: 'MenubarCheckboxItem: checked state.',
    },
    {
      name: 'align',
      type: 'string',
      default: 'start',
      options: ['start', 'center', 'end'],
      desc: 'MenubarContent: alignment against the trigger.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto each sub-component.',
    },
  ],
  guidance: {
    summary:
      'A classic top-of-window menu bar with nested submenus, checkbox/radio items, and shortcuts.',
    whenToUse: [
      'Desktop-style web apps (code editors, spreadsheets, image editors) with a persistent File / Edit / View bar.',
    ],
    whenNotToUse: [
      {
        text: 'An action menu opened from a single button',
        use: 'dropdown-menu',
      },
      { text: 'Marketing-site primary navigation', use: 'navigation-menu' },
    ],
    rules: [
      'Each top-level menu is a menubar-menu wrapping a menubar-trigger + menubar-content.',
      'Use menubar-shortcut (right-aligned) for keyboard hints and menubar-sub for nested menus.',
      'Group mutually exclusive options in a menubar-radio-group of menubar-radio-items.',
    ],
    example:
      '<menubar><menubar-menu><menubar-trigger>File</menubar-trigger><menubar-content><menubar-item>New<menubar-shortcut>⌘N</menubar-shortcut></menubar-item></menubar-content></menubar-menu></menubar>',
  },
  preview: {
    rx: 'interaction-navigation-menubar--workbench',
    ng: 'interaction-navigation-menubar--workbench',
  },
  tag: { rx: 'Menubar', ng: 'gr-menubar' },
  example: { inset: false, variant: 'default', align: 'start' },
  figma: { nodeId: null },
});
