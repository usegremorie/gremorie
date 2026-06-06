'use client';

import { Input, Label } from '@gremorie/rx-forms';

export function LabelPreview() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="lbl-demo">Display name</Label>
      <Input id="lbl-demo" placeholder="Type something..." />
    </div>
  );
}
