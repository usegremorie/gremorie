'use client';

import { Button } from '@gremorie/rx-forms';
import { Inbox, Plus } from 'lucide-react';

/**
 * Empty state block: dashed border, centered icon, headline,
 * description, and dual CTA. Composes Button + lucide icons.
 */
export function EmptyState() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 rounded-lg border border-dashed bg-muted/20 px-6 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <Inbox className="size-7 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="flex max-w-md flex-col gap-2">
        <h2 className="text-xl font-semibold">No items yet</h2>
        <p className="text-sm text-muted-foreground">
          You haven&apos;t created any items. Once you do, they will show up
          here.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button>
          <Plus aria-hidden="true" />
          Create item
        </Button>
        <Button variant="ghost">Browse templates</Button>
      </div>
    </div>
  );
}
