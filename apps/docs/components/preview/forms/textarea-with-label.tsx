'use client';

import { Label, Textarea } from '@gremorie/rx-forms';

export function TextareaWithLabelPreview() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="Type your message here." />
    </div>
  );
}
