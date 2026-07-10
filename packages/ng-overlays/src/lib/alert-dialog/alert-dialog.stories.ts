import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrnAlertDialogContent } from '@spartan-ng/brain/alert-dialog';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';

/**
 * AlertDialog — modal-blocking confirmation. Mirrors React `AlertDialog`.
 *
 * Behavior delegated to spartan brain `BrnAlertDialog`. Use for destructive or
 * irreversible actions where doing nothing would be wrong. The panel markup
 * lives inside `<ng-template brnAlertDialogContent>`.
 */
const meta: Meta<AlertDialog> = {
  title: 'Interaction/Overlays/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [
        AlertDialog,
        AlertDialogTrigger,
        AlertDialogContent,
        AlertDialogHeader,
        AlertDialogFooter,
        AlertDialogTitle,
        AlertDialogDescription,
        AlertDialogMedia,
        AlertDialogAction,
        AlertDialogCancel,
        BrnAlertDialogContent,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<AlertDialog>;

/** Workbench — a destructive confirmation with cancel + destructive action. */
export const Workbench: Story = {
  render: () => ({
    template: `
      <gn-alert-dialog>
        <button gn-alert-dialog-trigger class="inline-flex h-9 items-center justify-center rounded-md bg-destructive px-4 text-sm font-medium text-destructive-foreground hover:bg-destructive/90">
          Delete account
        </button>
        <ng-template brnAlertDialogContent>
          <gn-alert-dialog-content>
            <gn-alert-dialog-header>
              <h2 gn-alert-dialog-title>Are you absolutely sure?</h2>
              <p gn-alert-dialog-description>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </p>
            </gn-alert-dialog-header>
            <gn-alert-dialog-footer>
              <button gn-alert-dialog-cancel>Cancel</button>
              <button gn-alert-dialog-action variant="destructive">Delete</button>
            </gn-alert-dialog-footer>
          </gn-alert-dialog-content>
        </ng-template>
      </gn-alert-dialog>
    `,
  }),
};

/** Small — `size="sm"` narrows the panel and stacks the footer into 2 columns. */
export const Small: Story = {
  render: () => ({
    template: `
      <gn-alert-dialog>
        <button gn-alert-dialog-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">
          Confirm
        </button>
        <ng-template brnAlertDialogContent>
          <gn-alert-dialog-content size="sm">
            <gn-alert-dialog-header>
              <gn-alert-dialog-media>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" /><path d="M12 17h.01" />
                </svg>
              </gn-alert-dialog-media>
              <h2 gn-alert-dialog-title>Discard changes?</h2>
              <p gn-alert-dialog-description>Your edits will be lost.</p>
            </gn-alert-dialog-header>
            <gn-alert-dialog-footer>
              <button gn-alert-dialog-cancel>Keep</button>
              <button gn-alert-dialog-action>Discard</button>
            </gn-alert-dialog-footer>
          </gn-alert-dialog-content>
        </ng-template>
      </gn-alert-dialog>
    `,
  }),
};
