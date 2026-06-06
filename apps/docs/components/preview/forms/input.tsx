'use client';

import { Input, Label } from '@gremorie/rx-forms';

export function InputPreview() {
  return (
    <div className="flex max-w-xs flex-col gap-2">
      <Label htmlFor="email-input">Email</Label>
      <Input id="email-input" type="email" placeholder="you@example.com" />
    </div>
  );
}
