import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './context-menu';

/**
 * # ContextMenu
 *
 * A right-click activated secondary action menu — a faithful shadcn port over
 * Radix ContextMenu. Treat it as a power-user accelerator: every action here
 * must also be reachable through a visible button, dropdown or shortcut. Shares
 * its full shape with `DropdownMenu` (items, groups, checkbox/radio, submenus).
 *
 * ## Anatomy
 *
 * ```text
 * ContextMenu                       Radix root, owns open state
 * ├─ ContextMenuTrigger             region that responds to right-click
 * └─ ContextMenuContent             portalled menu surface
 *    ├─ ContextMenuGroup            groups related items
 *    ├─ ContextMenuItem             action row (variant default | destructive, inset)
 *    │  └─ ContextMenuShortcut      right-aligned keyboard hint
 *    ├─ ContextMenuCheckboxItem     toggleable item
 *    ├─ ContextMenuRadioGroup       single-choice container
 *    │  └─ ContextMenuRadioItem     single-choice item
 *    ├─ ContextMenuLabel            non-interactive section label
 *    ├─ ContextMenuSeparator        divider
 *    └─ ContextMenuSub              nested submenu
 *       ├─ ContextMenuSubTrigger    row that opens the submenu
 *       └─ ContextMenuSubContent    nested menu surface
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `onOpenChange` | `(open: boolean) => void` | — | Open-state callback. |
 * | `modal` | `boolean` | `true` | Block outside interaction while open. |
 *
 * `ContextMenuItem` adds `variant?: "default" | "destructive"` and `inset?: boolean`.
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `ContextMenuTrigger` | Right-click region. |
 * | `ContextMenuContent` | Menu surface. |
 * | `ContextMenuItem` | Action row. |
 * | `ContextMenuCheckboxItem` | Toggleable item. |
 * | `ContextMenuRadioGroup` / `ContextMenuRadioItem` | Single-choice items. |
 * | `ContextMenuLabel` | Section label. |
 * | `ContextMenuSeparator` | Divider. |
 * | `ContextMenuShortcut` | Keyboard hint. |
 * | `ContextMenuSub*` | Nested submenu. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--popover` / `--popover-foreground` | Menu surface |
 * | `--accent` / `--accent-foreground` | Focused item |
 * | `--destructive` | Destructive item |
 * | `--border` | Separator |
 */
const meta = {
  title: 'Interaction/Overlays/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const TriggerArea = ({ children }: { children: React.ReactNode }) => (
  <ContextMenu>
    <ContextMenuTrigger className="flex h-40 w-80 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground select-none">
      Right-click here
    </ContextMenuTrigger>
    {children}
  </ContextMenu>
);

/** Full menu: items, shortcuts, checkbox + radio groups and a submenu. */
export const Default: Story = {
  render: () => (
    <TriggerArea>
      <ContextMenuContent className="w-56">
        <ContextMenuItem>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>More tools</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>Save page as…</ContextMenuItem>
            <ContextMenuItem>Create shortcut…</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer tools</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>
          Show bookmarks bar
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Show full URLs</ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuLabel inset>People</ContextMenuLabel>
        <ContextMenuRadioGroup value="ada">
          <ContextMenuRadioItem value="ada">Ada Lovelace</ContextMenuRadioItem>
          <ContextMenuRadioItem value="alan">Alan Turing</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </TriggerArea>
  ),
};

/** Minimal action list. */
export const Simple: Story = {
  render: () => (
    <TriggerArea>
      <ContextMenuContent className="w-48">
        <ContextMenuItem>Cut</ContextMenuItem>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Paste</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </TriggerArea>
  ),
};
