import type { Meta, StoryObj } from "@storybook/react";

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
} from "./menubar";

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
 * - **Menubar** — the horizontal bar wrapper.
 * - **MenubarMenu** — one top-level menu (File, Edit, …).
 * - **MenubarTrigger** — the clickable label opening a menu.
 * - **MenubarContent** — the dropdown panel (portaled).
 * - **MenubarItem** — a command row (`variant` supports `destructive`, `inset`).
 * - **MenubarCheckboxItem** / **MenubarRadioGroup** / **MenubarRadioItem** — stateful items.
 * - **MenubarSub** / **MenubarSubTrigger** / **MenubarSubContent** — nested submenus.
 * - **MenubarShortcut** — right-aligned keyboard hint.
 * - **MenubarSeparator** / **MenubarLabel** — grouping helpers.
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
  title: "Interaction/Navigation/Menubar",
  component: Menubar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

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
            <MenubarRadioItem value="comfortable">
              Comfortable
            </MenubarRadioItem>
            <MenubarRadioItem value="spacious">Spacious</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};
