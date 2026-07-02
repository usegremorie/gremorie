'use client';

import { Checkbox, Label } from '@gremorie/rx-forms';

export function CheckboxWithLabelPreview() {
  return (
    <div className="flex items-start gap-3">
      <Checkbox id="cb-terms" defaultChecked />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor="cb-terms">Accept terms and conditions</Label>
        <p className="text-sm text-muted-foreground">
          You agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
