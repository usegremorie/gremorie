'use client';

import { Label, RadioGroup, RadioGroupItem } from '@gremorie/rx-forms';

export function RadioGroupWithDescriptionPreview() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-start gap-3">
        <RadioGroupItem value="default" id="rg-default" className="mt-0.5" />
        <div className="grid gap-1">
          <Label htmlFor="rg-default">Default</Label>
          <p className="text-sm text-muted-foreground">
            Balanced spacing for most layouts.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <RadioGroupItem
          value="comfortable"
          id="rg-comfortable"
          className="mt-0.5"
        />
        <div className="grid gap-1">
          <Label htmlFor="rg-comfortable">Comfortable</Label>
          <p className="text-sm text-muted-foreground">
            Roomier rows for dense data tables.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <RadioGroupItem value="compact" id="rg-compact" className="mt-0.5" />
        <div className="grid gap-1">
          <Label htmlFor="rg-compact">Compact</Label>
          <p className="text-sm text-muted-foreground">
            Tighter rows to fit more on screen.
          </p>
        </div>
      </div>
    </RadioGroup>
  );
}
