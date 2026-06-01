import type { Meta, StoryObj } from '@storybook/react';
import { Trash2 } from 'lucide-react';

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
import { Button } from '@gremorie/rx-forms';

/**
 * # AlertDialog
 *
 * A modal, blocking confirmation dialog — a faithful shadcn port over Radix
 * AlertDialog. Unlike `Dialog`, it does not close on overlay click or escape by
 * default and forces the user to choose. Reserve it for destructive or
 * irreversible actions (delete, discard, account removal).
 *
 * ## Anatomy
 *
 * - **AlertDialog** — Radix root holding open state.
 * - **AlertDialogTrigger** — element that opens the dialog.
 * - **AlertDialogContent** — centered, portalled panel (`size` `default | sm`).
 * - **AlertDialogHeader** — groups media, title and description.
 * - **AlertDialogMedia** — optional icon container above the title.
 * - **AlertDialogTitle** / **AlertDialogDescription** — accessible headline + body.
 * - **AlertDialogFooter** — action row.
 * - **AlertDialogAction** / **AlertDialogCancel** — confirm / dismiss buttons (delegate to `Button`).
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `open` | `boolean` | — | Controlled open state. |
 * | `defaultOpen` | `boolean` | `false` | Uncontrolled initial state. |
 * | `onOpenChange` | `(open: boolean) => void` | — | Open-state callback. |
 *
 * `AlertDialogContent` adds `size?: "default" | "sm"`. `AlertDialogAction` and
 * `AlertDialogCancel` accept the `Button` `variant` and `size` props.
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `AlertDialogTrigger` | Opens the dialog. |
 * | `AlertDialogContent` | Portalled, centered panel with overlay. |
 * | `AlertDialogHeader` | Header layout wrapper. |
 * | `AlertDialogMedia` | Optional icon slot. |
 * | `AlertDialogTitle` | Headline. |
 * | `AlertDialogDescription` | Body text. |
 * | `AlertDialogFooter` | Action row. |
 * | `AlertDialogAction` | Confirm button (`variant="default"`). |
 * | `AlertDialogCancel` | Dismiss button (`variant="outline"`). |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--background` | Content surface |
 * | `--border` | Content border |
 * | `--muted` | `AlertDialogMedia` background |
 * | `--destructive` | Destructive action button |
 */
const meta = {
  title: 'Interaction/Overlays/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Destructive confirmation — the canonical use case. */
export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes the project and all of its data. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/** With a leading media icon above the title. */
export const WithMedia: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Remove account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete account</AlertDialogTitle>
          <AlertDialogDescription>
            Your account and every workspace you own will be removed forever.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep account</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/** Compact `size="sm"` content with a two-column footer grid. */
export const Small: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Discard changes</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Discard changes?</AlertDialogTitle>
          <AlertDialogDescription>
            Unsaved edits will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep editing</AlertDialogCancel>
          <AlertDialogAction>Discard</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
