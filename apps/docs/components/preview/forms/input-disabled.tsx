'use client';

import { Input } from '@gremorie/rx-forms';

export function InputDisabledPreview() {
  return (
    <div className="w-full max-w-sm">
      <Input disabled placeholder="Disabled input" defaultValue="Read only" />
    </div>
  );
}
