// @vitest-environment jsdom
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { WordTimeline, type WordTimelineProps } from './word-timeline';
import type { TimelineWord } from './word-timeline.logic';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const WORDS: TimelineWord[] = [
  { w: 'Good', start: 0, end: 0.4, speaker: 'A' },
  { w: 'morning.', start: 0.5, end: 1.0, speaker: 'A' },
  { w: 'Thanks', start: 1.2, end: 1.6, speaker: 'B' },
  { w: 'for', start: 1.7, end: 1.9, speaker: 'B' },
  { w: 'having', start: 2.0, end: 2.4, speaker: 'B' },
  { w: 'me.', start: 2.5, end: 2.9, speaker: 'B' },
];

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

/** Controlled harness: keeps value in state, like a real caller would. */
function Harness({
  initial,
  onValueChange,
  ...rest
}: Omit<WordTimelineProps, 'value'> & { initial: [number, number] }) {
  const [value, setValue] = React.useState(initial);
  return (
    <WordTimeline
      {...rest}
      value={value}
      onValueChange={(v) => {
        setValue(v);
        onValueChange?.(v);
      }}
    />
  );
}

const render = (el: React.ReactElement) => act(() => root.render(el));
/** Visible word text (the button also holds screen-reader-only clip state). */
const wordText = (b: Element) => b.firstChild?.textContent ?? null;
const words = () =>
  Array.from(
    host.querySelectorAll<HTMLButtonElement>(
      '[data-slot="word-timeline-word"]',
    ),
  );
const word = (text: string) => {
  const found = words().find((b) => wordText(b) === text);
  if (!found) throw new Error(`word ${text} not rendered`);
  return found;
};
const modeButton = (label: string) => {
  const found = Array.from(
    host.querySelectorAll<HTMLButtonElement>('[data-slot="toggle-group-item"]'),
  ).find((b) => b.textContent === label);
  if (!found) throw new Error(`mode ${label} not rendered`);
  return found;
};
const click = (el: HTMLElement) =>
  act(() => {
    el.click();
  });
const inRangeWords = () =>
  words()
    .filter((b) => b.dataset['inRange'] === 'true')
    .map(wordText);
const lastValue = (fn: ReturnType<typeof vi.fn>) =>
  fn.mock.lastCall?.[0] as [number, number];

describe('WordTimeline (DOM)', () => {
  it('starts in seek mode: a click seeks to the word start and keeps the range', () => {
    const onSeek = vi.fn();
    const onValueChange = vi.fn();
    render(
      <Harness
        words={WORDS}
        initial={[0, 2.9]}
        onSeek={onSeek}
        onValueChange={onValueChange}
      />,
    );
    expect(modeButton('Seek').getAttribute('data-state')).toBe('on');
    click(word('having'));
    expect(onSeek).toHaveBeenCalledWith(2.0);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('"Set in" moves the start to the clicked word', () => {
    const onValueChange = vi.fn();
    const onSeek = vi.fn();
    render(
      <Harness
        words={WORDS}
        initial={[0, 2.9]}
        onValueChange={onValueChange}
        onSeek={onSeek}
      />,
    );
    click(modeButton('Set in'));
    expect(modeButton('Set in').getAttribute('data-state')).toBe('on');
    click(word('for'));
    expect(lastValue(onValueChange)).toEqual([1.7, 2.9]);
    expect(onSeek).not.toHaveBeenCalled();
    expect(inRangeWords()).toEqual(['for', 'having', 'me.']);
  });

  it('"Set out" on a word before the start moves the start too, never inverting', () => {
    const onValueChange = vi.fn();
    render(
      <Harness
        words={WORDS}
        initial={[2.0, 2.9]}
        onValueChange={onValueChange}
      />,
    );
    click(modeButton('Set out'));
    click(word('morning.'));
    const [a, b] = lastValue(onValueChange);
    expect([a, b]).toEqual([0.5, 1.0]);
    expect(a).toBeLessThan(b);
    expect(inRangeWords()).toEqual(['morning.']);
  });

  it('"Set in" on a word after the end moves the end too, never inverting', () => {
    const onValueChange = vi.fn();
    render(
      <Harness
        words={WORDS}
        initial={[0, 1.0]}
        onValueChange={onValueChange}
      />,
    );
    click(modeButton('Set in'));
    click(word('having'));
    const [a, b] = lastValue(onValueChange);
    expect([a, b]).toEqual([2.0, 2.4]);
    expect(a).toBeLessThan(b);
    expect(inRangeWords()).toEqual(['having']);
  });

  it('a sequence of boundary clicks keeps the range ordered', () => {
    const onValueChange = vi.fn();
    render(
      <Harness
        words={WORDS}
        initial={[0, 2.9]}
        onValueChange={onValueChange}
      />,
    );
    const steps: [string, string][] = [
      ['Set out', 'Good'],
      ['Set in', 'me.'],
      ['Set out', 'Thanks'],
      ['Set in', 'having'],
      ['Set out', 'morning.'],
    ];
    for (const [mode, w] of steps) {
      click(modeButton(mode));
      click(word(w));
      const [a, b] = lastValue(onValueChange);
      expect(a).toBeLessThan(b);
    }
  });

  it('clicking the pressed mode again keeps a mode selected', () => {
    render(<WordTimeline words={WORDS} value={[0, 2.9]} />);
    click(modeButton('Seek'));
    expect(modeButton('Seek').getAttribute('data-state')).toBe('on');
  });

  it('moves the current-word mark with currentTime', () => {
    const current = () =>
      words()
        .filter((b) => b.dataset['current'] === 'true')
        .map(wordText);
    render(<WordTimeline words={WORDS} value={[0, 2.9]} currentTime={0.2} />);
    expect(current()).toEqual(['Good']);
    render(<WordTimeline words={WORDS} value={[0, 2.9]} currentTime={2.6} />);
    expect(current()).toEqual(['me.']);
    render(<WordTimeline words={WORDS} value={[0, 2.9]} currentTime={1.1} />);
    expect(current()).toEqual([]);
  });

  it('inside a form, every control is type="button" and never submits', () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <WordTimeline
          words={WORDS}
          value={[0, 2.9]}
          labels={{ group: 'Palavras', seek: 'Ir' }}
        />
      </form>,
    );
    const buttons = Array.from(host.querySelectorAll('button'));
    expect(buttons).toHaveLength(9);
    for (const b of buttons) expect(b.getAttribute('type')).toBe('button');
    click(word('for'));
    click(modeButton('Set in'));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      host
        .querySelector('[role="group"][aria-label]')
        ?.getAttribute('aria-label'),
    ).toBe('Palavras');
    expect(modeButton('Ir')).toBeTruthy();
  });

  it('words are buttons in reading order; activating one seeks', () => {
    const onSeek = vi.fn();
    render(<WordTimeline words={WORDS} value={[0, 2.9]} onSeek={onSeek} />);
    const list = words();
    expect(list.map(wordText)).toEqual(WORDS.map((w) => w.w));
    act(() => list[3].focus());
    expect(document.activeElement).toBe(list[3]);
    // Native buttons turn Enter/Space into click; jsdom does not, so click.
    click(list[3]);
    expect(onSeek).toHaveBeenCalledWith(1.7);
  });
});

describe('WordTimeline roving tab stop', () => {
  const tabStops = () =>
    words()
      .filter((b) => b.tabIndex === 0)
      .map(wordText);
  const key = (k: string) =>
    act(() => {
      document.activeElement?.dispatchEvent(
        new KeyboardEvent('keydown', { key: k, bubbles: true }),
      );
    });

  it('exactly one word is a tab stop: the spoken word, else the first', () => {
    render(<WordTimeline words={WORDS} value={[0, 2.9]} />);
    expect(tabStops()).toEqual(['Good']);
    for (const b of words().slice(1)) expect(b.tabIndex).toBe(-1);
    render(<WordTimeline words={WORDS} value={[0, 2.9]} currentTime={1.8} />);
    expect(tabStops()).toEqual(['for']);
  });

  it('arrows, Home and End move focus and the tab stop follows', () => {
    render(<WordTimeline words={WORDS} value={[0, 2.9]} />);
    act(() => word('Good').focus());
    key('ArrowRight');
    expect(document.activeElement).toBe(word('morning.'));
    expect(tabStops()).toEqual(['morning.']);
    key('ArrowRight');
    key('ArrowLeft');
    expect(document.activeElement).toBe(word('morning.'));
    key('End');
    expect(document.activeElement).toBe(word('me.'));
    key('ArrowRight');
    expect(document.activeElement).toBe(word('me.'));
    key('Home');
    expect(document.activeElement).toBe(word('Good'));
    key('ArrowLeft');
    expect(document.activeElement).toBe(word('Good'));
    expect(tabStops()).toEqual(['Good']);
  });

  it('the last focused word stays the tab stop as the playhead moves', () => {
    render(<WordTimeline words={WORDS} value={[0, 2.9]} currentTime={0.2} />);
    act(() => word('having').focus());
    render(<WordTimeline words={WORDS} value={[0, 2.9]} currentTime={2.6} />);
    expect(tabStops()).toEqual(['having']);
  });
});

describe('WordTimeline clip state without color', () => {
  const sr = (text: string) =>
    word(text).querySelector('.sr-only')?.textContent ?? '';

  it('marks start and end edges, in-clip words and the spoken word', () => {
    render(<WordTimeline words={WORDS} value={[1.2, 2.4]} currentTime={1.8} />);
    expect(word('Thanks').dataset['edge']).toBe('start');
    expect(word('having').dataset['edge']).toBe('end');
    expect(word('for').dataset['edge']).toBe('none');
    expect(word('Good').dataset['edge']).toBe('none');
    expect(sr('Thanks')).toBe(', clip start');
    expect(sr('for')).toBe(', in clip');
    expect(sr('having')).toBe(', clip end');
    expect(sr('Good')).toBe('');
    expect(sr('me.')).toBe('');
    expect(word('for').getAttribute('aria-current')).toBe('true');
    expect(
      words()
        .filter((b) => b.hasAttribute('aria-current'))
        .map(wordText),
    ).toEqual(['for']);
  });

  it('a one-word clip is both start and end; labels are overridable', () => {
    render(
      <WordTimeline
        words={WORDS}
        value={[1.7, 1.9]}
        labels={{ clipStart: 'início', clipEnd: 'fim', inClip: 'no trecho' }}
      />,
    );
    expect(word('for').dataset['edge']).toBe('both');
    expect(sr('for')).toBe(', início, fim');
  });
});

describe('WordTimeline follows the playhead', () => {
  const rect = (top: number, bottom: number) =>
    ({
      top,
      bottom,
      left: 0,
      right: 0,
      width: 0,
      height: bottom - top,
    }) as DOMRect;

  it('scrolls only the strip to the spoken word, unless focus is inside', () => {
    const tops: Record<string, number> = { 'me.': 300 };
    const spy = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        if (this.getAttribute('role') === 'group') return rect(0, 100);
        const t = tops[wordText(this) ?? ''] ?? 10;
        return rect(t, t + 20);
      });
    render(<WordTimeline words={WORDS} value={[0, 2.9]} currentTime={0.2} />);
    const strip = host.querySelector<HTMLElement>('[role="group"]');
    if (!strip) throw new Error('strip not rendered');
    expect(strip.scrollTop).toBe(0);
    render(<WordTimeline words={WORDS} value={[0, 2.9]} currentTime={2.6} />);
    expect(strip.scrollTop).toBe(220);

    strip.scrollTop = 0;
    act(() => word('Good').focus());
    render(<WordTimeline words={WORDS} value={[0, 2.9]} currentTime={0.2} />);
    render(<WordTimeline words={WORDS} value={[0, 2.9]} currentTime={2.6} />);
    expect(strip.scrollTop).toBe(0);

    act(() => (document.activeElement as HTMLElement).blur());
    render(
      <WordTimeline
        words={WORDS}
        value={[0, 2.9]}
        currentTime={0.2}
        followPlayhead={false}
      />,
    );
    render(
      <WordTimeline
        words={WORDS}
        value={[0, 2.9]}
        currentTime={2.6}
        followPlayhead={false}
      />,
    );
    expect(strip.scrollTop).toBe(0);
    spy.mockRestore();
  });
});
