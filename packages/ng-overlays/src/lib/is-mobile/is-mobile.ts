import { DestroyRef, inject, signal, type Signal } from '@angular/core';

/**
 * True below `breakpoint` (default 768px, Tailwind's `md`). Use it to swap a
 * desktop overlay (Popover, Dialog) for a bottom `gr-drawer` on small screens.
 * Call it in an injection context; it stops listening when that context is
 * destroyed. False where there is no `window` (server rendering).
 */
export function injectIsMobile(breakpoint = 768): Signal<boolean> {
  const isMobile = signal(false);
  if (typeof window === 'undefined' || !window.matchMedia) {
    return isMobile.asReadonly();
  }
  const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
  const update = () => isMobile.set(mql.matches);
  update();
  mql.addEventListener('change', update);
  inject(DestroyRef).onDestroy(() => mql.removeEventListener('change', update));
  return isMobile.asReadonly();
}
