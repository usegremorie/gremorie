import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from './dropdown-menu';

/**
 * DropdownMenu — verb-led action menu attached to a trigger.
 *
 * Mirrors React `DropdownMenu`. DIVERGENCE: built on spartan brain `BrnPopover`
 * (CDK overlay) because brain ships no menu primitive. The content lives in a
 * `<ng-template brnPopoverContent #content>` and the trigger opens it via
 * `[content]="content"`.
 */
const meta: Meta<DropdownMenu> = {
  title: 'Overlays/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [
        DropdownMenu,
        DropdownMenuTrigger,
        DropdownMenuContent,
        DropdownMenuGroup,
        DropdownMenuLabel,
        DropdownMenuItem,
        DropdownMenuCheckboxItem,
        DropdownMenuRadioGroup,
        DropdownMenuRadioItem,
        DropdownMenuSeparator,
        DropdownMenuShortcut,
        BrnPopoverContent,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<DropdownMenu>;

/** Workbench — an actions menu with label, items, separator and a shortcut. */
export const Workbench: Story = {
  render: () => ({
    template: `
      <gn-dropdown-menu>
        <gn-dropdown-menu-trigger [content]="content"
          class="inline-flex h-9 items-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">
          Open menu
        </gn-dropdown-menu-trigger>
        <ng-template #content>
          <ng-template brnPopoverContent>
            <gn-dropdown-menu-content class="w-56">
              <gn-dropdown-menu-label>My Account</gn-dropdown-menu-label>
              <gn-dropdown-menu-separator />
              <gn-dropdown-menu-item>
                Profile <gn-dropdown-menu-shortcut>⇧⌘P</gn-dropdown-menu-shortcut>
              </gn-dropdown-menu-item>
              <gn-dropdown-menu-item>
                Settings <gn-dropdown-menu-shortcut>⌘S</gn-dropdown-menu-shortcut>
              </gn-dropdown-menu-item>
              <gn-dropdown-menu-separator />
              <gn-dropdown-menu-item variant="destructive">Delete</gn-dropdown-menu-item>
            </gn-dropdown-menu-content>
          </ng-template>
        </ng-template>
      </gn-dropdown-menu>
    `,
  }),
};

/** Checkbox & radio — toggle items and a single-choice radio group. */
export const CheckboxAndRadio: Story = {
  render: () => ({
    template: `
      <gn-dropdown-menu>
        <gn-dropdown-menu-trigger [content]="content"
          class="inline-flex h-9 items-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">
          View options
        </gn-dropdown-menu-trigger>
        <ng-template #content>
          <ng-template brnPopoverContent>
            <gn-dropdown-menu-content class="w-56">
              <gn-dropdown-menu-label>Appearance</gn-dropdown-menu-label>
              <gn-dropdown-menu-checkbox-item [checked]="true">Status Bar</gn-dropdown-menu-checkbox-item>
              <gn-dropdown-menu-checkbox-item>Activity Bar</gn-dropdown-menu-checkbox-item>
              <gn-dropdown-menu-separator />
              <gn-dropdown-menu-radio-group>
                <gn-dropdown-menu-radio-item [checked]="true">Top</gn-dropdown-menu-radio-item>
                <gn-dropdown-menu-radio-item>Bottom</gn-dropdown-menu-radio-item>
              </gn-dropdown-menu-radio-group>
            </gn-dropdown-menu-content>
          </ng-template>
        </ng-template>
      </gn-dropdown-menu>
    `,
  }),
};
