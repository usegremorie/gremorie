'use client';

import { Button } from '@gremorie/rx-forms';

export function ButtonDisabledPreview() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>Default</Button>
      <Button variant="outline" disabled>
        Outline
      </Button>
      <Button variant="destructive" disabled>
        Destructive
      </Button>
    </div>
  );
}
