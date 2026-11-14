// @vitest-environment jsdom
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  MediaRangePlayer,
  type MediaRangePlayerHandle,
} from './media-range-player';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

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

let frames: FrameRequestCallback[] = [];
const flushFrame = () => {
  const queued = frames;
  frames = [];
  queued.forEach((cb) => cb(0));
};

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
  frames = [];
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    frames.push(cb);
    return frames.length;
  });
  vi.stubGlobal('cancelAnimationFrame', () => {
    frames = [];
  });
});

afterEach(() => {
  for (const [k, d] of originals) {
    if (d) Object.defineProperty(proto, k, d);
    else delete (proto as unknown as Record<string, unknown>)[k];
  }
  vi.unstubAllGlobals();
});

let root: Root | null = null;
let host: HTMLDivElement | null = null;

function must<T>(v: T | null | undefined, what: string): T {
  if (v === null || v === undefined) throw new Error(`${what} is not mounted`);
  return v;
}
const el = () => must(host, 'host');
const rootOf = () => must(root, 'root');
const api = (r: React.RefObject<MediaRangePlayerHandle | null>) =>
  must(r.current, 'handle');

afterEach(() => {
  act(() => root?.unmount());
  host?.remove();
  root = null;
  host = null;
});

function mount(
  props: Partial<React.ComponentProps<typeof MediaRangePlayer>> = {},
) {
  const ref = React.createRef<MediaRangePlayerHandle>();
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
  act(() => {
    rootOf().render(
      <MediaRangePlayer
        ref={ref}
        src="/v.mp4"
        range={[40, 70]}
        context={30}
        {...props}
      />,
    );
  });
  const video = host.querySelector('video') as HTMLVideoElement;
  return { ref, video, m: media(video) };
}

/** Simulate the browser delivering metadata. */
function loadMetadata(video: HTMLVideoElement, duration = 200) {
  const m = media(video);
  m.readyState = 1;
  m.duration = duration;
  act(() => {
    video.dispatchEvent(new Event('loadedmetadata'));
  });
}

function tick(video: HTMLVideoElement, t: number) {
  media(video).currentTime = t;
  act(() => {
    video.dispatchEvent(new Event('timeupdate'));
  });
}

describe('MediaRangePlayer behaviour (DOM)', () => {
  it('parks at the clip start once metadata arrives', () => {
    const { video, m } = mount();
    loadMetadata(video);
    expect(m.currentTime).toBe(40);
  });

  it('playRange positions, arms the stop point and plays', () => {
    const { ref, video, m } = mount();
    loadMetadata(video);
    act(() => api(ref).playRange(10, 100));
    expect(m.currentTime).toBe(10);
    expect(video.play).toHaveBeenCalledTimes(1);
    expect(m.paused).toBe(false);
  });

  it('keeps playing below the stop point and pauses at it, clearing it', () => {
    const { ref, video, m } = mount();
    loadMetadata(video);
    act(() => api(ref).playRange(40, 70));
    tick(video, 69.9);
    expect(m.paused).toBe(false);
    tick(video, 70.2);
    expect(m.paused).toBe(true);
    expect(m.currentTime).toBe(70);
    // The stop point is gone: resuming plays freely past it.
    act(() => {
      void video.play();
    });
    tick(video, 80);
    expect(m.paused).toBe(false);
  });

  it('stops exactly at the out point from the frame loop (I2)', () => {
    const onTimeUpdate = vi.fn();
    const { ref, video, m } = mount({ onTimeUpdate });
    loadMetadata(video);
    act(() => api(ref).playRange(40, 70));
    expect(frames.length).toBe(1);
    m.currentTime = 55;
    act(flushFrame);
    expect(m.paused).toBe(false);
    expect(frames.length).toBe(1);
    m.currentTime = 70.016;
    act(flushFrame);
    expect(m.paused).toBe(true);
    expect(m.currentTime).toBe(70);
    expect(onTimeUpdate).toHaveBeenLastCalledWith(70);
    expect(frames.length).toBe(0);
    expect(el().textContent).toContain('1:10 ·');
  });

  it('re-arms the frame loop when playRange runs while already playing', () => {
    const { ref, video, m } = mount();
    loadMetadata(video);
    // Free play (no stop point), then a seek cancels any loop.
    act(() => {
      void video.play();
    });
    act(() => api(ref).seek(30));
    expect(m.paused).toBe(false);
    expect(frames.length).toBe(0);
    act(() => api(ref).playRange(40, 70));
    expect(frames.length).toBe(1);
    m.currentTime = 70.01;
    act(flushFrame);
    expect(m.paused).toBe(true);
    expect(m.currentTime).toBe(70);
  });

  it('drops a pending seek when the source changes', () => {
    const { ref, video, m } = mount({ preload: 'none' });
    act(() => api(ref).seek(55));
    act(() => {
      rootOf().render(
        <MediaRangePlayer
          ref={ref}
          src="/other.mp4"
          range={[40, 70]}
          context={30}
          preload="none"
        />,
      );
    });
    loadMetadata(video);
    expect(m.currentTime).toBe(40);
  });

  it('keeps the context start when play comes before metadata (I1)', () => {
    const { ref, video, m } = mount({ preload: 'none' });
    act(() => api(ref).playRange(10, 100));
    loadMetadata(video);
    expect(m.currentTime).toBe(10);
  });

  it('keeps a seek issued before metadata (I1)', () => {
    const { ref, video, m } = mount({ preload: 'none' });
    act(() => api(ref).seek(55));
    loadMetadata(video);
    expect(m.currentTime).toBe(55);
  });

  it('seek moves the playhead and cancels the stop point', () => {
    const { ref, video, m } = mount();
    loadMetadata(video);
    act(() => api(ref).playRange(40, 70));
    act(() => api(ref).seek(20));
    expect(m.currentTime).toBe(20);
    tick(video, 75);
    expect(m.paused).toBe(false);
  });

  it('pause pauses and cancels the stop point and the frame loop', () => {
    const { ref, video, m } = mount();
    loadMetadata(video);
    act(() => api(ref).playRange(40, 70));
    act(() => api(ref).pause());
    expect(m.paused).toBe(true);
    expect(frames.length).toBe(0);
    act(() => {
      void video.play();
    });
    tick(video, 75);
    expect(m.paused).toBe(false);
  });

  it('cancels the frame loop on unmount', () => {
    const { ref, video } = mount();
    loadMetadata(video);
    act(() => api(ref).playRange(40, 70));
    expect(frames.length).toBe(1);
    act(() => rootOf().unmount());
    root = null;
    expect(frames.length).toBe(0);
  });

  it('renders accessible, non-submitting controls', () => {
    const { video } = mount({
      controls: true,
      labels: { video: 'Episode 12' },
    });
    expect(video.controls).toBe(true);
    expect(video.getAttribute('aria-label')).toBe('Episode 12');
    const buttons = [...el().querySelectorAll('button')];
    expect(buttons).toHaveLength(2);
    buttons.forEach((b) => expect(b.getAttribute('type')).toBe('button'));
    expect(
      el()
        .querySelector('[data-slot="media-range-player-track"]')
        ?.getAttribute('aria-hidden'),
    ).toBe('true');
  });

  it('the pause button is a real button too', () => {
    const { ref, video } = mount();
    loadMetadata(video);
    act(() => api(ref).playRange(40, 70));
    const pause = [...el().querySelectorAll('button')].find(
      (b) => b.textContent === 'Pause',
    );
    expect(pause?.getAttribute('type')).toBe('button');
  });
});
