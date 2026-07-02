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
  title: 'Navigation/Menubar',
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
      <gn-menubar>
        <gn-menubar-menu>
          <gn-menubar-trigger>File</gn-menubar-trigger>
          <gn-menubar-content>
            <gn-menubar-item>New Tab <gn-menubar-shortcut>⌘T</gn-menubar-shortcut></gn-menubar-item>
            <gn-menubar-item>New Window <gn-menubar-shortcut>⌘N</gn-menubar-shortcut></gn-menubar-item>
            <gn-menubar-separator></gn-menubar-separator>
            <gn-menubar-item>Print… <gn-menubar-shortcut>⌘P</gn-menubar-shortcut></gn-menubar-item>
          </gn-menubar-content>
        </gn-menubar-menu>
        <gn-menubar-menu>
          <gn-menubar-trigger>Edit</gn-menubar-trigger>
          <gn-menubar-content>
            <gn-menubar-item>Undo <gn-menubar-shortcut>⌘Z</gn-menubar-shortcut></gn-menubar-item>
            <gn-menubar-item>Redo <gn-menubar-shortcut>⇧⌘Z</gn-menubar-shortcut></gn-menubar-item>
          </gn-menubar-content>
        </gn-menubar-menu>
      </gn-menubar>
    `,
  }),
};

/** Destructive — an item flagged with the destructive variant. */
export const Destructive: Story = {
  render: () => ({
    template: `
      <gn-menubar>
        <gn-menubar-menu>
          <gn-menubar-trigger>Account</gn-menubar-trigger>
          <gn-menubar-content>
            <gn-menubar-item>Profile</gn-menubar-item>
            <gn-menubar-separator></gn-menubar-separator>
            <gn-menubar-item variant="destructive">Delete account</gn-menubar-item>
          </gn-menubar-content>
        </gn-menubar-menu>
      </gn-menubar>
    `,
  }),
};
