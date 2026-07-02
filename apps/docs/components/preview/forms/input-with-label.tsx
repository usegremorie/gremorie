'use client';

import { Input, Label } from '@gremorie/rx-forms';

export function InputWithLabelPreview() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  );
}
