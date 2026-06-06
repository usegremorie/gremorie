'use client';

import { Label, RadioGroup, RadioGroupItem } from '@gremorie/rx-forms';

export function RadioGroupPreview() {
  return (
    <RadioGroup defaultValue="react" className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="rg-react" value="react" />
        <Label htmlFor="rg-react">React</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="rg-ng" value="angular" />
        <Label htmlFor="rg-ng">Angular</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="rg-both" value="both" />
        <Label htmlFor="rg-both">Both</Label>
      </div>
    </RadioGroup>
  );
}
