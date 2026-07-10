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
 * the `<gn-sheet>` root (`side`); pass the same `side` to `<gn-sheet-content>`
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
      <gn-sheet side="right">
        <button gn-sheet-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">
          Open sheet
        </button>
        <ng-template brnSheetContent>
          <gn-sheet-content side="right">
            <gn-sheet-header>
              <h2 gn-sheet-title>Edit settings</h2>
              <p gn-sheet-description>Adjust your preferences and save.</p>
            </gn-sheet-header>
            <div class="flex-1 px-4 text-sm text-muted-foreground">
              Panel body content.
            </div>
            <gn-sheet-footer>
              <button gn-sheet-close class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Save changes
              </button>
            </gn-sheet-footer>
          </gn-sheet-content>
        </ng-template>
      </gn-sheet>
    `,
  }),
};

/** Left — navigation-style sheet anchored to the left edge. */
export const Left: Story = {
  render: () => ({
    template: `
      <gn-sheet side="left">
        <button gn-sheet-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">
          Open menu
        </button>
        <ng-template brnSheetContent>
          <gn-sheet-content side="left">
            <gn-sheet-header>
              <h2 gn-sheet-title>Navigation</h2>
              <p gn-sheet-description>Jump to a section.</p>
            </gn-sheet-header>
          </gn-sheet-content>
        </ng-template>
      </gn-sheet>
    `,
  }),
};

/** Bottom — mobile-style sheet rising from the bottom edge. */
export const Bottom: Story = {
  render: () => ({
    template: `
      <gn-sheet side="bottom">
        <button gn-sheet-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">
          Open from bottom
        </button>
        <ng-template brnSheetContent>
          <gn-sheet-content side="bottom">
            <gn-sheet-header>
              <h2 gn-sheet-title>Quick actions</h2>
              <p gn-sheet-description>Pick an action below.</p>
            </gn-sheet-header>
          </gn-sheet-content>
        </ng-template>
      </gn-sheet>
    `,
  }),
};
