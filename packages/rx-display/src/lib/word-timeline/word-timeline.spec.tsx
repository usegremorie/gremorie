import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { WordTimeline } from './word-timeline';
import {
  activeIndex,
  inRange,
  setBoundary,
  speakerTurns,
  type TimelineWord,
} from './word-timeline.logic';

const WORDS: TimelineWord[] = [
  { w: 'Good', start: 0, end: 0.4, speaker: 'A' },
  { w: 'morning.', start: 0.5, end: 1.0, speaker: 'A' },
  { w: 'Thanks', start: 1.2, end: 1.6, speaker: 'B' },
  { w: 'for', start: 1.7, end: 1.9, speaker: 'B' },
  { w: 'having', start: 2.0, end: 2.4, speaker: 'B' },
  { w: 'me.', start: 2.5, end: 2.9, speaker: 'B' },
];

describe('setBoundary', () => {
  it('sets in at the word start and out at the word end', () => {
    expect(setBoundary(WORDS, [0, 2.9], 2, 'in')).toEqual([1.2, 2.9]);
    expect(setBoundary(WORDS, [0, 2.9], 3, 'out')).toEqual([0, 1.9]);
  });

  it('never returns an inverted range', () => {
    // out before current in: in moves to that word start
    expect(setBoundary(WORDS, [2.0, 2.9], 1, 'out')).toEqual([0.5, 1.0]);
    // in after current out: out moves to that word end
    expect(setBoundary(WORDS, [0, 1.0], 4, 'in')).toEqual([2.0, 2.4]);
  });

  it('never inverts for any word, mode and starting range', () => {
    const ranges: [number, number][] = [
      [0, 2.9],
      [1.2, 1.6],
      [2.0, 2.9],
      [0, 0.4],
      [1.7, 1.9],
    ];
    for (const r of ranges) {
      for (let i = 0; i < WORDS.length; i++) {
        for (const mode of ['in', 'out'] as const) {
          const [a, b] = setBoundary(WORDS, r, i, mode);
          expect(a).toBeLessThan(b);
        }
      }
    }
  });

  it('seek mode leaves the range alone', () => {
    expect(setBoundary(WORDS, [0, 1], 4, 'seek')).toEqual([0, 1]);
  });

  it('an index outside the words leaves the range alone', () => {
    expect(setBoundary(WORDS, [0, 1], 99, 'in')).toEqual([0, 1]);
  });
});

describe('helpers', () => {
  it('inRange counts overlap', () => {
    expect(inRange(WORDS[2], [1.5, 2.0])).toBe(true);
    expect(inRange(WORDS[0], [0.4, 2])).toBe(false);
  });

  it('activeIndex finds the word under the playhead', () => {
    expect(activeIndex(WORDS, 1.3)).toBe(2);
    expect(activeIndex(WORDS, 1.1)).toBe(-1);
    expect(activeIndex(WORDS, 99)).toBe(-1);
    expect(activeIndex([], 1)).toBe(-1);
  });

  it('speakerTurns marks the first word and each change', () => {
    expect([...speakerTurns(WORDS)]).toEqual([0, 2]);
  });
});

describe('WordTimeline markup', () => {
  const html = renderToStaticMarkup(
    <WordTimeline
      words={WORDS}
      value={[1.2, 2.4]}
      currentTime={1.8}
      speakerNames={{ B: 'Guest' }}
    />,
  );

  it('marks the words inside the range', () => {
    expect(html.match(/data-in-range="true"/g)).toHaveLength(3);
  });

  it('marks the word under the playhead', () => {
    expect(html.match(/data-current="true"/g)).toHaveLength(1);
  });

  it('shows speaker labels at each turn, with names when known', () => {
    expect(html).toContain('>A<');
    expect(html).toContain('>Guest<');
  });

  it('has exactly one word in the tab order (the spoken one)', () => {
    const stops = [
      ...html.matchAll(/data-slot="word-timeline-word"[^>]*tabindex="(-?\d)"/g),
    ].map((m) => m[1]);
    expect(stops).toEqual(['-1', '-1', '-1', '0', '-1', '-1']);
    expect(html).toMatch(/aria-current="true"[^>]*tabindex="0"[^>]*>for</);
  });

  it('states the clip edges in text, not only in color', () => {
    expect(html).toContain('data-edge="start"');
    expect(html).toContain('data-edge="end"');
    expect(html).toContain('<span class="sr-only">, clip start</span>');
    expect(html).toContain('<span class="sr-only">, in clip</span>');
    expect(html).toContain('<span class="sr-only">, clip end</span>');
  });

  it('renders words as buttons for keyboard use', () => {
    expect(
      html.match(/<button type="button" data-slot="word-timeline-word"/g),
    ).toHaveLength(6);
  });
});
