import type { Meta, StoryObj } from '@storybook/react';
import {
  Cloud,
  CreditCard,
  Keyboard,
  LifeBuoy,
  LogOut,
  Settings,
  User,
  UserPlus,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Button } from '@gremorie/rx-forms';

/**
 * # DropdownMenu
 *
 * A verb-led action menu attached to a trigger — a faithful shadcn port over
 * Radix DropdownMenu. Use it for *actions* (Edit, Delete, Duplicate); reach for
 * `Select` when the items are *values*. When the rows read like verbs, this is
 * the right primitive.
 *
 * ## Anatomy
 *
 * ```text
 * DropdownMenu                       Root holding open state
 * ├─ DropdownMenuTrigger             Element that opens the menu
 * └─ DropdownMenuContent             Portalled surface (sideOffset default 4)
 *    ├─ DropdownMenuLabel            Non-interactive section label
 *    ├─ DropdownMenuSeparator        Divider
 *    ├─ DropdownMenuGroup            Groups related items
 *    │  └─ DropdownMenuItem          Action row (variant default | destructive, inset)
 *    ├─ DropdownMenuCheckboxItem     Toggleable item
 *    ├─ DropdownMenuRadioGroup       Single-choice container
 *    │  └─ DropdownMenuRadioItem     Single-choice item
 *    ├─ DropdownMenuSub              Nested submenu
 *    │  ├─ DropdownMenuSubTrigger    Opens the submenu
 *    │  └─ DropdownMenuSubContent    Submenu surface
 *    └─ DropdownMenuShortcut         Right-aligned keyboard hint
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `open` | `boolean` | — | Controlled open state. |
 * | `onOpenChange` | `(open: boolean) => void` | — | Open-state callback. |
 * | `modal` | `boolean` | `true` | Block outside interaction while open. |
 *
 * `DropdownMenuItem` adds `variant?: "default" | "destructive"` and `inset?: boolean`.
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `DropdownMenuTrigger` | Opens the menu. |
 * | `DropdownMenuContent` | Menu surface. |
 * | `DropdownMenuItem` | Action row. |
 * | `DropdownMenuCheckboxItem` | Toggleable item. |
 * | `DropdownMenuRadioGroup` / `DropdownMenuRadioItem` | Single-choice items. |
 * | `DropdownMenuLabel` | Section label. |
 * | `DropdownMenuSeparator` | Divider. |
 * | `DropdownMenuShortcut` | Keyboard hint. |
 * | `DropdownMenuSub*` | Nested submenu. |
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
  title: 'Interaction/Overlays/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Workbench — an actions menu with label, items, separator and a shortcut. */
export const Workbench: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Settings <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Full account menu: labels, shortcuts, a submenu and a destructive item. */
export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Keyboard />
            Keyboard shortcuts
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <UserPlus />
            Invite users
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Email</DropdownMenuItem>
            <DropdownMenuItem>Message</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem>
          <LifeBuoy />
          Support
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Cloud />
          API (coming soon)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Checkbox items for toggleable view options. */
export const CheckboxItems: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">View</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>Status bar</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Activity bar</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked>Panel</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Radio group for a single-choice setting. */
export const RadioItems: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Panel position</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Position</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value="bottom">
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
