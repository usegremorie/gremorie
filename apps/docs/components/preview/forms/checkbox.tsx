'use client';

import { Checkbox, Label } from '@gremorie/rx-forms';

export function CheckboxPreview() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="cb-demo" defaultChecked />
      <Label htmlFor="cb-demo">Subscribe to the changelog</Label>
    </div>
  );
}
