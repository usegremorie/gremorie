import type { Meta, StoryObj } from '@storybook/react';

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
import { Button, Input, Label } from '@gremorie/rx-forms';

/**
 * # Dialog
 *
 * A modal overlay anchored at viewport center — a faithful shadcn port over
 * Radix Dialog. Use it for focused decisions or short flows that must interrupt
 * the user: confirmations, single-step forms, detail cards. For longer flows
 * prefer `Sheet`; for inline contextual content use `Popover`.
 *
 * ## Anatomy
 *
 * ```text
 * Dialog                       Radix root holding open state
 * ├─ DialogTrigger             element that opens the dialog
 * └─ DialogContent             centered, portalled panel with overlay + close button
 *    ├─ DialogHeader           wraps title + description
 *    │  ├─ DialogTitle         accessible headline
 *    │  └─ DialogDescription   accessible body text
 *    └─ DialogFooter           action row (optional built-in close button)
 *       └─ DialogClose         closes the dialog from any descendant
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `open` | `boolean` | — | Controlled open state. |
 * | `defaultOpen` | `boolean` | `false` | Uncontrolled initial state. |
 * | `onOpenChange` | `(open: boolean) => void` | — | Open-state callback. |
 * | `modal` | `boolean` | `true` | Blocks interaction with the page behind. |
 *
 * `DialogContent` adds `showCloseButton?: boolean` (default `true`).
 * `DialogFooter` adds `showCloseButton?: boolean` (default `false`).
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `DialogTrigger` | Opens the dialog. |
 * | `DialogContent` | Portalled, centered panel. |
 * | `DialogHeader` | Header layout wrapper. |
 * | `DialogTitle` | Headline. |
 * | `DialogDescription` | Body text. |
 * | `DialogFooter` | Action row. |
 * | `DialogClose` | Closes the dialog. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--background` | Content surface |
 * | `--border` | Content border |
 * | `--ring` | Close-button focus ring |
 * | `--accent` | Close-button open state |
 */
const meta = {
  title: 'Interaction/Overlays/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A short edit form with header, fields and a footer action row. */
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="Ada Lovelace" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" defaultValue="@ada" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** Plain confirmation with the built-in footer close button. */
export const Confirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Show details</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subscription active</DialogTitle>
          <DialogDescription>
            Your Pro plan is active and renews on the 1st of each month.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
};

/** Content with the corner close button hidden (`showCloseButton={false}`). */
export const WithoutCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>No corner close</DialogTitle>
          <DialogDescription>
            The user must use an explicit action to dismiss.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
