'use client';

import { Input, Label } from '@gremorie/rx-forms';

export function InputInvalidPreview() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="invalid-email">Email</Label>
      <Input
        id="invalid-email"
        type="email"
        defaultValue="not-an-email"
        aria-invalid="true"
        aria-describedby="invalid-email-error"
      />
      <p id="invalid-email-error" className="text-sm text-destructive">
        Enter a valid email address.
      </p>
    </div>
  );
}
