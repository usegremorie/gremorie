'use client';

import { Button } from '@gremorie/rx-forms';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@gremorie/rx-overlays';

export function DrawerPreview() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move to archive</DrawerTitle>
          <DrawerDescription>
            Archived items can be restored within 30 days.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Archive</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
