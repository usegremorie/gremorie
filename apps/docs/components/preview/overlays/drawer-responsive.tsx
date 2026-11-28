'use client';

import { Button } from '@gremorie/rx-forms';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useIsMobile,
} from '@gremorie/rx-overlays';

const sizes = ['Small', 'Medium', 'Large'];

function Options() {
  return (
    <div className="grid gap-1 p-1">
      {sizes.map((size) => (
        <Button className="justify-start" key={size} variant="ghost">
          {size}
        </Button>
      ))}
    </div>
  );
}

/** A Popover from md up, a bottom Drawer below it: same trigger, same body. */
export function DrawerResponsivePreview() {
  const isMobile = useIsMobile();
  const trigger = <Button variant="outline">Text size</Button>;

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Text size</DrawerTitle>
            <DrawerDescription>Applies to every page.</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <Options />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-1">
        <Options />
      </PopoverContent>
    </Popover>
  );
}
