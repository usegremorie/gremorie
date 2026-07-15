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
  title: 'Interaction/Overlays/ContextMenu',
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
      <gr-context-menu>
        <gr-context-menu-trigger [content]="content"
          class="flex h-40 w-72 items-center justify-center rounded-md border border-dashed text-sm">
          Right-click here
        </gr-context-menu-trigger>
        <ng-template #content>
          <ng-template brnPopoverContent>
            <gr-context-menu-content class="w-52">
              <gr-context-menu-label>Actions</gr-context-menu-label>
              <gr-context-menu-separator />
              <gr-context-menu-item>
                Back <gr-context-menu-shortcut>⌘[</gr-context-menu-shortcut>
              </gr-context-menu-item>
              <gr-context-menu-item>
                Forward <gr-context-menu-shortcut>⌘]</gr-context-menu-shortcut>
              </gr-context-menu-item>
              <gr-context-menu-separator />
              <gr-context-menu-item variant="destructive">Delete</gr-context-menu-item>
            </gr-context-menu-content>
          </ng-template>
        </ng-template>
      </gr-context-menu>
    `,
  }),
};

/** Checkbox & radio — toggles and a single-choice radio group. */
export const CheckboxAndRadio: Story = {
  render: () => ({
    template: `
      <gr-context-menu>
        <gr-context-menu-trigger [content]="content"
          class="flex h-40 w-72 items-center justify-center rounded-md border border-dashed text-sm">
          Right-click here
        </gr-context-menu-trigger>
        <ng-template #content>
          <ng-template brnPopoverContent>
            <gr-context-menu-content class="w-52">
              <gr-context-menu-checkbox-item [checked]="true">Show Bookmarks</gr-context-menu-checkbox-item>
              <gr-context-menu-checkbox-item>Show Full URLs</gr-context-menu-checkbox-item>
              <gr-context-menu-separator />
              <gr-context-menu-radio-group>
                <gr-context-menu-radio-item [checked]="true">Pedro</gr-context-menu-radio-item>
                <gr-context-menu-radio-item>Colm</gr-context-menu-radio-item>
              </gr-context-menu-radio-group>
            </gr-context-menu-content>
          </ng-template>
        </ng-template>
      </gr-context-menu>
    `,
  }),
};
