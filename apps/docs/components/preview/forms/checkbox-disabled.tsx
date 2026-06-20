'use client';

import { Checkbox, Label } from '@gremorie/rx-forms';

export function CheckboxDisabledPreview() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="cb-disabled-off" disabled />
        <Label htmlFor="cb-disabled-off">Disabled, unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-disabled-on" disabled defaultChecked />
        <Label htmlFor="cb-disabled-on">Disabled, checked</Label>
      </div>
    </div>
  );
}
