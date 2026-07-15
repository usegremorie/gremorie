import { defineContract } from '../../types';

/**
 * Command - searchable command palette / list filter.
 * React: `@gremorie/rx-overlays` (cmdk). Angular: `@gremorie/ng-overlays`
 * (spartan brain `BrnCommand`).
 */
export const command = defineContract({
  name: 'command',
  category: 'overlays',
  status: 'stable',
  anatomy: `
    <command>
    └─ Command (root, owns search value + filtering)
       ├─ CommandInput (search field)
       └─ CommandList
          ├─ CommandEmpty (no-results state)
          ├─ CommandGroup (labelled section)
          │  └─ CommandItem
          │     └─ CommandShortcut
          └─ CommandSeparator
    CommandDialog (Command inside a Dialog, opened by a trigger/hotkey)`,
  props: [
    {
      name: 'value',
      type: 'string',
      desc: 'Command: controlled selected/active value.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      adapts: { ng: 'output: valueChange' },
      desc: 'Command: fires when the active value changes.',
    },
    {
      name: 'shouldFilter',
      type: 'boolean',
      default: true,
      desc: 'Command: whether the list auto-filters by the input text.',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: 'Type a command or search...',
      adapts: { rx: 'standard input placeholder' },
      desc: 'CommandInput: placeholder text.',
    },
    {
      name: 'title',
      type: 'string',
      default: 'Command Palette',
      desc: 'CommandDialog: accessible (sr-only) dialog title.',
    },
    {
      name: 'description',
      type: 'string',
      default: 'Search for a command to run...',
      desc: 'CommandDialog: accessible (sr-only) dialog description.',
    },
    {
      name: 'showCloseButton',
      type: 'boolean',
      default: true,
      adapts: { ng: 'n/a - dialog renders inline as a panel' },
      desc: 'CommandDialog: render the corner X close button.',
    },
    {
      name: 'value',
      type: 'string',
      required: true,
      adapts: { rx: 'derived from item text by cmdk' },
      desc: 'CommandItem (Angular): explicit value used for search/filter (cmdk derives it from text in React).',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      desc: 'CommandItem: disable selection.',
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
      'A searchable, keyboard-navigable command palette or filterable list.',
    whenToUse: [
      'A fast type-to-filter list of commands or entities, inline (in a popover) or in a dialog opened by a hotkey.',
    ],
    whenNotToUse: [
      {
        text: 'A short fixed list of actions from a button',
        use: 'dropdown-menu',
      },
      { text: 'A single picked value from a small list', use: 'select' },
      { text: 'A right-click contextual menu', use: 'context-menu' },
    ],
    rules: [
      'Wrap Command in CommandDialog (or a Popover) to make it an overlay; standalone Command is just the inline filter surface.',
      'CommandEmpty renders when filtering yields no matches - always include it.',
      'Angular `BrnCommandItem` requires an explicit value input for search/filtering, whereas React cmdk derives the value from item text; the Angular CommandDialog renders inline as a popover-style panel (sr-only title/description) rather than a true modal overlay.',
    ],
    example:
      '<Command><CommandInput placeholder="Search..." /><CommandList><CommandEmpty>No results.</CommandEmpty><CommandGroup heading="Actions"><CommandItem>New file<CommandShortcut>⌘N</CommandShortcut></CommandItem></CommandGroup></CommandList></Command>',
  },
  preview: {
    rx: 'interaction-overlays-command--workbench',
    ng: 'interaction-overlays-command--workbench',
  },
  tag: { rx: 'Command', ng: 'gr-command' },
  example: {
    shouldFilter: true,
    placeholder: 'Type a command or search...',
    title: 'Command Palette',
    description: 'Search for a command to run...',
    showCloseButton: true,
    disabled: false,
  },
  figma: { nodeId: null },
});
