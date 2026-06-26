import type { Meta, StoryObj } from '@storybook/react';

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
import { Button } from '@gremorie/rx-forms';

/**
 * # Drawer
 *
 * A bottom-up sheet with native drag-to-dismiss gestures — built on `vaul`.
 * Slides up from the bottom by default and is ideal for mobile contexts:
 * confirmations, quick actions, simple forms. On `md`+ prefer `Dialog` or
 * `Sheet`, since bottom sheets don't reward desktop ergonomics.
 *
 * ## Anatomy
 *
 * ```text
 * Drawer                     vaul root holding open state + direction
 * ├─ DrawerTrigger           element that opens the drawer
 * └─ DrawerContent           portalled panel with a drag handle (bottom)
 *    ├─ DrawerHeader         wraps title + description
 *    │  ├─ DrawerTitle           accessible headline
 *    │  └─ DrawerDescription     accessible body text
 *    └─ DrawerFooter         bottom action row
 *       └─ DrawerClose       closes the drawer
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `open` | `boolean` | — | Controlled open state. |
 * | `direction` | `"top" \| "bottom" \| "left" \| "right"` | `"bottom"` | Slide direction. |
 * | `shouldScaleBackground` | `boolean` | — | Scale the page behind while open. |
 * | `onOpenChange` | `(open: boolean) => void` | — | Open-state callback. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `DrawerTrigger` | Opens the drawer. |
 * | `DrawerContent` | Portalled sliding panel. |
 * | `DrawerHeader` | Header layout wrapper. |
 * | `DrawerTitle` | Headline. |
 * | `DrawerDescription` | Body text. |
 * | `DrawerFooter` | Action row. |
 * | `DrawerClose` | Closes the drawer. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--background` | Content surface |
 * | `--muted` | Drag handle |
 * | `--border` | Directional edge border |
 */
const meta = {
  title: 'Interaction/Overlays/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Bottom sheet with a drag handle, header, body and footer. */
export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Move goal</DrawerTitle>
            <DrawerDescription>
              Set your daily activity target.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 text-center text-4xl font-bold tabular-nums">
            350
            <span className="ml-1 text-base font-normal text-muted-foreground">
              cal/day
            </span>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

/** Top direction — slides down from the top edge. */
export const FromTop: Story = {
  render: () => (
    <Drawer direction="top">
      <DrawerTrigger asChild>
        <Button variant="outline">Open from top</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Notifications</DrawerTitle>
            <DrawerDescription>You have 3 unread messages.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Dismiss</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

/** Right direction — drawer attached to the right edge. */
export const FromRight: Story = {
  render: () => (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline">Open from right</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Refine the current view.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Apply</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
