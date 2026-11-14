// Pure logic, kept byte-for-byte identical to the React edition
// (packages/rx-display/src/lib/media-range-player/media-range-player.logic.ts).
// The spec in this folder runs the same cases, so a change on one side that is
// not mirrored here fails a test instead of drifting silently.

/** [in, out] in seconds. */
export type MediaRange = [number, number];

/** The clip plus `context` seconds on each side, clamped to [0, duration]. */
export function contextWindow(
  range: MediaRange,
  context: number,
  duration?: number,
): MediaRange {
  const lo = Math.max(0, range[0] - context);
  const hi = range[1] + context;
  return [
    lo,
    duration !== undefined && Number.isFinite(duration)
      ? Math.min(duration, hi)
      : hi,
  ];
}

export function toPercent(t: number, window: MediaRange): number {
  const span = window[1] - window[0];
  if (span <= 0) return 0;
  return Math.min(100, Math.max(0, ((t - window[0]) / span) * 100));
}

export function formatTime(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

export function shouldStop(t: number, stopAt: number | null): boolean {
  return stopAt !== null && t >= stopAt;
}
