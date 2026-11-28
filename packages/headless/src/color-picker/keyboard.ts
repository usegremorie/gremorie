/** The result of a key on a one-channel slider. */
export type KeyStep =
  | { kind: 'delta'; steps: number }
  | { kind: 'min' }
  | { kind: 'max' };

interface Modifiers {
  shiftKey: boolean;
}

/**
 * Maps a key to a slider move, following the WAI-ARIA slider pattern: arrows
 * move one step (ten with Shift), Page Up/Down ten steps, Home/End the ends.
 * In RTL a horizontal track's left and right arrows swap.
 */
export function stepFromKey(
  key: string,
  { shiftKey }: Modifiers,
  {
    dir = 'ltr',
    orientation = 'horizontal',
  }: { dir?: 'ltr' | 'rtl'; orientation?: 'horizontal' | 'vertical' } = {},
): KeyStep | null {
  const one = shiftKey ? 10 : 1;
  const flip = dir === 'rtl' && orientation === 'horizontal' ? -1 : 1;
  switch (key) {
    case 'ArrowRight':
      return { kind: 'delta', steps: one * flip };
    case 'ArrowLeft':
      return { kind: 'delta', steps: -one * flip };
    case 'ArrowUp':
      return { kind: 'delta', steps: one };
    case 'ArrowDown':
      return { kind: 'delta', steps: -one };
    case 'PageUp':
      return { kind: 'delta', steps: 10 };
    case 'PageDown':
      return { kind: 'delta', steps: -10 };
    case 'Home':
      return { kind: 'min' };
    case 'End':
      return { kind: 'max' };
    default:
      return null;
  }
}

/** A move on the 2D area: steps or an end on one axis. */
export type AreaStep = { x?: number | 'min' | 'max'; y?: number | 'min' | 'max' };

/**
 * Maps a key to a move on the 2D area: left/right move x, up/down move y (one
 * step, ten with Shift), Page Up/Down page y, Home/End jump x to its ends.
 */
export function areaStepFromKey(
  key: string,
  { shiftKey }: Modifiers,
  { dir = 'ltr' }: { dir?: 'ltr' | 'rtl' } = {},
): AreaStep | null {
  const one = shiftKey ? 10 : 1;
  const flip = dir === 'rtl' ? -1 : 1;
  switch (key) {
    case 'ArrowRight':
      return { x: one * flip };
    case 'ArrowLeft':
      return { x: -one * flip };
    case 'ArrowUp':
      return { y: one };
    case 'ArrowDown':
      return { y: -one };
    case 'PageUp':
      return { y: 10 };
    case 'PageDown':
      return { y: -10 };
    case 'Home':
      return { x: 'min' };
    case 'End':
      return { x: 'max' };
    default:
      return null;
  }
}
