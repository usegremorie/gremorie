'use client';

import { Button } from '@gremorie/rx-forms';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@gremorie/rx-overlays';

const directions = ['top', 'bottom', 'left', 'right'] as const;

export function DrawerDirectionsPreview() {
  return (
    <div className="flex flex-wrap gap-2">
      {directions.map((direction) => (
        <Drawer key={direction} direction={direction}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="capitalize">
              {direction}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="capitalize">
                {direction} drawer
              </DrawerTitle>
              <DrawerDescription>
                This drawer slides in from the {direction} edge with native
                drag-to-dismiss.
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  );
}
