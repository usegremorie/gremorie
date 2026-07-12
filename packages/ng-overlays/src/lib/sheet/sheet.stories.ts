import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrnSheetContent } from '@spartan-ng/brain/sheet';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';

/**
 * Sheet — side-anchored panel for longer flows. Mirrors React `Sheet`.
 *
 * Behavior delegated to spartan brain `BrnSheet`. The slide direction lives on
 * the `<gr-sheet>` root (`side`); pass the same `side` to `<gr-sheet-content>`
 * for the matching layout classes. Panel markup lives inside
 * `<ng-template brnSheetContent>`.
 */
const meta: Meta<Sheet> = {
  title: 'Interaction/Overlays/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [
        Sheet,
        SheetTrigger,
        SheetContent,
        SheetHeader,
        SheetFooter,
        SheetTitle,
        SheetDescription,
        SheetClose,
        BrnSheetContent,
      ],
    }),
  ],
  argTypes: {},
};

export default meta;
type Story = StoryObj<Sheet>;

/** Workbench — right-anchored sheet with header, body and footer. */
export const Workbench: Story = {
  render: () => ({
    template: `
      <gr-sheet side="right">
        <button gr-sheet-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">
          Open sheet
        </button>
        <ng-template brnSheetContent>
          <gr-sheet-content side="right">
            <gr-sheet-header>
              <h2 gr-sheet-title>Edit settings</h2>
              <p gr-sheet-description>Adjust your preferences and save.</p>
            </gr-sheet-header>
            <div class="flex-1 px-4 text-sm text-muted-foreground">
              Panel body content.
            </div>
            <gr-sheet-footer>
              <button gr-sheet-close class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Save changes
              </button>
            </gr-sheet-footer>
          </gr-sheet-content>
        </ng-template>
      </gr-sheet>
    `,
  }),
};

/** Left — navigation-style sheet anchored to the left edge. */
export const Left: Story = {
  render: () => ({
    template: `
      <gr-sheet side="left">
        <button gr-sheet-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">
          Open menu
        </button>
        <ng-template brnSheetContent>
          <gr-sheet-content side="left">
            <gr-sheet-header>
              <h2 gr-sheet-title>Navigation</h2>
              <p gr-sheet-description>Jump to a section.</p>
            </gr-sheet-header>
          </gr-sheet-content>
        </ng-template>
      </gr-sheet>
    `,
  }),
};

/** Bottom — mobile-style sheet rising from the bottom edge. */
export const Bottom: Story = {
  render: () => ({
    template: `
      <gr-sheet side="bottom">
        <button gr-sheet-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">
          Open from bottom
        </button>
        <ng-template brnSheetContent>
          <gr-sheet-content side="bottom">
            <gr-sheet-header>
              <h2 gr-sheet-title>Quick actions</h2>
              <p gr-sheet-description>Pick an action below.</p>
            </gr-sheet-header>
          </gr-sheet-content>
        </ng-template>
      </gr-sheet>
    `,
  }),
};
