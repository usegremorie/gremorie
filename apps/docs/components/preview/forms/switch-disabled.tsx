'use client';

import { Label, Switch } from '@gremorie/rx-forms';

export function SwitchDisabledPreview() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="sw-disabled-off" disabled />
        <Label htmlFor="sw-disabled-off">Disabled, off</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="sw-disabled-on" disabled defaultChecked />
        <Label htmlFor="sw-disabled-on">Disabled, on</Label>
      </div>
    </div>
  );
}
