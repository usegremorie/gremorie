'use client';

import * as React from 'react';
import { Pause, Play, Rewind } from 'lucide-react';

import { cn } from '@gremorie/rx-core';
import { Button } from '@gremorie/rx-forms';

import {
  contextWindow,
  formatTime,
  shouldStop,
  toPercent,
  type MediaRange,
} from './media-range-player.logic';

export interface MediaRangePlayerHandle {
  seek(t: number): void;
  playRange(from: number, to: number): void;
  pause(): void;
}

export interface MediaRangePlayerLabels {
  playClip: string;
  playContext: string;
  pause: string;
  clip: string;
}

const DEFAULT_LABELS: MediaRangePlayerLabels = {
  playClip: 'Play clip',
  playContext: 'Play with context',
  pause: 'Pause',
  clip: 'clip',
};

export interface MediaRangePlayerProps extends Omit<
  React.ComponentProps<'div'>,
  'onTimeUpdate' | 'ref'
> {
  /** Media URL. Served with HTTP Range so seeking does not download the whole file. */
  src: string;
  /** Clip in/out, in seconds of the source. */
  range: MediaRange;
  /** Seconds shown and played around the clip. */
  context?: number;
  /** What to fetch before the first play or seek. Use 'none' when a page shows many players. */
  preload?: 'none' | 'metadata';
  labels?: Partial<MediaRangePlayerLabels>;
  onTimeUpdate?: (t: number) => void;
}

/**
 * MediaRangePlayer - a video player scoped to one clip of a longer source.
 *
 * Shows the clip as a highlighted band inside a context window, plays only the
 * clip or the clip plus context, and exposes an imperative handle (`seek`,
 * `playRange`, `pause`) so a sibling (e.g. WordTimeline) can drive it.
 */
export const MediaRangePlayer = React.forwardRef<
  MediaRangePlayerHandle,
  MediaRangePlayerProps
>(function MediaRangePlayer(
  {
    src,
    range,
    context = 30,
    preload = 'metadata',
    labels,
    onTimeUpdate,
    className,
    ...props
  },
  ref,
) {
  const video = React.useRef<HTMLVideoElement>(null);
  const stopAt = React.useRef<number | null>(null);
  const [time, setTime] = React.useState(range[0]);
  const [duration, setDuration] = React.useState<number | undefined>(undefined);
  const [playing, setPlaying] = React.useState(false);
  const l = { ...DEFAULT_LABELS, ...labels };
  const win = contextWindow(range, context, duration);
  const left = toPercent(range[0], win);
  const width = toPercent(range[1], win) - left;

  const playRange = React.useCallback((from: number, to: number) => {
    const v = video.current;
    if (!v) return;
    v.currentTime = from;
    stopAt.current = to;
    void v.play();
  }, []);

  React.useImperativeHandle(
    ref,
    () => ({
      seek: (t: number) => {
        if (video.current) video.current.currentTime = t;
      },
      playRange,
      pause: () => video.current?.pause(),
    }),
    [playRange],
  );

  const start = range[0];
  React.useEffect(() => {
    const v = video.current;
    if (v && v.readyState >= 1) v.currentTime = start;
  }, [start]);

  return (
    <div
      data-slot="media-range-player"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    >
      <video
        ref={video}
        src={src}
        preload={preload}
        playsInline
        className="aspect-video w-full rounded-md bg-muted"
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          e.currentTarget.currentTime = start;
        }}
        onTimeUpdate={(e) => {
          const t = e.currentTarget.currentTime;
          setTime(t);
          onTimeUpdate?.(t);
          if (shouldStop(t, stopAt.current)) {
            e.currentTarget.pause();
            stopAt.current = null;
          }
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div
        data-slot="media-range-player-track"
        className="relative h-2 rounded-full bg-muted"
      >
        <div
          data-slot="media-range-player-range"
          className="absolute inset-y-0 rounded-full bg-primary/40"
          style={{ left: `${left}%`, width: `${width}%` }}
        />
        <div
          data-slot="media-range-player-playhead"
          className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-foreground"
          style={{ left: `${toPercent(time, win)}%` }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {playing ? (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => video.current?.pause()}
          >
            <Pause />
            {l.pause}
          </Button>
        ) : (
          <Button size="sm" onClick={() => playRange(range[0], range[1])}>
            <Play />
            {l.playClip}
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={() => playRange(win[0], win[1])}
        >
          <Rewind />
          {l.playContext}
        </Button>
        <span className="ml-auto font-mono text-xs tabular-nums text-muted-foreground">
          {formatTime(time)} · {l.clip} {formatTime(range[0])} -{' '}
          {formatTime(range[1])}
        </span>
      </div>
    </div>
  );
});
