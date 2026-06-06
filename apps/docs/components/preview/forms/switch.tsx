'use client';

import { Label, Switch } from '@gremorie/rx-forms';

export function SwitchPreview() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="sw-demo" defaultChecked />
      <Label htmlFor="sw-demo">Stream tokens</Label>
    </div>
  );
}
