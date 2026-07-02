'use client';

import { Input, Label } from '@gremorie/rx-forms';

export function InputFilePreview() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="attachment">Attachment</Label>
      <Input id="attachment" type="file" />
    </div>
  );
}
