'use client';

import { Checkbox, Label } from '@gremorie/rx-forms';

export function CheckboxStatesPreview() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="cb-unchecked" />
        <Label htmlFor="cb-unchecked">Unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-checked" defaultChecked />
        <Label htmlFor="cb-checked">Checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-indeterminate" defaultChecked="indeterminate" />
        <Label htmlFor="cb-indeterminate">Indeterminate</Label>
      </div>
    </div>
  );
}
