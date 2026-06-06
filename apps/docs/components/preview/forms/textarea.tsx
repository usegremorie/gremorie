'use client';

import { Textarea } from '@gremorie/rx-forms';

export function TextareaPreview() {
  return (
    <div className="max-w-md">
      <Textarea placeholder="Write a description..." rows={4} />
    </div>
  );
}
