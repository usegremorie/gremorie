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
  /** Move the playhead to `t` (seconds) and cancel any pending stop point. */
  seek(t: number): void;
  /** Play from `from` and pause exactly at `to` (seconds). */
  playRange(from: number, to: number): void;
  /** Pause and cancel any pending stop point. */
  pause(): void;
}

export interface MediaRangePlayerLabels {
  playClip: string;
  playContext: string;
  pause: string;
  clip: string;
  /** Accessible name of the video element. */
  video: string;
}

const DEFAULT_LABELS: MediaRangePlayerLabels = {
  playClip: 'Play clip',
  playContext: 'Play with context',
  pause: 'Pause',
  clip: 'clip',
  video: 'Clip preview',
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
  /**
   * Show the browser's native video controls (keyboard seeking, volume,
   * fullscreen) in addition to the clip controls.
   */
  controls?: boolean;
  labels?: Partial<MediaRangePlayerLabels>;
  onTimeUpdate?: (t: number) => void;
  /**
   * Merged onto the root. Inherited from the div props too; declared here so
   * the contract drift gate (which reads declared members) sees it.
   */
  className?: string;
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
    controls = false,
    labels,
    onTimeUpdate,
    className,
    ...props
  },
  ref,
) {
  const video = React.useRef<HTMLVideoElement>(null);
  /** Where playback must stop, or null for free play. */
  const stopAt = React.useRef<number | null>(null);
  /** A position requested before the metadata arrived; applied on loadedmetadata. */
  const pendingSeek = React.useRef<number | null>(null);
  /** Active requestAnimationFrame id of the stop watcher. */
  const frame = React.useRef<number | null>(null);
  const [time, setTime] = React.useState(range[0]);
  const [duration, setDuration] = React.useState<number | undefined>(undefined);
  const [playing, setPlaying] = React.useState(false);
  /** Latest onTimeUpdate, so the stop watcher reports without re-subscribing. */
  const onTime = React.useRef(onTimeUpdate);
  React.useEffect(() => {
    onTime.current = onTimeUpdate;
  });
  const l = { ...DEFAULT_LABELS, ...labels };
  const win = contextWindow(range, context, duration);
  const left = toPercent(range[0], win);
  const width = Math.max(0, toPercent(range[1], win) - left);

  const stopWatch = React.useCallback(() => {
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
  }, []);

  /** Pause at the stop point itself, not at the first event after it. */
  const checkStop = React.useCallback(
    (v: HTMLVideoElement): boolean => {
      const to = stopAt.current;
      if (to === null || !shouldStop(v.currentTime, to)) return false;
      stopAt.current = null;
      stopWatch();
      v.pause();
      v.currentTime = to;
      setTime(to);
      onTime.current?.(to);
      return true;
    },
    [stopWatch],
  );

  const startWatch = React.useCallback(() => {
    stopWatch();
    if (typeof requestAnimationFrame !== 'function') return;
    const tick = () => {
      frame.current = null;
      const v = video.current;
      if (!v || v.paused || stopAt.current === null) return;
      if (!checkStop(v)) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [checkStop, stopWatch]);

  const position = React.useCallback((t: number) => {
    const v = video.current;
    if (!v) return;
    if (v.readyState >= 1) {
      pendingSeek.current = null;
      v.currentTime = t;
    } else {
      pendingSeek.current = t;
    }
    setTime(t);
  }, []);

  const playRange = React.useCallback(
    (from: number, to: number) => {
      const v = video.current;
      if (!v) return;
      stopAt.current = to;
      position(from);
      const p = v.play();
      if (p) p.catch(() => undefined);
      // onPlay does not fire when the video is already playing, so arm the
      // frame watcher here too (startWatch restarts it, never doubles it).
      startWatch();
    },
    [position, startWatch],
  );

  const pause = React.useCallback(() => {
    stopAt.current = null;
    stopWatch();
    video.current?.pause();
  }, [stopWatch]);

  React.useImperativeHandle(
    ref,
    () => ({
      seek: (t: number) => {
        stopAt.current = null;
        stopWatch();
        position(t);
      },
      playRange,
      pause,
    }),
    [pause, playRange, position, stopWatch],
  );

  const start = range[0];
  React.useEffect(() => {
    const v = video.current;
    if (v && v.readyState >= 1) v.currentTime = start;
  }, [start]);

  // A position queued for the previous source must not leak into the new one.
  React.useEffect(() => {
    pendingSeek.current = null;
  }, [src]);

  React.useEffect(() => stopWatch, [stopWatch]);

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
        controls={controls}
        aria-label={l.video}
        playsInline
        className="aspect-video w-full rounded-md bg-muted"
        onLoadedMetadata={(e) => {
          const v = e.currentTarget;
          setDuration(v.duration);
          // Honour a seek or playRange issued before the metadata arrived
          // (e.g. with preload="none"); otherwise park at the clip start.
          const t = pendingSeek.current ?? start;
          pendingSeek.current = null;
          v.currentTime = t;
        }}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (checkStop(v)) return;
          setTime(v.currentTime);
          onTime.current?.(v.currentTime);
        }}
        onPlay={() => {
          setPlaying(true);
          if (stopAt.current !== null) startWatch();
        }}
        onPause={() => {
          setPlaying(false);
          stopWatch();
        }}
      />
      <div
        data-slot="media-range-player-track"
        aria-hidden="true"
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
          <Button type="button" size="sm" variant="secondary" onClick={pause}>
            <Pause />
            {l.pause}
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            onClick={() => playRange(range[0], range[1])}
          >
            <Play />
            {l.playClip}
          </Button>
        )}
        <Button
          type="button"
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
