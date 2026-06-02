import type { Meta, StoryObj } from '@storybook/react';
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from 'lucide-react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command';

/**
 * # Command
 *
 * A keyboard-first command palette built on `cmdk`. Use `Command` inline (for
 * comboboxes inside a Popover) or as the searchable list behind a `Cmd+K`
 * launcher. Items are grouped by intent (Navigation, Actions, Recent) and
 * filtered live as the user types.
 *
 * ## Anatomy
 *
 * - **Command** — cmdk root list container.
 * - **CommandInput** — search field with a leading magnifier.
 * - **CommandList** — scrollable results region.
 * - **CommandEmpty** — message shown when nothing matches.
 * - **CommandGroup** — labelled cluster of items.
 * - **CommandItem** — a selectable row.
 * - **CommandShortcut** — right-aligned keyboard hint.
 * - **CommandSeparator** — divider between groups.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `value` | `string` | — | Controlled selected value. |
 * | `onValueChange` | `(value: string) => void` | — | Selection callback. |
 * | `filter` | `(value, search) => number` | — | Custom fuzzy filter. |
 * | `shouldFilter` | `boolean` | `true` | Toggle built-in filtering. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `CommandInput` | Search input. |
 * | `CommandList` | Scrollable list. |
 * | `CommandEmpty` | No-results message. |
 * | `CommandGroup` | Labelled group. |
 * | `CommandItem` | Selectable row. |
 * | `CommandSeparator` | Divider. |
 * | `CommandShortcut` | Keyboard hint. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--popover` / `--popover-foreground` | Palette surface |
 * | `--accent` / `--accent-foreground` | Selected item |
 * | `--border` | Input + separator |
 * | `--muted-foreground` | Group headings + shortcuts |
 */
const meta = {
  title: 'Interaction/Overlays/Command',
  component: Command,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A grouped, searchable palette with shortcuts and a separator. */
export const Default: Story = {
  render: () => (
    <Command className="w-[420px] rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Smile />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <Calculator />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCard />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/**
 * Empty state — when the query matches nothing, `CommandEmpty` is shown in
 * place of the list. Type any non-matching text (e.g. "zzz") to trigger it.
 */
export const Empty: Story = {
  render: () => (
    <Command className="w-[420px] rounded-lg border shadow-md">
      <CommandInput placeholder="Type something with no match…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/** A disabled item alongside enabled ones. */
export const WithDisabledItem: Story = {
  render: () => (
    <Command className="w-[420px] rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem>
            <User />
            <span>Invite teammate</span>
          </CommandItem>
          <CommandItem disabled>
            <CreditCard />
            <span>Upgrade plan (unavailable)</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
