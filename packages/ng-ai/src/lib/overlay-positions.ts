import type { ConnectedPosition } from '@angular/cdk/overlay';

/**
 * Where a menu or listbox opens relative to its trigger: below and aligned to
 * the trigger's start, flipping above when it does not fit. Rendered in the
 * CDK overlay (outside the component), like the React edition's Radix portal,
 * so an overflow-hidden ancestor (the Assistant card) never clips it.
 */
export const MENU_BELOW_START: ConnectedPosition[] = [
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: 4,
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: -4,
  },
];

/** As MENU_BELOW_START, aligned to the trigger's end (menus at the right edge). */
export const MENU_BELOW_END: ConnectedPosition[] = [
  {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
    offsetY: 4,
  },
  {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetY: -4,
  },
];
