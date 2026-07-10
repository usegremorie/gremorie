import type { Meta, StoryObj } from '@storybook/react';

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from './menubar';

/**
 * # Menubar
 *
 * Desktop-app-style menu bar built on Radix Menubar. Use for classic
 * File / Edit / View / Help bars at the top of a window in desktop-style web
 * apps (editors, spreadsheets). For anything else — nav menus, action menus —
 * DropdownMenu or NavigationMenu wins. Supports nested submenus, checkbox
 * items, radio items, and keyboard shortcuts via `MenubarShortcut`.
 *
 * ## Anatomy
 *
 * ```text
 * Menubar
 * └─ MenubarMenu                      one top-level menu (File, Edit, …)
 *    ├─ MenubarTrigger                clickable label that opens the menu
 *    └─ MenubarContent                portaled dropdown panel
 *       ├─ MenubarItem                command row (inset / destructive variants)
 *       │  └─ MenubarShortcut         right-aligned keyboard hint
 *       ├─ MenubarCheckboxItem        toggleable item with a check indicator
 *       ├─ MenubarRadioGroup          single-choice group
 *       │  └─ MenubarRadioItem        one radio option with a dot indicator
 *       ├─ MenubarLabel               non-interactive group header
 *       ├─ MenubarSeparator           1px divider between groups
 *       └─ MenubarSub                 nested submenu
 *          ├─ MenubarSubTrigger       row that opens the submenu
 *          └─ MenubarSubContent       the submenu panel
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `...props` | Radix `Menubar.Root` props | — | Forwarded to the root. |
 *
 * `MenubarItem` adds `inset?: boolean` and `variant?: "default" \| "destructive"`.
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `MenubarMenu` / `MenubarTrigger` / `MenubarContent` | One menu + its panel. |
 * | `MenubarItem` | A command row. |
 * | `MenubarCheckboxItem` | Toggleable item with a check indicator. |
 * | `MenubarRadioGroup` / `MenubarRadioItem` | Single-choice group. |
 * | `MenubarSub` / `MenubarSubTrigger` / `MenubarSubContent` | Nested submenu. |
 * | `MenubarShortcut` | Right-aligned shortcut hint. |
 * | `MenubarSeparator` / `MenubarLabel` / `MenubarGroup` | Grouping. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--background` / `--border` | Bar surface + border |
 * | `--popover` / `--popover-foreground` | Dropdown panels |
 * | `--accent` / `--accent-foreground` | Focused item highlight |
 * | `--destructive` | `variant="destructive"` items |
 * | `--muted-foreground` | Shortcut hints + item icons |
 */
const meta = {
  title: 'Interaction/Navigation/Menubar',
  component: Menubar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Workbench preset: a File / Edit bar with shortcuts and a separator — the
 * IDENTICAL use case as the Angular `Workbench` story. Keep both in sync.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Print… <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

/**
 * A full menu bar (File / Edit / View) covering items, shortcuts, a submenu,
 * checkbox items, and a radio group.
 */
export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>New Incognito Window</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print… <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">Delete file</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Find</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Search the web</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Find…</MenubarItem>
              <MenubarItem>Find Next</MenubarItem>
              <MenubarItem>Find Previous</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>
            Always Show Full URLs
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            Reload <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarRadioGroup value="comfortable">
            <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
            <MenubarRadioItem value="comfortable">Comfortable</MenubarRadioItem>
            <MenubarRadioItem value="spacious">Spacious</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};
