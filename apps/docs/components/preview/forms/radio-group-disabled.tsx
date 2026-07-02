'use client';

import { Label, RadioGroup, RadioGroupItem } from '@gremorie/rx-forms';

export function RadioGroupDisabledPreview() {
  return (
    <RadioGroup defaultValue="standard">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="standard" id="rg-standard" />
        <Label htmlFor="rg-standard">Standard shipping</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="express" id="rg-express" disabled />
        <Label htmlFor="rg-express">Express (currently unavailable)</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="overnight" id="rg-overnight" />
        <Label htmlFor="rg-overnight">Overnight</Label>
      </div>
    </RadioGroup>
  );
}
