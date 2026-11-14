import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ToggleGroup, ToggleGroupItem } from '@gremorie/ng-forms';

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

/** Where a word sits relative to the clip boundaries. */
export type WordEdge = 'start' | 'end' | 'both' | 'none';

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

/**
 * WordTimeline - transcript words as a clickable strip for picking a clip's in
 * and out points at word boundaries. Angular edition of React `WordTimeline`
 * from `@gremorie/rx-display`.
 *
 * In "Seek" mode a click emits `seek` with the word start; in "Set in" / "Set
 * out" mode it moves that clip boundary to the word and emits `valueChange`.
 * The range never inverts. `[(value)]` two-way binding works because `value`
 * is an input paired with the `valueChange` output.
 *
 * Framework deltas (recorded in the contract):
 * - React `onValueChange` is the `valueChange` output.
 * - React `onSeek` is the `seek` output.
 * - React `className` is the host `class` attribute.
 *
 * @example
 * ```html
 * <gr-word-timeline [words]="words" [(value)]="clip" [currentTime]="t()"
 *   (seek)="player.seek($event)" />
 * ```
 */
@Component({
  selector: 'gr-word-timeline',
  standalone: true,
  imports: [ToggleGroup, ToggleGroupItem],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'word-timeline',
    class: 'flex flex-col gap-2',
  },
  template: `
    <!--
      nullable=false: the spartan brain defaults to nullable, so clicking the
      pressed mode would leave the group visually empty while the timeline is
      still in that mode. React gets the same result from Radix by rejecting the
      empty value (v && setMode(v)); here the brain must refuse it itself.
    -->
    <gr-toggle-group
      type="single"
      size="sm"
      variant="outline"
      [nullable]="false"
      [value]="mode()"
      (valueChange)="onMode($event)"
    >
      <gr-toggle-group-item value="seek">{{ l().seek }}</gr-toggle-group-item>
      <gr-toggle-group-item value="in">{{ l().setIn }}</gr-toggle-group-item>
      <gr-toggle-group-item value="out">{{ l().setOut }}</gr-toggle-group-item>
    </gr-toggle-group>
    <div
      #strip
      role="group"
      [attr.aria-label]="l().group"
      (keydown)="onKeyDown($event)"
      class="max-h-64 overflow-y-auto rounded-md border p-2 text-sm leading-7 text-foreground"
    >
      @for (item of items(); track item.key) {
        @if (item.speaker) {
          <span
            data-slot="word-timeline-speaker"
            class="mr-1 rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground"
            >{{ item.speaker }}</span
          >
        }
        <button
          type="button"
          data-slot="word-timeline-word"
          [attr.data-index]="item.i"
          [attr.data-in-range]="isIn(item.i)"
          [attr.data-edge]="edgeOf(item.i)"
          [attr.data-current]="item.i === current()"
          [attr.aria-current]="item.i === current() ? 'true' : null"
          [attr.tabindex]="item.i === tabStop() ? 0 : -1"
          (click)="onPick(item.i)"
          (focus)="focusIndex.set(item.i)"
          [class]="wordClass"
        >
          <!--
            The word sits in its own span on purpose. Bare text here would pick
            up the template's line breaks (a formatter puts them back) and
            render as " word " inside the highlight; whitespace-only nodes
            between elements are dropped instead.
          -->
          <span>{{ item.w }}</span>
          @if (srFor(item.i); as sr) {
            <span class="sr-only">, {{ sr }}</span>
          }
        </button>
        <!-- Words are separated by a real space, like running text. -->
        {{ ' ' }}
      }
    </div>
  `,
})
export class WordTimeline {
  /** Words with start/end seconds and speaker, sorted by start. */
  readonly words = input.required<TimelineWord[]>();
  /** Selected [in, out] in seconds. */
  readonly value = input.required<[number, number]>();
  /** Playhead, to highlight the spoken word. */
  readonly currentTime = input<number | undefined>(undefined);
  /** Display names per speaker id. */
  readonly speakerNames = input<Record<string, string> | undefined>(undefined);
  /** Mode, group and screen-reader clip-state labels. Defaults in English. */
  readonly labels = input<Partial<WordTimelineLabels>>({});
  /**
   * Scroll the strip to keep the spoken word visible while it plays. Skipped
   * while focus is inside the strip.
   */
  readonly followPlayhead = input<boolean>(true);

  /** New in/out after a boundary click. Mirrors React `onValueChange`. */
  readonly valueChange = output<[number, number]>();
  /** Word start, when a word is clicked in seek mode. Mirrors React `onSeek`. */
  readonly seek = output<number>();

  private readonly strip =
    viewChild.required<ElementRef<HTMLDivElement>>('strip');

  protected readonly mode = signal<TimelineMode>('seek');
  /** Last focused word; owns the roving tab stop once set. */
  protected readonly focusIndex = signal<number | null>(null);

  protected readonly l = computed<WordTimelineLabels>(() => ({
    ...DEFAULT_LABELS,
    ...this.labels(),
  }));

  /**
   * Static per-word view data. Depends only on `words` and `speakerNames`, so a
   * playhead tick does not rebuild the list; the per-word state below is read
   * through bindings, and Angular only touches the DOM where a binding changed.
   */
  protected readonly items = computed(() => {
    const words = this.words();
    const names = this.speakerNames();
    const turns = speakerTurns(words);
    return words.map((w, i) => ({
      key: `${w.start}-${i}`,
      i,
      w: w.w,
      speaker:
        turns.has(i) && w.speaker ? (names?.[w.speaker] ?? w.speaker) : null,
    }));
  });

  protected readonly current = computed(() => {
    const t = this.currentTime();
    return t === undefined ? -1 : activeIndex(this.words(), t);
  });

  /** First and last word index inside the clip, or [-1, -1]. */
  private readonly bounds = computed<[number, number]>(() => {
    const value = this.value();
    let first = -1;
    let last = -1;
    this.words().forEach((w, i) => {
      if (inRange(w, value)) {
        if (first < 0) first = i;
        last = i;
      }
    });
    return [first, last];
  });

  /**
   * Roving tab stop: the last focused word, else the word at the playhead (the
   * last one started, so it holds still in gaps), else the first.
   */
  protected readonly tabStop = computed(() => {
    const focused = this.focusIndex();
    const words = this.words();
    if (focused !== null && focused < words.length) return focused;
    const t = this.currentTime();
    return t === undefined ? 0 : lastStarted(words, t);
  });

  // Focus ring: the design-system geometry (3px at 50% of --ring), the same one
  // Button and ToggleGroupItem render, so keyboard focus does not change shape
  // when it moves from the mode toggle into the strip.
  // The DS pairs that ring with `focus-visible:border-ring`; this button
  // deliberately does not. Here the border is not decoration - it marks the
  // clip edges in --primary, which is the cue that keeps the clip readable
  // without color alone. Repainting it on focus would hide the edge exactly
  // while the user is on it.
  protected readonly wordClass = [
    'rounded border-primary px-0.5 outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'data-[in-range=true]:bg-primary/15 data-[in-range=true]:hover:bg-primary/25',
    'data-[edge=start]:rounded-l-none data-[edge=start]:border-l-2',
    'data-[edge=end]:rounded-r-none data-[edge=end]:border-r-2',
    'data-[edge=both]:rounded-none data-[edge=both]:border-x-2',
    'data-[current=true]:underline data-[current=true]:decoration-2',
  ].join(' ');

  constructor() {
    // Keep the spoken word visible, scrolling only the strip (never the page),
    // and never while the user is working inside the strip.
    afterRenderEffect(() => {
      const current = this.current();
      if (!this.followPlayhead() || current < 0) return;
      const strip = this.strip().nativeElement;
      if (strip.contains(document.activeElement)) return;
      const word = strip.querySelector<HTMLElement>(
        `[data-index="${current}"]`,
      );
      if (!word) return;
      const s = strip.getBoundingClientRect();
      const w = word.getBoundingClientRect();
      if (w.top < s.top) strip.scrollTop += w.top - s.top;
      else if (w.bottom > s.bottom) strip.scrollTop += w.bottom - s.bottom;
    });
  }

  protected isIn(i: number): boolean {
    const [first, last] = this.bounds();
    return first >= 0 && i >= first && i <= last;
  }

  protected edgeOf(i: number): WordEdge {
    const [first, last] = this.bounds();
    if (first < 0 || i < first || i > last) return 'none';
    if (i === first && i === last) return 'both';
    if (i === first) return 'start';
    if (i === last) return 'end';
    return 'none';
  }

  protected srFor(i: number): string {
    if (!this.isIn(i)) return '';
    const l = this.l();
    const edge = this.edgeOf(i);
    if (edge === 'both') return `${l.clipStart}, ${l.clipEnd}`;
    if (edge === 'start') return l.clipStart;
    if (edge === 'end') return l.clipEnd;
    return l.inClip;
  }

  /** A single-select group can emit an empty value; keep a mode selected. */
  protected onMode(v: unknown): void {
    if (v === 'seek' || v === 'in' || v === 'out') this.mode.set(v);
  }

  protected onPick(i: number): void {
    const words = this.words();
    const word = words[i];
    if (!word) return;
    const mode = this.mode();
    if (mode === 'seek') this.seek.emit(word.start);
    else this.valueChange.emit(setBoundary(words, this.value(), i, mode));
  }

  protected onKeyDown(e: KeyboardEvent): void {
    const i = Number((e.target as HTMLElement).dataset['index']);
    const n = this.words().length;
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
    this.strip()
      .nativeElement.querySelector<HTMLElement>(`[data-index="${next}"]`)
      ?.focus();
  }
}
