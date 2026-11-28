import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Component } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
import { BrnSheetContent } from '@spartan-ng/brain/sheet';

import { injectIsMobile } from '../is-mobile';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover';

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
              <button gr-drawer-close class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
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

/**
 * Responsive — the same menu as a popover from `md` up and a bottom drawer
 * below it. `injectIsMobile()` (768px by default) picks the overlay; the
 * trigger and the body stay the same.
 */
@Component({
  selector: 'story-drawer-responsive',
  standalone: true,
  imports: [
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    BrnSheetContent,
    Popover,
    PopoverTrigger,
    PopoverContent,
    BrnPopoverContent,
    NgTemplateOutlet,
  ],
  template: `
    <ng-template #options>
      <div class="grid gap-1 p-1">
        @for (size of sizes; track size) {
          <button class="inline-flex h-9 items-center rounded-md px-3 text-sm hover:bg-accent">{{ size }}</button>
        }
      </div>
    </ng-template>
    @if (isMobile()) {
      <gr-drawer side="bottom">
        <button gr-drawer-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">Text size</button>
        <ng-template brnSheetContent>
          <gr-drawer-content direction="bottom">
            <gr-drawer-header>
              <h2 gr-drawer-title>Text size</h2>
              <p gr-drawer-description>Applies to every page.</p>
            </gr-drawer-header>
            <div class="px-4 pb-6"><ng-container [ngTemplateOutlet]="options" /></div>
          </gr-drawer-content>
        </ng-template>
      </gr-drawer>
    } @else {
      <gr-popover align="start">
        <gr-popover-trigger [content]="menu">Text size</gr-popover-trigger>
        <ng-template #menu brnPopoverContent>
          <gr-popover-content class="w-56 p-1"><ng-container [ngTemplateOutlet]="options" /></gr-popover-content>
        </ng-template>
      </gr-popover>
    }
  `,
})
class ResponsiveMenu {
  protected readonly isMobile = injectIsMobile();
  protected readonly sizes = ['Small', 'Medium', 'Large'];
}

export const Responsive: Story = {
  decorators: [moduleMetadata({ imports: [ResponsiveMenu] })],
  render: () => ({ template: `<story-drawer-responsive />` }),
};
