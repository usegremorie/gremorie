// @vitest-environment jsdom
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { WordTimeline } from './word-timeline';
import type { TimelineWord } from './word-timeline.logic';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

/** Indexes of the WordButtons that actually rendered (memo misses). */
const renders: number[] = [];

vi.mock('./word-button', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./word-button')>();
  const inner = (
    actual.WordButton as unknown as {
      type: (p: import('./word-button').WordButtonProps) => React.ReactNode;
    }
  ).type;
  const Counted = (p: import('./word-button').WordButtonProps) => {
    renders.push(p.index);
    return inner(p);
  };
  return { ...actual, WordButton: React.memo(Counted) };
});

const WORDS: TimelineWord[] = Array.from({ length: 200 }, (_, i) => ({
  w: `w${i}`,
  start: i * 0.5,
  end: i * 0.5 + 0.4,
  speaker: i < 100 ? 'A' : 'B',
}));
const VALUE: [number, number] = [10, 20];
const onSeek = () => undefined;
const onValueChange = () => undefined;

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
  renders.length = 0;
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

const at = (t: number, value: [number, number] = VALUE) =>
  act(() =>
    root.render(
      <WordTimeline
        words={WORDS}
        value={value}
        currentTime={t}
        onSeek={onSeek}
        onValueChange={onValueChange}
        followPlayhead={false}
      />,
    ),
  );

describe('WordTimeline render cost', () => {
  it('a playhead tick re-renders only the words whose state changed', () => {
    at(0.1);
    expect(renders).toHaveLength(200);

    // Same word under the playhead: nothing re-renders.
    renders.length = 0;
    at(0.2);
    expect(renders).toEqual([]);

    // Playhead moves from word 0 to word 1: only those two.
    renders.length = 0;
    at(0.6);
    expect([...renders].sort((a, b) => a - b)).toEqual([0, 1]);

    // Gap between words: only the word that lost the mark.
    renders.length = 0;
    at(0.95);
    expect(renders).toEqual([1]);
  });

  it('moving the out point re-renders only the words around the change', () => {
    at(0.1);
    renders.length = 0;
    at(0.1, [10, 22]);
    // [10, 20] covers words 20..39; [10, 22] covers 20..43. Word 39 loses the
    // end edge, 40..43 join (43 is the new end); 20..38 stay untouched.
    expect([...renders].sort((a, b) => a - b)).toEqual([39, 40, 41, 42, 43]);
  });
});
