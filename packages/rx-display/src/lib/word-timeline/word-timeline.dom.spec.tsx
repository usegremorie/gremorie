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
const words = () =>
  Array.from(
    host.querySelectorAll<HTMLButtonElement>(
      '[data-slot="word-timeline-word"]',
    ),
  );
const word = (text: string) => {
  const found = words().find((b) => b.textContent === text);
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
    .map((b) => b.textContent);
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
        .map((b) => b.textContent);
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

  it('words are focusable buttons in reading order', () => {
    const onSeek = vi.fn();
    render(<WordTimeline words={WORDS} value={[0, 2.9]} onSeek={onSeek} />);
    const list = words();
    expect(list.map((b) => b.textContent)).toEqual(WORDS.map((w) => w.w));
    for (const b of list) expect(b.tabIndex).toBe(0);
    act(() => list[3].focus());
    expect(document.activeElement).toBe(list[3]);
    // Native buttons turn Enter/Space into click; jsdom does not, so click.
    click(list[3]);
    expect(onSeek).toHaveBeenCalledWith(1.7);
  });
});
