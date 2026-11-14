import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Button } from '@gremorie/ng-core';

import {
  contextWindow,
  formatTime,
  shouldStop,
  toPercent,
  type MediaRange,
} from './media-range-player.logic';

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

/**
 * MediaRangePlayer - a video player scoped to one clip of a longer source.
 * Angular edition of React `MediaRangePlayer` from `@gremorie/rx-display`.
 *
 * Shows the clip as a highlighted band inside a context window, plays only the
 * clip or the clip plus context, and exposes the same imperative handle as the
 * React ref (`seek`, `playRange`, `pause`) as public methods, so a sibling such
 * as `gr-word-timeline` can drive it through a template reference.
 *
 * Framework deltas (recorded in the contract):
 * - React `onTimeUpdate` is the `timeUpdate` output.
 * - React `className` is the host `class` attribute.
 * - React's ref handle is the component instance (`#player`, then
 *   `player.seek(t)`).
 *
 * @example
 * ```html
 * <gr-media-range-player #player src="/media/ep.mp4" [range]="[754, 812]"
 *   (timeUpdate)="t.set($event)" />
 * <gr-word-timeline [words]="words" [(value)]="clip" [currentTime]="t()"
 *   (seek)="player.seek($event)" />
 * ```
 */
@Component({
  selector: 'gr-media-range-player',
  standalone: true,
  imports: [Button],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'media-range-player',
    class: 'flex flex-col gap-2',
  },
  template: `
    <video
      #video
      [src]="src()"
      [attr.preload]="preload()"
      [controls]="controls()"
      [attr.aria-label]="l().video"
      playsinline
      class="aspect-video w-full rounded-md bg-muted"
      (loadedmetadata)="onLoadedMetadata()"
      (timeupdate)="onTimeUpdate()"
      (play)="onPlay()"
      (pause)="onPause()"
    ></video>
    <div
      data-slot="media-range-player-track"
      aria-hidden="true"
      class="relative h-2 rounded-full bg-muted"
    >
      <div
        data-slot="media-range-player-range"
        class="absolute inset-y-0 rounded-full bg-primary/40"
        [style.left.%]="left()"
        [style.width.%]="width()"
      ></div>
      <div
        data-slot="media-range-player-playhead"
        class="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-foreground"
        [style.left.%]="playhead()"
      ></div>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      @if (playing()) {
        <ai-button
          type="button"
          size="sm"
          variant="secondary"
          (pressedChange)="pause()"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <rect x="14" y="3" width="5" height="18" rx="1" />
            <rect x="5" y="3" width="5" height="18" rx="1" />
          </svg>
          {{ l().pause }}
        </ai-button>
      } @else {
        <ai-button
          type="button"
          size="sm"
          (pressedChange)="playRange(range()[0], range()[1])"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path
              d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"
            />
          </svg>
          {{ l().playClip }}
        </ai-button>
      }
      <ai-button
        type="button"
        size="sm"
        variant="outline"
        (pressedChange)="playRange(win()[0], win()[1])"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path
            d="M12 6a2 2 0 0 0-3.414-1.414l-6 6a2 2 0 0 0 0 2.828l6 6A2 2 0 0 0 12 18z"
          />
          <path
            d="M22 6a2 2 0 0 0-3.414-1.414l-6 6a2 2 0 0 0 0 2.828l6 6A2 2 0 0 0 22 18z"
          />
        </svg>
        {{ l().playContext }}
      </ai-button>
      <span
        data-slot="media-range-player-time"
        class="ml-auto font-mono text-xs tabular-nums text-muted-foreground"
        >{{ timeLabel() }}</span
      >
    </div>
  `,
})
export class MediaRangePlayer {
  /** Media URL. Served with HTTP Range so seeking does not download the whole file. */
  readonly src = input.required<string>();
  /** Clip in/out, in seconds of the source. */
  readonly range = input.required<MediaRange>();
  /** Seconds shown and played around the clip. */
  readonly context = input<number>(30);
  /** What to fetch before the first play or seek. Use 'none' when a page shows many players. */
  readonly preload = input<'none' | 'metadata'>('metadata');
  /**
   * Show the browser's native video controls (keyboard seeking, volume,
   * fullscreen) in addition to the clip controls.
   */
  readonly controls = input<boolean>(false);
  /** Button, time label and video `aria-label` text. Defaults in English. */
  readonly labels = input<Partial<MediaRangePlayerLabels>>({});

  /** Current time while playing. Mirrors React `onTimeUpdate`. */
  readonly timeUpdate = output<number>();

  private readonly video =
    viewChild.required<ElementRef<HTMLVideoElement>>('video');

  /** Where playback must stop, or null for free play. */
  private stopAt: number | null = null;
  /** A position requested before the metadata arrived; applied on loadedmetadata. */
  private pendingSeek: number | null = null;
  /** Active requestAnimationFrame id of the stop watcher. */
  private frame: number | null = null;

  protected readonly time = signal(0);
  protected readonly duration = signal<number | undefined>(undefined);
  protected readonly playing = signal(false);

  protected readonly l = computed<MediaRangePlayerLabels>(() => ({
    ...DEFAULT_LABELS,
    ...this.labels(),
  }));
  protected readonly win = computed(() =>
    contextWindow(this.range(), this.context(), this.duration()),
  );
  protected readonly left = computed(() =>
    toPercent(this.range()[0], this.win()),
  );
  protected readonly width = computed(() =>
    Math.max(0, toPercent(this.range()[1], this.win()) - this.left()),
  );
  protected readonly playhead = computed(() =>
    toPercent(this.time(), this.win()),
  );
  protected readonly timeLabel = computed(() => {
    const [a, b] = this.range();
    return `${formatTime(this.time())} · ${this.l().clip} ${formatTime(a)} - ${formatTime(b)}`;
  });

  /** The clip start on its own, so a new out point does not re-park the video. */
  private readonly start = computed(() => this.range()[0]);

  constructor() {
    // The playhead starts at the clip start (React: useState(range[0])); a
    // later clip start re-parks a video that already has its metadata.
    let seeded = false;
    effect(() => {
      const start = this.start();
      untracked(() => {
        if (!seeded) {
          seeded = true;
          this.time.set(start);
          return;
        }
        const v = this.video().nativeElement;
        if (v.readyState >= 1) v.currentTime = start;
      });
    });

    // A position queued for the previous source must not leak into the new one.
    effect(() => {
      this.src();
      this.pendingSeek = null;
    });

    inject(DestroyRef).onDestroy(() => this.stopWatch());
  }

  /** Move the playhead to `t` (seconds) and cancel any pending stop point. */
  seek(t: number): void {
    this.stopAt = null;
    this.stopWatch();
    this.position(t);
  }

  /** Play from `from` and pause exactly at `to` (seconds). */
  playRange(from: number, to: number): void {
    const v = this.video().nativeElement;
    this.stopAt = to;
    this.position(from);
    const p = v.play();
    if (p) p.catch(() => undefined);
    // (play) does not fire when the video is already playing, so arm the
    // frame watcher here too (startWatch restarts it, never doubles it).
    this.startWatch();
  }

  /** Pause and cancel any pending stop point. */
  pause(): void {
    this.stopAt = null;
    this.stopWatch();
    this.video().nativeElement.pause();
  }

  protected onLoadedMetadata(): void {
    const v = this.video().nativeElement;
    this.duration.set(v.duration);
    // Honour a seek or playRange issued before the metadata arrived
    // (e.g. with preload="none"); otherwise park at the clip start.
    const t = this.pendingSeek ?? this.start();
    this.pendingSeek = null;
    v.currentTime = t;
  }

  protected onTimeUpdate(): void {
    const v = this.video().nativeElement;
    if (this.checkStop(v)) return;
    this.time.set(v.currentTime);
    this.timeUpdate.emit(v.currentTime);
  }

  protected onPlay(): void {
    this.playing.set(true);
    if (this.stopAt !== null) this.startWatch();
  }

  protected onPause(): void {
    this.playing.set(false);
    this.stopWatch();
  }

  private position(t: number): void {
    const v = this.video().nativeElement;
    if (v.readyState >= 1) {
      this.pendingSeek = null;
      v.currentTime = t;
    } else {
      this.pendingSeek = t;
    }
    this.time.set(t);
  }

  /** Pause at the stop point itself, not at the first event after it. */
  private checkStop(v: HTMLVideoElement): boolean {
    const to = this.stopAt;
    if (to === null || !shouldStop(v.currentTime, to)) return false;
    this.stopAt = null;
    this.stopWatch();
    v.pause();
    v.currentTime = to;
    this.time.set(to);
    this.timeUpdate.emit(to);
    return true;
  }

  private startWatch(): void {
    this.stopWatch();
    if (typeof requestAnimationFrame !== 'function') return;
    const tick = () => {
      this.frame = null;
      const v = this.video().nativeElement;
      if (v.paused || this.stopAt === null) return;
      if (!this.checkStop(v)) this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }

  private stopWatch(): void {
    if (this.frame !== null) {
      cancelAnimationFrame(this.frame);
      this.frame = null;
    }
  }
}
