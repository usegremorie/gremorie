'use client';

import { Label, Textarea } from '@gremorie/rx-forms';

export function TextareaInvalidPreview() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="bio">Bio</Label>
      <Textarea
        id="bio"
        aria-invalid="true"
        aria-describedby="bio-error"
        defaultValue=""
        placeholder="Tell us about yourself."
      />
      <p id="bio-error" className="text-sm text-destructive">
        Bio is required.
      </p>
    </div>
  );
}
