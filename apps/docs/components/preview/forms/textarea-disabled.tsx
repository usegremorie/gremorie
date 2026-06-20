'use client';

import { Textarea } from '@gremorie/rx-forms';

export function TextareaDisabledPreview() {
  return (
    <div className="w-full max-w-sm">
      <Textarea
        disabled
        placeholder="Disabled textarea"
        defaultValue="This field is read only."
      />
    </div>
  );
}
