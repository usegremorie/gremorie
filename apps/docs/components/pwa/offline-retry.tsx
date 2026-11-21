import { Button } from '@gremorie/rx-forms';
import { RotateCwIcon } from 'lucide-react';

/**
 * Reloads the URL the reader asked for (the offline page is served there).
 * A GET form with no action submits to the current URL, so the button works
 * without JavaScript: the page's own chunks are not precached and may be
 * missing offline.
 */
export function OfflineRetry({ label }: { label: string }) {
  return (
    <form method="get">
      <Button type="submit">
        <RotateCwIcon aria-hidden="true" />
        {label}
      </Button>
    </form>
  );
}
