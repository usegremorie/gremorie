import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuRadioGroup,
} from './context-menu';

/**
 * ContextMenu — right-click action menu anchored to a region.
 *
 * Mirrors React `ContextMenu`. DIVERGENCE: built on spartan brain `BrnPopover`
 * (CDK overlay) because brain ships no menu primitive. The trigger wires a
 * native `(contextmenu)` handler to open the popover; the content lives in a
 * `<ng-template brnPopoverContent>`.
 */
const meta: Meta<ContextMenu> = {
  title: 'Overlays/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [
        ContextMenu,
        ContextMenuTrigger,
        ContextMenuContent,
        ContextMenuItem,
        ContextMenuCheckboxItem,
        ContextMenuRadioItem,
        ContextMenuLabel,
        ContextMenuSeparator,
        ContextMenuShortcut,
        ContextMenuGroup,
        ContextMenuRadioGroup,
        BrnPopoverContent,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<ContextMenu>;

/** Workbench — right-click the region to open the menu. */
export const Workbench: Story = {
  render: () => ({
    template: `
      <gn-context-menu>
        <gn-context-menu-trigger [content]="content"
          class="flex h-40 w-72 items-center justify-center rounded-md border border-dashed text-sm">
          Right-click here
        </gn-context-menu-trigger>
        <ng-template #content>
          <ng-template brnPopoverContent>
            <gn-context-menu-content class="w-52">
              <gn-context-menu-label>Actions</gn-context-menu-label>
              <gn-context-menu-separator />
              <gn-context-menu-item>
                Back <gn-context-menu-shortcut>⌘[</gn-context-menu-shortcut>
              </gn-context-menu-item>
              <gn-context-menu-item>
                Forward <gn-context-menu-shortcut>⌘]</gn-context-menu-shortcut>
              </gn-context-menu-item>
              <gn-context-menu-separator />
              <gn-context-menu-item variant="destructive">Delete</gn-context-menu-item>
            </gn-context-menu-content>
          </ng-template>
        </ng-template>
      </gn-context-menu>
    `,
  }),
};

/** Checkbox & radio — toggles and a single-choice radio group. */
export const CheckboxAndRadio: Story = {
  render: () => ({
    template: `
      <gn-context-menu>
        <gn-context-menu-trigger [content]="content"
          class="flex h-40 w-72 items-center justify-center rounded-md border border-dashed text-sm">
          Right-click here
        </gn-context-menu-trigger>
        <ng-template #content>
          <ng-template brnPopoverContent>
            <gn-context-menu-content class="w-52">
              <gn-context-menu-checkbox-item [checked]="true">Show Bookmarks</gn-context-menu-checkbox-item>
              <gn-context-menu-checkbox-item>Show Full URLs</gn-context-menu-checkbox-item>
              <gn-context-menu-separator />
              <gn-context-menu-radio-group>
                <gn-context-menu-radio-item [checked]="true">Pedro</gn-context-menu-radio-item>
                <gn-context-menu-radio-item>Colm</gn-context-menu-radio-item>
              </gn-context-menu-radio-group>
            </gn-context-menu-content>
          </ng-template>
        </ng-template>
      </gn-context-menu>
    `,
  }),
};
