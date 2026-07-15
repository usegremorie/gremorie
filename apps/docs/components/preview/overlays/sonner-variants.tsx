'use client';

import { Button } from '@gremorie/rx-forms';
import { Toaster, toast } from '@gremorie/rx-overlays';

export function SonnerVariantsPreview() {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() =>
            toast('Event created', {
              description: 'Friday, June 20 at 10:00 AM',
            })
          }
        >
          Default
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.success('Changes saved', {
              description: 'Your profile is up to date.',
            })
          }
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.error('Save failed', {
              description: 'Check your connection and try again.',
            })
          }
        >
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast('Item archived', {
              description: 'You can restore it within 30 days.',
              action: {
                label: 'Undo',
                onClick: () => toast('Restored'),
              },
            })
          }
        >
          With action
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
              loading: 'Publishing post...',
              success: 'Post is live',
              error: 'Publish failed',
            })
          }
        >
          Promise
        </Button>
      </div>
      <Toaster />
    </>
  );
}
