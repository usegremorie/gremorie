import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrnDialogContent } from '@spartan-ng/brain/dialog';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

/**
 * Dialog — modal overlay anchored at viewport center.
 *
 * Mirrors React `Dialog`. Behavior delegated to spartan brain `BrnDialog`
 * (CDK overlay). The panel markup lives inside a
 * `<ng-template brnDialogContent>` placed within `<gr-dialog>`.
 */
const meta: Meta<Dialog> = {
  title: 'Interaction/Overlays/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [
        Dialog,
        DialogTrigger,
        DialogContent,
        DialogHeader,
        DialogFooter,
        DialogTitle,
        DialogDescription,
        DialogClose,
        BrnDialogContent,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<Dialog>;

/** Workbench — trigger opens a centered dialog with header, body and footer. */
export const Workbench: Story = {
  render: () => ({
    template: `
      <gr-dialog>
        <button gr-dialog-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">
          Edit profile
        </button>
        <ng-template brnDialogContent>
          <gr-dialog-content>
            <gr-dialog-header>
              <h2 gr-dialog-title>Edit profile</h2>
              <p gr-dialog-description>
                Make changes to your profile here. Click save when you're done.
              </p>
            </gr-dialog-header>
            <div class="grid gap-3 text-sm text-muted-foreground">
              Form fields go here.
            </div>
            <gr-dialog-footer [showCloseButton]="true" />
          </gr-dialog-content>
        </ng-template>
      </gr-dialog>
    `,
  }),
};

/** WithoutCloseButton — hide the corner X (force an explicit action). */
export const WithoutCloseButton: Story = {
  render: () => ({
    template: `
      <gr-dialog>
        <button gr-dialog-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">
          Open
        </button>
        <ng-template brnDialogContent>
          <gr-dialog-content [showCloseButton]="false">
            <gr-dialog-header>
              <h2 gr-dialog-title>No corner close</h2>
              <p gr-dialog-description>Use the footer button to dismiss.</p>
            </gr-dialog-header>
            <gr-dialog-footer>
              <button gr-dialog-close class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Done
              </button>
            </gr-dialog-footer>
          </gr-dialog-content>
        </ng-template>
      </gr-dialog>
    `,
  }),
};
