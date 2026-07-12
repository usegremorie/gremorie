import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from './menubar';

/**
 * Menubar — desktop-app-style menu bar. Mirrors React `Menubar`. Use for
 * classic File / Edit / View bars; supports submenus, checkbox/radio items and
 * shortcuts.
 */
const meta: Meta<Menubar> = {
  title: 'Interaction/Navigation/Menubar',
  component: Menubar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [
        Menubar,
        MenubarMenu,
        MenubarTrigger,
        MenubarContent,
        MenubarItem,
        MenubarSeparator,
        MenubarShortcut,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<Menubar>;

/** Workbench — a File / Edit bar with shortcuts and a separator. */
export const Workbench: Story = {
  render: () => ({
    template: `
      <gr-menubar>
        <gr-menubar-menu>
          <gr-menubar-trigger>File</gr-menubar-trigger>
          <gr-menubar-content>
            <gr-menubar-item>New Tab <gr-menubar-shortcut>⌘T</gr-menubar-shortcut></gr-menubar-item>
            <gr-menubar-item>New Window <gr-menubar-shortcut>⌘N</gr-menubar-shortcut></gr-menubar-item>
            <gr-menubar-separator></gr-menubar-separator>
            <gr-menubar-item>Print… <gr-menubar-shortcut>⌘P</gr-menubar-shortcut></gr-menubar-item>
          </gr-menubar-content>
        </gr-menubar-menu>
        <gr-menubar-menu>
          <gr-menubar-trigger>Edit</gr-menubar-trigger>
          <gr-menubar-content>
            <gr-menubar-item>Undo <gr-menubar-shortcut>⌘Z</gr-menubar-shortcut></gr-menubar-item>
            <gr-menubar-item>Redo <gr-menubar-shortcut>⇧⌘Z</gr-menubar-shortcut></gr-menubar-item>
          </gr-menubar-content>
        </gr-menubar-menu>
      </gr-menubar>
    `,
  }),
};

/** Destructive — an item flagged with the destructive variant. */
export const Destructive: Story = {
  render: () => ({
    template: `
      <gr-menubar>
        <gr-menubar-menu>
          <gr-menubar-trigger>Account</gr-menubar-trigger>
          <gr-menubar-content>
            <gr-menubar-item>Profile</gr-menubar-item>
            <gr-menubar-separator></gr-menubar-separator>
            <gr-menubar-item variant="destructive">Delete account</gr-menubar-item>
          </gr-menubar-content>
        </gr-menubar-menu>
      </gr-menubar>
    `,
  }),
};
