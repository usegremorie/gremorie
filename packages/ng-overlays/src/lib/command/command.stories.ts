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
  title: 'Interaction/Overlays/Command',
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
      <gr-command class="max-w-[450px] rounded-lg border shadow-md">
        <gr-command-input placeholder="Type a command or search..." />
        <gr-command-list>
          <gr-command-empty>No results found.</gr-command-empty>
          <gr-command-group>
            <div cmdk-group-heading>Suggestions</div>
            <gr-command-item value="calendar">Calendar</gr-command-item>
            <gr-command-item value="search-emoji">Search Emoji</gr-command-item>
            <gr-command-item value="calculator">Calculator</gr-command-item>
          </gr-command-group>
          <gr-command-separator />
          <gr-command-group>
            <div cmdk-group-heading>Settings</div>
            <gr-command-item value="profile">
              Profile <gr-command-shortcut>⌘P</gr-command-shortcut>
            </gr-command-item>
            <gr-command-item value="billing">
              Billing <gr-command-shortcut>⌘B</gr-command-shortcut>
            </gr-command-item>
            <gr-command-item value="settings">
              Settings <gr-command-shortcut>⌘S</gr-command-shortcut>
            </gr-command-item>
          </gr-command-group>
        </gr-command-list>
      </gr-command>
    `,
  }),
};

/** Dialog — `CommandDialog` renders the palette as a bordered panel with an sr-only title. */
export const Dialog: Story = {
  render: () => ({
    template: `
      <gr-command-dialog class="max-w-[450px]">
        <gr-command-input placeholder="Search..." />
        <gr-command-list>
          <gr-command-empty>No results found.</gr-command-empty>
          <gr-command-group>
            <div cmdk-group-heading>Navigation</div>
            <gr-command-item value="home">Home</gr-command-item>
            <gr-command-item value="docs">Documentation</gr-command-item>
          </gr-command-group>
        </gr-command-list>
      </gr-command-dialog>
    `,
  }),
};
