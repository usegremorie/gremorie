import type { Meta, StoryObj } from '@storybook/react';

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
import { Button, Input, Label } from '@gremorie/rx-forms';

/**
 * # Sheet
 *
 * A side-anchored panel for longer flows — a faithful shadcn port over Radix
 * Dialog with a directional slide animation. Use it for filters, settings panels
 * and multi-section edit forms: content too rich for a `Popover` but not
 * deserving the full focus of a `Dialog`. `right` is the default; `left` suits
 * navigation, `bottom` works on mobile, `top` is reserved for global notices.
 *
 * ## Anatomy
 *
 * ```text
 * Sheet                          Radix root holding open state
 * ├─ SheetTrigger                element that opens the sheet
 * └─ SheetContent                portalled sliding panel (side, showCloseButton)
 *    ├─ SheetHeader              wraps title + description
 *    │  ├─ SheetTitle            headline
 *    │  └─ SheetDescription      body text
 *    ├─ SheetClose               closes the sheet
 *    └─ SheetFooter              bottom action row
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `open` | `boolean` | — | Controlled open state. |
 * | `defaultOpen` | `boolean` | `false` | Uncontrolled initial state. |
 * | `onOpenChange` | `(open: boolean) => void` | — | Open-state callback. |
 * | `modal` | `boolean` | `true` | Block outside interaction while open. |
 *
 * `SheetContent` adds `side?: "top" | "right" | "bottom" | "left"` (default `"right"`)
 * and `showCloseButton?: boolean` (default `true`).
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `SheetTrigger` | Opens the sheet. |
 * | `SheetContent` | Sliding panel. |
 * | `SheetHeader` | Header wrapper. |
 * | `SheetTitle` | Headline. |
 * | `SheetDescription` | Body text. |
 * | `SheetFooter` | Action row. |
 * | `SheetClose` | Closes the sheet. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--background` | Panel surface |
 * | `--border` | Edge border |
 * | `--ring` | Close-button focus ring |
 * | `--secondary` | Close-button open state |
 */
const meta = {
  title: 'Interaction/Overlays/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default right-side edit panel. */
export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 px-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="Ada Lovelace" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" defaultValue="@ada" />
          </div>
        </div>
        <SheetFooter>
          <Button>Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

const SIDES = ['top', 'right', 'bottom', 'left'] as const;

/** All four `side` values from a single row of triggers. */
export const Sides: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline" className="capitalize">
              {side}
            </Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle className="capitalize">{side} sheet</SheetTitle>
              <SheetDescription>
                This panel slides in from the {side} edge.
              </SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
};
