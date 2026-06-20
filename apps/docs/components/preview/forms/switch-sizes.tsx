'use client';

import { Label, Switch } from '@gremorie/rx-forms';

export function SwitchSizesPreview() {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <Switch id="sw-sm" size="sm" defaultChecked />
        <Label htmlFor="sw-sm">Small</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="sw-default" size="default" defaultChecked />
        <Label htmlFor="sw-default">Default</Label>
      </div>
    </div>
  );
}
