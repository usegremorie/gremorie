import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { MediaRangePlayer } from './media-range-player';
import {
  contextWindow,
  formatTime,
  shouldStop,
  toPercent,
} from './media-range-player.logic';

// Same cases as the React edition's media-range-player.spec.tsx and
// media-range-player.dom.spec.tsx, so both editions are held to one behaviour.

describe('contextWindow', () => {
  it('adds context on both sides and clamps at zero', () => {
    expect(contextWindow([10, 40], 30)).toEqual([0, 70]);
  });

  it('clamps at the media duration when known', () => {
    expect(contextWindow([100, 140], 30, 150)).toEqual([70, 150]);
  });

  it('ignores a non-finite duration (live or not loaded)', () => {
    expect(contextWindow([100, 140], 30, Number.NaN)).toEqual([70, 170]);
  });
});

describe('toPercent', () => {
  it('maps a time inside the window', () => {
    expect(toPercent(55, [10, 100])).toBe(50);
  });

  it('clamps outside the window and survives an empty window', () => {
    expect(toPercent(0, [10, 100])).toBe(0);
    expect(toPercent(200, [10, 100])).toBe(100);
    expect(toPercent(5, [5, 5])).toBe(0);
  });
});

describe('formatTime', () => {
  it('formats minutes and hours', () => {
    expect(formatTime(5)).toBe('0:05');
    expect(formatTime(754.9)).toBe('12:34');
    expect(formatTime(3725)).toBe('1:02:05');
    expect(formatTime(-3)).toBe('0:00');
  });
});

describe('shouldStop', () => {
  it('stops only once the stop point is reached', () => {
    expect(shouldStop(9.9, 10)).toBe(false);
    expect(shouldStop(10, 10)).toBe(true);
    expect(shouldStop(50, null)).toBe(false);
  });
});

/** jsdom has no media pipeline: a scripted stand-in for HTMLMediaElement. */
interface FakeMedia {
  readyState: number;
  currentTime: number;
  paused: boolean;
  duration: number;
}

const state = new WeakMap<HTMLMediaElement, FakeMedia>();
const media = (el: HTMLMediaElement): FakeMedia => {
  let s = state.get(el);
  if (!s) {
    s = { readyState: 0, currentTime: 0, paused: true, duration: NaN };
    state.set(el, s);
  }
  return s;
};

const proto = HTMLMediaElement.prototype;
const KEYS = [
  'readyState',
  'currentTime',
  'paused',
  'duration',
  'play',
  'pause',
] as const;
const originals = new Map<string, PropertyDescriptor | undefined>();

/**
 * Fake animation frames, cancellable by id. Angular's zoneless scheduler also
 * schedules change detection through requestAnimationFrame, so the specs count
 * only the player's own stop watcher (the `tick` callback), never the
 * framework's frames.
 */
let frames = new Map<number, FrameRequestCallback>();
let nextFrame = 0;
const flushFrame = () => {
  const queued = [...frames.values()];
  frames = new Map();
  queued.forEach((cb) => cb(0));
};
/** Pending frames requested by the player's stop watcher. */
const watcherFrames = () =>
  [...frames.values()].filter((cb) => cb.name === 'tick').length;

beforeEach(() => {
  for (const k of KEYS)
    originals.set(k, Object.getOwnPropertyDescriptor(proto, k));
  for (const k of ['readyState', 'paused', 'duration'] as const) {
    Object.defineProperty(proto, k, {
      configurable: true,
      get(this: HTMLMediaElement) {
        return media(this)[k];
      },
    });
  }
  Object.defineProperty(proto, 'currentTime', {
    configurable: true,
    get(this: HTMLMediaElement) {
      return media(this).currentTime;
    },
    set(this: HTMLMediaElement, t: number) {
      media(this).currentTime = t;
    },
  });
  Object.defineProperty(proto, 'play', {
    configurable: true,
    value: vi.fn(function (this: HTMLMediaElement) {
      // Like a real element: no 'play' event when it is already playing.
      if (!media(this).paused) return Promise.resolve();
      media(this).paused = false;
      this.dispatchEvent(new Event('play'));
      return Promise.resolve();
    }),
  });
  Object.defineProperty(proto, 'pause', {
    configurable: true,
    value: vi.fn(function (this: HTMLMediaElement) {
      if (media(this).paused) return;
      media(this).paused = true;
      this.dispatchEvent(new Event('pause'));
    }),
  });
  frames = new Map();
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    nextFrame += 1;
    frames.set(nextFrame, cb);
    return nextFrame;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => {
    frames.delete(id);
  });
});

afterEach(() => {
  for (const [k, d] of originals) {
    if (d) Object.defineProperty(proto, k, d);
    else delete (proto as unknown as Record<string, unknown>)[k];
  }
  vi.unstubAllGlobals();
});

interface MountOptions {
  src?: string;
  range?: [number, number];
  context?: number;
  preload?: 'none' | 'metadata';
  controls?: boolean;
  labels?: Record<string, string>;
}

function mount(opts: MountOptions = {}) {
  TestBed.configureTestingModule({ imports: [MediaRangePlayer] });
  const fixture: ComponentFixture<MediaRangePlayer> =
    TestBed.createComponent(MediaRangePlayer);
  const set = (k: string, v: unknown) => fixture.componentRef.setInput(k, v);
  set('src', opts.src ?? '/v.mp4');
  set('range', opts.range ?? [40, 70]);
  set('context', opts.context ?? 30);
  if (opts.preload) set('preload', opts.preload);
  if (opts.controls !== undefined) set('controls', opts.controls);
  if (opts.labels) set('labels', opts.labels);
  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;
  const video = el.querySelector('video') as HTMLVideoElement;
  const timeUpdate = vi.fn();
  fixture.componentInstance.timeUpdate.subscribe(timeUpdate);
  return {
    fixture,
    el,
    api: fixture.componentInstance,
    video,
    m: media(video),
    timeUpdate,
    render: () => fixture.detectChanges(),
  };
}

/** Simulate the browser delivering metadata. */
function loadMetadata(video: HTMLVideoElement, duration = 200) {
  const m = media(video);
  m.readyState = 1;
  m.duration = duration;
  video.dispatchEvent(new Event('loadedmetadata'));
}

function tick(video: HTMLVideoElement, t: number) {
  media(video).currentTime = t;
  video.dispatchEvent(new Event('timeupdate'));
}

describe('MediaRangePlayer markup', () => {
  it('renders a metadata-only video with the source', () => {
    const { video } = mount();
    expect(video.getAttribute('preload')).toBe('metadata');
    expect(video.getAttribute('src')).toBe('/v.mp4');
  });

  it('defers loading when preload is none', () => {
    const { video } = mount({ preload: 'none' });
    expect(video.getAttribute('preload')).toBe('none');
  });

  it('places the clip at a third of the context window', () => {
    // window = [10, 100]; clip 40..70 -> left 33.3%, width 33.3%
    const { el } = mount();
    const band = el.querySelector(
      '[data-slot="media-range-player-range"]',
    ) as HTMLElement;
    expect(band.style.left).toMatch(/^33\.33\d*%$/);
    expect(band.style.width).toMatch(/^33\.33\d*%$/);
  });

  it('uses default English labels and accepts overrides', () => {
    expect(mount().el.textContent).toContain('Play clip');
    TestBed.resetTestingModule();
    const pt = mount({ labels: { playClip: 'Tocar trecho' } }).el;
    expect(pt.textContent).toContain('Tocar trecho');
    expect(pt.textContent).toContain('Play with context');
  });

  it('carries its data-slot on the host', () => {
    expect(mount().el.getAttribute('data-slot')).toBe('media-range-player');
  });
});

describe('MediaRangePlayer behaviour (DOM)', () => {
  it('parks at the clip start once metadata arrives', () => {
    const { video, m } = mount();
    loadMetadata(video);
    expect(m.currentTime).toBe(40);
  });

  it('playRange positions, arms the stop point and plays', () => {
    const { api, video, m } = mount();
    loadMetadata(video);
    api.playRange(10, 100);
    expect(m.currentTime).toBe(10);
    expect(video.play).toHaveBeenCalledTimes(1);
    expect(m.paused).toBe(false);
  });

  it('keeps playing below the stop point and pauses at it, clearing it', () => {
    const { api, video, m } = mount();
    loadMetadata(video);
    api.playRange(40, 70);
    tick(video, 69.9);
    expect(m.paused).toBe(false);
    tick(video, 70.2);
    expect(m.paused).toBe(true);
    expect(m.currentTime).toBe(70);
    // The stop point is gone: resuming plays freely past it.
    void video.play();
    tick(video, 80);
    expect(m.paused).toBe(false);
  });

  it('stops exactly at the out point from the frame loop (I2)', () => {
    const { api, video, m, timeUpdate, el, render } = mount();
    loadMetadata(video);
    api.playRange(40, 70);
    expect(watcherFrames()).toBe(1);
    m.currentTime = 55;
    flushFrame();
    expect(m.paused).toBe(false);
    expect(watcherFrames()).toBe(1);
    m.currentTime = 70.016;
    flushFrame();
    expect(m.paused).toBe(true);
    expect(m.currentTime).toBe(70);
    expect(timeUpdate).toHaveBeenLastCalledWith(70);
    expect(watcherFrames()).toBe(0);
    render();
    expect(el.textContent).toContain('1:10 ·');
  });

  it('re-arms the frame loop when playRange runs while already playing', () => {
    const { api, video, m } = mount();
    loadMetadata(video);
    // Free play (no stop point), then a seek cancels any loop.
    void video.play();
    api.seek(30);
    expect(m.paused).toBe(false);
    expect(watcherFrames()).toBe(0);
    api.playRange(40, 70);
    expect(watcherFrames()).toBe(1);
    m.currentTime = 70.01;
    flushFrame();
    expect(m.paused).toBe(true);
    expect(m.currentTime).toBe(70);
  });

  it('drops a pending seek when the source changes', () => {
    const { api, video, m, fixture } = mount({ preload: 'none' });
    api.seek(55);
    fixture.componentRef.setInput('src', '/other.mp4');
    fixture.detectChanges();
    loadMetadata(video);
    expect(m.currentTime).toBe(40);
  });

  it('keeps the context start when play comes before metadata (I1)', () => {
    const { api, video, m } = mount({ preload: 'none' });
    api.playRange(10, 100);
    loadMetadata(video);
    expect(m.currentTime).toBe(10);
  });

  it('keeps a seek issued before metadata (I1)', () => {
    const { api, video, m } = mount({ preload: 'none' });
    api.seek(55);
    loadMetadata(video);
    expect(m.currentTime).toBe(55);
  });

  it('seek moves the playhead and cancels the stop point', () => {
    const { api, video, m } = mount();
    loadMetadata(video);
    api.playRange(40, 70);
    api.seek(20);
    expect(m.currentTime).toBe(20);
    tick(video, 75);
    expect(m.paused).toBe(false);
  });

  it('pause pauses and cancels the stop point and the frame loop', () => {
    const { api, video, m } = mount();
    loadMetadata(video);
    api.playRange(40, 70);
    api.pause();
    expect(m.paused).toBe(true);
    expect(watcherFrames()).toBe(0);
    void video.play();
    tick(video, 75);
    expect(m.paused).toBe(false);
  });

  it('cancels the frame loop on destroy', () => {
    const { api, video, fixture } = mount();
    loadMetadata(video);
    api.playRange(40, 70);
    expect(watcherFrames()).toBe(1);
    fixture.destroy();
    expect(watcherFrames()).toBe(0);
  });

  it('renders accessible, non-submitting controls', () => {
    const { video, el } = mount({
      controls: true,
      labels: { video: 'Episode 12' },
    });
    expect(video.controls).toBe(true);
    expect(video.getAttribute('aria-label')).toBe('Episode 12');
    const buttons = [...el.querySelectorAll('button')];
    expect(buttons).toHaveLength(2);
    buttons.forEach((b) => expect(b.getAttribute('type')).toBe('button'));
    expect(
      el
        .querySelector('[data-slot="media-range-player-track"]')
        ?.getAttribute('aria-hidden'),
    ).toBe('true');
  });

  it('the pause button is a real button too', () => {
    const { api, video, el, render } = mount();
    loadMetadata(video);
    api.playRange(40, 70);
    render();
    const pause = [...el.querySelectorAll('button')].find(
      (b) => b.textContent?.trim() === 'Pause',
    );
    expect(pause).toBeDefined();
    expect(pause?.getAttribute('type')).toBe('button');
  });
});
