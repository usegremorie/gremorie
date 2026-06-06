'use client';

import { Button } from '@gremorie/rx-forms';
import { Toaster, toast } from '@gremorie/rx-overlays';

export function SonnerPreview() {
  return (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast('Primitive added', {
            description: 'rx-message is now available in your project.',
          })
        }
      >
        Show toast
      </Button>
      <Toaster />
    </>
  );
}
