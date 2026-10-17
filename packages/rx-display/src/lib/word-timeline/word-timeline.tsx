'use client';

import * as React from 'react';

import { cn } from '@gremorie/rx-core';
import { ToggleGroup, ToggleGroupItem } from '@gremorie/rx-forms';

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
}

const DEFAULT_LABELS: WordTimelineLabels = {
  group: 'Transcript words',
  seek: 'Seek',
  setIn: 'Set in',
  setOut: 'Set out',
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
}

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
  className,
  ...props
}: WordTimelineProps) {
  const [mode, setMode] = React.useState<TimelineMode>('seek');
  const l = { ...DEFAULT_LABELS, ...labels };
  const turns = React.useMemo(() => speakerTurns(words), [words]);
  const current =
    currentTime === undefined ? -1 : activeIndex(words, currentTime);

  const click = (i: number) => {
    if (mode === 'seek') onSeek?.(words[i].start);
    else onValueChange?.(setBoundary(words, value, i, mode));
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
        role="group"
        aria-label={l.group}
        className="max-h-64 overflow-y-auto rounded-md border p-2 text-sm leading-7 text-foreground"
      >
        {words.map((w, i) => (
          <React.Fragment key={`${w.start}-${i}`}>
            {turns.has(i) && w.speaker ? (
              <span
                data-slot="word-timeline-speaker"
                className="mr-1 rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground"
              >
                {speakerNames?.[w.speaker] ?? w.speaker}
              </span>
            ) : null}
            <button
              type="button"
              data-slot="word-timeline-word"
              data-in-range={inRange(w, value)}
              data-current={i === current}
              onClick={() => click(i)}
              className={cn(
                'rounded px-0.5 outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring',
                'data-[in-range=true]:bg-primary/15 data-[current=true]:underline data-[current=true]:decoration-2',
              )}
            >
              {w.w}
            </button>{' '}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
