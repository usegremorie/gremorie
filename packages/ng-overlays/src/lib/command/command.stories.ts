import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command';

/**
 * Command — keyboard-first command palette. Mirrors React `Command`.
 *
 * The searchable list is backed by `@spartan-ng/brain/command` (filtering,
 * keyboard navigation, selection). Use `Command` inline (e.g. inside a Popover
 * for the Combobox pattern) or `CommandDialog` for the canonical Cmd+K palette.
 *
 * Divergence: `CommandItem` exposes a required `value` input — `BrnCommandItem`
 * needs it for filtering, whereas React's cmdk derives it from the item text.
 */
const meta: Meta<Command> = {
  title: 'Overlays/Command',
  component: Command,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [
        Command,
        CommandDialog,
        CommandInput,
        CommandList,
        CommandEmpty,
        CommandGroup,
        CommandItem,
        CommandSeparator,
        CommandShortcut,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<Command>;

/** Workbench — inline palette with grouped, searchable items. */
export const Workbench: Story = {
  render: () => ({
    template: `
      <gn-command class="max-w-[450px] rounded-lg border shadow-md">
        <gn-command-input placeholder="Type a command or search..." />
        <gn-command-list>
          <gn-command-empty>No results found.</gn-command-empty>
          <gn-command-group>
            <div cmdk-group-heading>Suggestions</div>
            <gn-command-item value="calendar">Calendar</gn-command-item>
            <gn-command-item value="search-emoji">Search Emoji</gn-command-item>
            <gn-command-item value="calculator">Calculator</gn-command-item>
          </gn-command-group>
          <gn-command-separator />
          <gn-command-group>
            <div cmdk-group-heading>Settings</div>
            <gn-command-item value="profile">
              Profile <gn-command-shortcut>⌘P</gn-command-shortcut>
            </gn-command-item>
            <gn-command-item value="billing">
              Billing <gn-command-shortcut>⌘B</gn-command-shortcut>
            </gn-command-item>
            <gn-command-item value="settings">
              Settings <gn-command-shortcut>⌘S</gn-command-shortcut>
            </gn-command-item>
          </gn-command-group>
        </gn-command-list>
      </gn-command>
    `,
  }),
};

/** Dialog — `CommandDialog` renders the palette as a bordered panel with an sr-only title. */
export const Dialog: Story = {
  render: () => ({
    template: `
      <gn-command-dialog class="max-w-[450px]">
        <gn-command-input placeholder="Search..." />
        <gn-command-list>
          <gn-command-empty>No results found.</gn-command-empty>
          <gn-command-group>
            <div cmdk-group-heading>Navigation</div>
            <gn-command-item value="home">Home</gn-command-item>
            <gn-command-item value="docs">Documentation</gn-command-item>
          </gn-command-group>
        </gn-command-list>
      </gn-command-dialog>
    `,
  }),
};
