'use client';

import { Button, Input, Label } from '@gremorie/rx-forms';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@gremorie/rx-overlays';

export function PopoverFormPreview() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Set dimensions</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the width and height for the layer.
          </PopoverDescription>
        </PopoverHeader>
        <div className="mt-3 grid gap-3">
          <div className="grid grid-cols-3 items-center gap-3">
            <Label htmlFor="width">Width</Label>
            <Input id="width" defaultValue="320" className="col-span-2 h-8" />
          </div>
          <div className="grid grid-cols-3 items-center gap-3">
            <Label htmlFor="height">Height</Label>
            <Input id="height" defaultValue="240" className="col-span-2 h-8" />
          </div>
          <Button size="sm" className="mt-1 justify-self-end">
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
