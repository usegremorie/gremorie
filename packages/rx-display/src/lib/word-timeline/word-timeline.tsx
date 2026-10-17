'use client';

import * as React from 'react';

import { cn } from '@gremorie/rx-core';
import { ToggleGroup, ToggleGroupItem } from '@gremorie/rx-forms';

import { WordButton, type WordEdge } from './word-button';
import {
  activeIndex,
  inRange,
  setBoundary,
  speakerTurns,
  type TimelineMode,
  type TimelineWord,
} from './word-timeline.logic';

export interface WordTimelineLabels {
  group: string;
  seek: string;
  setIn: string;
  setOut: string;
  /** Screen-reader-only state of the first word in the clip. */
  clipStart: string;
  /** Screen-reader-only state of the last word in the clip. */
  clipEnd: string;
  /** Screen-reader-only state of the words between start and end. */
  inClip: string;
}

const DEFAULT_LABELS: WordTimelineLabels = {
  group: 'Transcript words',
  seek: 'Seek',
  setIn: 'Set in',
  setOut: 'Set out',
  clipStart: 'clip start',
  clipEnd: 'clip end',
  inClip: 'in clip',
};

export interface WordTimelineProps extends Omit<
  React.ComponentProps<'div'>,
  'onChange'
> {
  words: TimelineWord[];
  /** Selected [in, out] in seconds. */
  value: [number, number];
  onValueChange?: (value: [number, number]) => void;
  /** Playhead, to highlight the spoken word. */
  currentTime?: number;
  /** Called with the word start when a word is clicked in seek mode. */
  onSeek?: (t: number) => void;
  speakerNames?: Record<string, string>;
  labels?: Partial<WordTimelineLabels>;
  /**
   * Scroll the strip to keep the spoken word visible while it plays. Skipped
   * while focus is inside the strip. Default `true`.
   */
  followPlayhead?: boolean;
}

/** Last word whose start is at or before `t` (0 before the first word). */
const lastStarted = (words: TimelineWord[], t: number): number => {
  let lo = 0;
  let hi = words.length - 1;
  let found = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (words[mid].start <= t) {
      found = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return found;
};

const edgeOf = (i: number, first: number, last: number): WordEdge => {
  if (first < 0 || i < first || i > last) return 'none';
  if (i === first && i === last) return 'both';
  if (i === first) return 'start';
  if (i === last) return 'end';
  return 'none';
};

/**
 * WordTimeline - transcript words as a clickable strip for picking a clip's
 * in and out points at word boundaries.
 */
export function WordTimeline({
  words,
  value,
  onValueChange,
  currentTime,
  onSeek,
  speakerNames,
  labels,
  followPlayhead = true,
  className,
  ...props
}: WordTimelineProps) {
  const [mode, setMode] = React.useState<TimelineMode>('seek');
  const [focusIndex, setFocusIndex] = React.useState<number | null>(null);
  const stripRef = React.useRef<HTMLDivElement>(null);
  const l = { ...DEFAULT_LABELS, ...labels };
  const turns = React.useMemo(() => speakerTurns(words), [words]);
  const current =
    currentTime === undefined ? -1 : activeIndex(words, currentTime);

  const [vIn, vOut] = value;
  const [firstIn, lastIn] = React.useMemo(() => {
    let first = -1;
    let last = -1;
    words.forEach((w, i) => {
      if (inRange(w, [vIn, vOut])) {
        if (first < 0) first = i;
        last = i;
      }
    });
    return [first, last];
  }, [words, vIn, vOut]);

  // Roving tab stop: the last focused word, else the word at the playhead (the
  // last one started, so it holds still in gaps), else the first.
  const tabStop =
    focusIndex !== null && focusIndex < words.length
      ? focusIndex
      : currentTime === undefined
        ? 0
        : lastStarted(words, currentTime);

  // Latest props for the stable word callbacks (keeps WordButton memoized).
  const latest = React.useRef({ mode, value, words, onSeek, onValueChange });
  React.useLayoutEffect(() => {
    latest.current = { mode, value, words, onSeek, onValueChange };
  });

  const onPick = React.useCallback((i: number) => {
    const s = latest.current;
    const word = s.words[i];
    if (!word) return;
    if (s.mode === 'seek') s.onSeek?.(word.start);
    else s.onValueChange?.(setBoundary(s.words, s.value, i, s.mode));
  }, []);

  const focusWord = (i: number) =>
    stripRef.current
      ?.querySelector<HTMLElement>(`[data-index="${i}"]`)
      ?.focus();

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const i = Number((e.target as HTMLElement).dataset['index']);
    const n = words.length;
    if (Number.isNaN(i) || n === 0) return;
    let next: number;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = Math.min(i + 1, n - 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = Math.max(i - 1, 0);
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = n - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    focusWord(next);
  };

  // Keep the spoken word visible, scrolling only the strip (never the page),
  // and never while the user is working inside the strip.
  React.useEffect(() => {
    const strip = stripRef.current;
    if (!followPlayhead || current < 0 || !strip) return;
    if (strip.contains(document.activeElement)) return;
    const word = strip.querySelector<HTMLElement>(`[data-index="${current}"]`);
    if (!word) return;
    const s = strip.getBoundingClientRect();
    const w = word.getBoundingClientRect();
    if (w.top < s.top) strip.scrollTop += w.top - s.top;
    else if (w.bottom > s.bottom) strip.scrollTop += w.bottom - s.bottom;
  }, [current, followPlayhead]);

  const srFor = (edge: WordEdge, inR: boolean) => {
    if (!inR) return '';
    if (edge === 'both') return `${l.clipStart}, ${l.clipEnd}`;
    if (edge === 'start') return l.clipStart;
    if (edge === 'end') return l.clipEnd;
    return l.inClip;
  };

  return (
    <div
      data-slot="word-timeline"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    >
      <ToggleGroup
        type="single"
        size="sm"
        variant="outline"
        value={mode}
        onValueChange={(v) => v && setMode(v as TimelineMode)}
      >
        <ToggleGroupItem type="button" value="seek">
          {l.seek}
        </ToggleGroupItem>
        <ToggleGroupItem type="button" value="in">
          {l.setIn}
        </ToggleGroupItem>
        <ToggleGroupItem type="button" value="out">
          {l.setOut}
        </ToggleGroupItem>
      </ToggleGroup>
      <div
        ref={stripRef}
        role="group"
        aria-label={l.group}
        onKeyDown={onKeyDown}
        className="max-h-64 overflow-y-auto rounded-md border p-2 text-sm leading-7 text-foreground"
      >
        {words.map((w, i) => {
          const inR = firstIn >= 0 && i >= firstIn && i <= lastIn;
          const edge = edgeOf(i, firstIn, lastIn);
          return (
            <React.Fragment key={`${w.start}-${i}`}>
              {turns.has(i) && w.speaker ? (
                <span
                  data-slot="word-timeline-speaker"
                  className="mr-1 rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground"
                >
                  {speakerNames?.[w.speaker] ?? w.speaker}
                </span>
              ) : null}
              <WordButton
                index={i}
                text={w.w}
                inRange={inR}
                edge={edge}
                current={i === current}
                focused={i === tabStop}
                srText={srFor(edge, inR)}
                onPick={onPick}
                onFocusIndex={setFocusIndex}
              />{' '}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
