'use client';

import { Button } from '@gremorie/rx-forms';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@gremorie/rx-overlays';

export function SheetPreview() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Narrow down the registry by category and edition.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
