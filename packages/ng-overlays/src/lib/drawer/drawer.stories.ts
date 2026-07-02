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
 * Pass the same `direction` to `<gn-drawer>` (`side`) and `<gn-drawer-content>`.
 */
const meta: Meta<Drawer> = {
  title: 'Overlays/Drawer',
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
      <gn-drawer side="bottom">
        <button gn-drawer-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">
          Open drawer
        </button>
        <ng-template brnSheetContent>
          <gn-drawer-content direction="bottom">
            <gn-drawer-header>
              <h2 gn-drawer-title>Move goal</h2>
              <p gn-drawer-description>Set your daily activity goal.</p>
            </gn-drawer-header>
            <div class="px-4 text-sm text-muted-foreground">Drawer body content.</div>
            <gn-drawer-footer>
              <button gn-drawer-close class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Submit
              </button>
              <button gn-drawer-close class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">
                Cancel
              </button>
            </gn-drawer-footer>
          </gn-drawer-content>
        </ng-template>
      </gn-drawer>
    `,
  }),
};

/** Right — drawer anchored to the right edge (`direction="right"`). */
export const Right: Story = {
  render: () => ({
    template: `
      <gn-drawer side="right">
        <button gn-drawer-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">
          Open from right
        </button>
        <ng-template brnSheetContent>
          <gn-drawer-content direction="right">
            <gn-drawer-header>
              <h2 gn-drawer-title>Details</h2>
              <p gn-drawer-description>Side-anchored drawer panel.</p>
            </gn-drawer-header>
          </gn-drawer-content>
        </ng-template>
      </gn-drawer>
    `,
  }),
};
