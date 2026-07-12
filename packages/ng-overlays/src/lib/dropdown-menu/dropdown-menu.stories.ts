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
  title: 'Interaction/Overlays/DropdownMenu',
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
      <gr-dropdown-menu>
        <gr-dropdown-menu-trigger [content]="content"
          class="inline-flex h-9 items-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">
          Open menu
        </gr-dropdown-menu-trigger>
        <ng-template #content>
          <ng-template brnPopoverContent>
            <gr-dropdown-menu-content class="w-56">
              <gr-dropdown-menu-label>My Account</gr-dropdown-menu-label>
              <gr-dropdown-menu-separator />
              <gr-dropdown-menu-item>
                Profile <gr-dropdown-menu-shortcut>⇧⌘P</gr-dropdown-menu-shortcut>
              </gr-dropdown-menu-item>
              <gr-dropdown-menu-item>
                Settings <gr-dropdown-menu-shortcut>⌘S</gr-dropdown-menu-shortcut>
              </gr-dropdown-menu-item>
              <gr-dropdown-menu-separator />
              <gr-dropdown-menu-item variant="destructive">Delete</gr-dropdown-menu-item>
            </gr-dropdown-menu-content>
          </ng-template>
        </ng-template>
      </gr-dropdown-menu>
    `,
  }),
};

/** Checkbox & radio — toggle items and a single-choice radio group. */
export const CheckboxAndRadio: Story = {
  render: () => ({
    template: `
      <gr-dropdown-menu>
        <gr-dropdown-menu-trigger [content]="content"
          class="inline-flex h-9 items-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">
          View options
        </gr-dropdown-menu-trigger>
        <ng-template #content>
          <ng-template brnPopoverContent>
            <gr-dropdown-menu-content class="w-56">
              <gr-dropdown-menu-label>Appearance</gr-dropdown-menu-label>
              <gr-dropdown-menu-checkbox-item [checked]="true">Status Bar</gr-dropdown-menu-checkbox-item>
              <gr-dropdown-menu-checkbox-item>Activity Bar</gr-dropdown-menu-checkbox-item>
              <gr-dropdown-menu-separator />
              <gr-dropdown-menu-radio-group>
                <gr-dropdown-menu-radio-item [checked]="true">Top</gr-dropdown-menu-radio-item>
                <gr-dropdown-menu-radio-item>Bottom</gr-dropdown-menu-radio-item>
              </gr-dropdown-menu-radio-group>
            </gr-dropdown-menu-content>
          </ng-template>
        </ng-template>
      </gr-dropdown-menu>
    `,
  }),
};
