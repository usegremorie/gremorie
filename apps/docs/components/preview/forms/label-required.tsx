'use client';

import { Input, Label } from '@gremorie/rx-forms';

export function LabelRequiredPreview() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="full-name">
        Full name
        <span className="text-destructive">*</span>
      </Label>
      <Input id="full-name" required placeholder="Ada Lovelace" />
    </div>
  );
}
