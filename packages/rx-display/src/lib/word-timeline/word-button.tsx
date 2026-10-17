'use client';

import * as React from 'react';

import { cn } from '@gremorie/rx-core';

/** Where a word sits relative to the clip boundaries. */
export type WordEdge = 'start' | 'end' | 'both' | 'none';

export interface WordButtonProps {
  index: number;
  text: string;
  inRange: boolean;
  edge: WordEdge;
  current: boolean;
  /** The one word in the strip with `tabIndex=0` (roving tab stop). */
  focused: boolean;
  /** Screen-reader-only clip state, e.g. "clip start" or "in clip". */
  srText: string;
  /** Stable callbacks: the parent keeps them identical across renders. */
  onPick: (index: number) => void;
  onFocusIndex: (index: number) => void;
}

/**
 * One transcript word. Memoized with primitive props so a playhead tick only
 * re-renders the words whose state changed.
 */
export const WordButton = React.memo(function WordButton({
  index,
  text,
  inRange,
  edge,
  current,
  focused,
  srText,
  onPick,
  onFocusIndex,
}: WordButtonProps) {
  return (
    <button
      type="button"
      data-slot="word-timeline-word"
      data-index={index}
      data-in-range={inRange}
      data-edge={edge}
      data-current={current}
      aria-current={current ? 'true' : undefined}
      tabIndex={focused ? 0 : -1}
      onClick={() => onPick(index)}
      onFocus={() => onFocusIndex(index)}
      className={cn(
        'rounded border-primary px-0.5 outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring',
        'data-[in-range=true]:bg-primary/15 data-[in-range=true]:hover:bg-primary/25',
        'data-[edge=start]:rounded-l-none data-[edge=start]:border-l-2',
        'data-[edge=end]:rounded-r-none data-[edge=end]:border-r-2',
        'data-[edge=both]:rounded-none data-[edge=both]:border-x-2',
        'data-[current=true]:underline data-[current=true]:decoration-2',
      )}
    >
      {text}
      {srText ? <span className="sr-only">{`, ${srText}`}</span> : null}
    </button>
  );
});
