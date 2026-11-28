import * as React from 'react';

/**
 * True below `breakpoint` (default 768px, Tailwind's `md`). Use it to swap a
 * desktop overlay (Popover, Dialog) for a bottom `Drawer` on small screens.
 * Always false on the server and on the first client render, so the markup
 * hydrates; it updates as soon as the media query is read.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const query = `(max-width: ${breakpoint - 1}px)`;
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query],
  );
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
