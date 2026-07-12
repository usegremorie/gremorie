import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrnSheetContent } from '@spartan-ng/brain/sheet';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer';

/**
 * Drawer — bottom-up sheet for mobile contexts. Mirrors React `Drawer`.
 *
 * Divergence: there is no Angular `vaul`. The Angular edition is built on the
 * spartan brain `BrnSheet`, locked to the requested `direction` via the brain
 * `side` input. Native drag-to-dismiss gestures from vaul are not reproduced,
 * but the directional layout and bottom-only drag-handle visual match React.
 * Pass the same `direction` to `<gr-drawer>` (`side`) and `<gr-drawer-content>`.
 */
const meta: Meta<Drawer> = {
  title: 'Interaction/Overlays/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [
        Drawer,
        DrawerTrigger,
        DrawerContent,
        DrawerHeader,
        DrawerFooter,
        DrawerTitle,
        DrawerDescription,
        DrawerClose,
        BrnSheetContent,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<Drawer>;

/** Workbench — bottom drawer with header, body and footer. */
export const Workbench: Story = {
  render: () => ({
    template: `
      <gr-drawer side="bottom">
        <button gr-drawer-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">
          Open drawer
        </button>
        <ng-template brnSheetContent>
          <gr-drawer-content direction="bottom">
            <gr-drawer-header>
              <h2 gr-drawer-title>Move goal</h2>
              <p gr-drawer-description>Set your daily activity goal.</p>
            </gr-drawer-header>
            <div class="px-4 text-sm text-muted-foreground">Drawer body content.</div>
            <gr-drawer-footer>
              <button gr-drawer-close class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Submit
              </button>
              <button gr-drawer-close class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">
                Cancel
              </button>
            </gr-drawer-footer>
          </gr-drawer-content>
        </ng-template>
      </gr-drawer>
    `,
  }),
};

/** Right — drawer anchored to the right edge (`direction="right"`). */
export const Right: Story = {
  render: () => ({
    template: `
      <gr-drawer side="right">
        <button gr-drawer-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">
          Open from right
        </button>
        <ng-template brnSheetContent>
          <gr-drawer-content direction="right">
            <gr-drawer-header>
              <h2 gr-drawer-title>Details</h2>
              <p gr-drawer-description>Side-anchored drawer panel.</p>
            </gr-drawer-header>
          </gr-drawer-content>
        </ng-template>
      </gr-drawer>
    `,
  }),
};
