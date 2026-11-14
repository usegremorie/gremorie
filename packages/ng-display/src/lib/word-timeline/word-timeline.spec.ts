import { Component, signal } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { WordTimeline, type WordTimelineLabels } from './word-timeline';
import {
  activeIndex,
  inRange,
  setBoundary,
  speakerTurns,
  type TimelineWord,
} from './word-timeline.logic';

// Same cases as the React edition's word-timeline.spec.tsx and
// word-timeline.dom.spec.tsx, so both editions are held to one behaviour.

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
    expect(setBoundary(WORDS, [2.0, 2.9], 1, 'out')).toEqual([0.5, 1.0]);
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

/**
 * Controlled harness, like a real caller: keeps `value` in a signal and feeds
 * it back. Signals (not plain fields) because the suite runs zoneless.
 */
@Component({
  standalone: true,
  imports: [WordTimeline],
  template: `
    <form (submit)="submitted($event)">
      <gr-word-timeline
        [words]="words()"
        [value]="value()"
        [currentTime]="currentTime()"
        [speakerNames]="speakerNames()"
        [labels]="labels()"
        [followPlayhead]="followPlayhead()"
        (valueChange)="onValue($event)"
        (seek)="seek($event)"
      />
    </form>
  `,
})
class Host {
  readonly words = signal<TimelineWord[]>(WORDS);
  readonly value = signal<[number, number]>([0, 2.9]);
  readonly currentTime = signal<number | undefined>(undefined);
  readonly speakerNames = signal<Record<string, string> | undefined>(undefined);
  readonly labels = signal<Partial<WordTimelineLabels>>({});
  readonly followPlayhead = signal(true);
  readonly valueChange = vi.fn();
  readonly seek = vi.fn();
  readonly submitted = vi.fn((e: Event) => e.preventDefault());

  onValue(v: [number, number]): void {
    this.value.set(v);
    this.valueChange(v);
  }
}

interface Setup {
  value?: [number, number];
  currentTime?: number;
  speakerNames?: Record<string, string>;
  labels?: Partial<WordTimelineLabels>;
}

function mount(setup: Setup = {}) {
  TestBed.configureTestingModule({ imports: [Host] });
  const fixture: ComponentFixture<Host> = TestBed.createComponent(Host);
  const h = fixture.componentInstance;
  if (setup.value) h.value.set(setup.value);
  if (setup.currentTime !== undefined) h.currentTime.set(setup.currentTime);
  if (setup.speakerNames) h.speakerNames.set(setup.speakerNames);
  if (setup.labels) h.labels.set(setup.labels);
  fixture.detectChanges();
  document.body.appendChild(fixture.nativeElement);
  const root = fixture.nativeElement as HTMLElement;

  /** Visible word text (the button also holds screen-reader-only clip state). */
  const wordText = (b: Element) => b.firstChild?.textContent ?? null;
  const words = () =>
    Array.from(
      root.querySelectorAll<HTMLButtonElement>(
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
      root.querySelectorAll<HTMLButtonElement>(
        '[data-slot="toggle-group-item"]',
      ),
    ).find((b) => b.textContent?.trim() === label);
    if (!found) throw new Error(`mode ${label} not rendered`);
    return found;
  };
  const render = () => fixture.detectChanges();
  const click = (el: HTMLElement) => {
    el.click();
    render();
  };
  const inRangeWords = () =>
    words()
      .filter((b) => b.dataset['inRange'] === 'true')
      .map(wordText);
  const lastValue = () => h.valueChange.mock.lastCall?.[0] as [number, number];
  const sr = (text: string) =>
    word(text).querySelector('.sr-only')?.textContent ?? '';
  const tabStops = () =>
    words()
      .filter((b) => b.tabIndex === 0)
      .map(wordText);
  const key = (k: string) => {
    document.activeElement?.dispatchEvent(
      new KeyboardEvent('keydown', { key: k, bubbles: true }),
    );
    render();
  };
  const destroy = () => {
    fixture.nativeElement.remove();
    fixture.destroy();
  };

  return {
    fixture,
    h,
    root,
    words,
    word,
    wordText,
    modeButton,
    render,
    click,
    inRangeWords,
    lastValue,
    sr,
    tabStops,
    key,
    destroy,
  };
}

describe('WordTimeline markup', () => {
  it('marks the words inside the range and the word under the playhead', () => {
    const t = mount({ value: [1.2, 2.4], currentTime: 1.8 });
    expect(t.inRangeWords()).toEqual(['Thanks', 'for', 'having']);
    expect(
      t
        .words()
        .filter((b) => b.dataset['current'] === 'true')
        .map(t.wordText),
    ).toEqual(['for']);
    t.destroy();
  });

  it('shows speaker labels at each turn, with names when known', () => {
    const t = mount({ speakerNames: { B: 'Guest' } });
    const labels = Array.from(
      t.root.querySelectorAll('[data-slot="word-timeline-speaker"]'),
    ).map((s) => s.textContent?.trim());
    expect(labels).toEqual(['A', 'Guest']);
    t.destroy();
  });

  it('renders words as type="button" buttons, in reading order', () => {
    const t = mount();
    const list = t.words();
    expect(list.map(t.wordText)).toEqual(WORDS.map((w) => w.w));
    for (const b of list) expect(b.getAttribute('type')).toBe('button');
    t.destroy();
  });

  it('carries its data-slot on the host', () => {
    const t = mount();
    expect(
      t.root.querySelector('gr-word-timeline')?.getAttribute('data-slot'),
    ).toBe('word-timeline');
    t.destroy();
  });
});

describe('WordTimeline (DOM)', () => {
  it('starts in seek mode: a click seeks to the word start and keeps the range', () => {
    const t = mount();
    expect(t.modeButton('Seek').getAttribute('data-state')).toBe('on');
    t.click(t.word('having'));
    expect(t.h.seek).toHaveBeenCalledWith(2.0);
    expect(t.h.valueChange).not.toHaveBeenCalled();
    t.destroy();
  });

  it('"Set in" moves the start to the clicked word', () => {
    const t = mount();
    t.click(t.modeButton('Set in'));
    expect(t.modeButton('Set in').getAttribute('data-state')).toBe('on');
    t.click(t.word('for'));
    expect(t.lastValue()).toEqual([1.7, 2.9]);
    expect(t.h.seek).not.toHaveBeenCalled();
    expect(t.inRangeWords()).toEqual(['for', 'having', 'me.']);
    t.destroy();
  });

  it('"Set out" on a word before the start moves the start too, never inverting', () => {
    const t = mount({ value: [2.0, 2.9] });
    t.click(t.modeButton('Set out'));
    t.click(t.word('morning.'));
    const [a, b] = t.lastValue();
    expect([a, b]).toEqual([0.5, 1.0]);
    expect(a).toBeLessThan(b);
    expect(t.inRangeWords()).toEqual(['morning.']);
    t.destroy();
  });

  it('"Set in" on a word after the end moves the end too, never inverting', () => {
    const t = mount({ value: [0, 1.0] });
    t.click(t.modeButton('Set in'));
    t.click(t.word('having'));
    const [a, b] = t.lastValue();
    expect([a, b]).toEqual([2.0, 2.4]);
    expect(a).toBeLessThan(b);
    expect(t.inRangeWords()).toEqual(['having']);
    t.destroy();
  });

  it('a sequence of boundary clicks keeps the range ordered', () => {
    const t = mount();
    const steps: [string, string][] = [
      ['Set out', 'Good'],
      ['Set in', 'me.'],
      ['Set out', 'Thanks'],
      ['Set in', 'having'],
      ['Set out', 'morning.'],
    ];
    for (const [mode, w] of steps) {
      t.click(t.modeButton(mode));
      t.click(t.word(w));
      const [a, b] = t.lastValue();
      expect(a).toBeLessThan(b);
    }
    t.destroy();
  });

  it('clicking the pressed mode again keeps a mode selected', () => {
    const t = mount();
    t.click(t.modeButton('Seek'));
    expect(t.modeButton('Seek').getAttribute('data-state')).toBe('on');
    t.destroy();
  });

  it('moves the current-word mark with currentTime', () => {
    const t = mount({ currentTime: 0.2 });
    const current = () =>
      t
        .words()
        .filter((b) => b.dataset['current'] === 'true')
        .map(t.wordText);
    expect(current()).toEqual(['Good']);
    t.h.currentTime.set(2.6);
    t.render();
    expect(current()).toEqual(['me.']);
    t.h.currentTime.set(1.1);
    t.render();
    expect(current()).toEqual([]);
    t.destroy();
  });

  it('inside a form, every control is type="button" and never submits', () => {
    const t = mount({ labels: { group: 'Palavras', seek: 'Ir' } });
    const buttons = Array.from(t.root.querySelectorAll('button'));
    expect(buttons).toHaveLength(9);
    for (const b of buttons) expect(b.getAttribute('type')).toBe('button');
    t.click(t.word('for'));
    t.click(t.modeButton('Set in'));
    expect(t.h.submitted).not.toHaveBeenCalled();
    expect(
      t.root
        .querySelector('[role="group"][aria-label]')
        ?.getAttribute('aria-label'),
    ).toBe('Palavras');
    expect(t.modeButton('Ir')).toBeTruthy();
    t.destroy();
  });

  it('activating a focused word seeks', () => {
    const t = mount();
    const list = t.words();
    list[3].focus();
    expect(document.activeElement).toBe(list[3]);
    // Native buttons turn Enter/Space into click; jsdom does not, so click.
    t.click(list[3]);
    expect(t.h.seek).toHaveBeenCalledWith(1.7);
    t.destroy();
  });
});

describe('WordTimeline roving tab stop', () => {
  it('exactly one word is a tab stop: the spoken word, else the first', () => {
    const t = mount();
    expect(t.tabStops()).toEqual(['Good']);
    for (const b of t.words().slice(1)) expect(b.tabIndex).toBe(-1);
    t.h.currentTime.set(1.8);
    t.render();
    expect(t.tabStops()).toEqual(['for']);
    t.destroy();
  });

  it('arrows, Home and End move focus and the tab stop follows', () => {
    const t = mount();
    t.word('Good').focus();
    t.render();
    t.key('ArrowRight');
    expect(document.activeElement).toBe(t.word('morning.'));
    expect(t.tabStops()).toEqual(['morning.']);
    t.key('ArrowRight');
    t.key('ArrowLeft');
    expect(document.activeElement).toBe(t.word('morning.'));
    t.key('End');
    expect(document.activeElement).toBe(t.word('me.'));
    t.key('ArrowRight');
    expect(document.activeElement).toBe(t.word('me.'));
    t.key('Home');
    expect(document.activeElement).toBe(t.word('Good'));
    t.key('ArrowLeft');
    expect(document.activeElement).toBe(t.word('Good'));
    expect(t.tabStops()).toEqual(['Good']);
    t.destroy();
  });

  it('the last focused word stays the tab stop as the playhead moves', () => {
    const t = mount({ currentTime: 0.2 });
    t.word('having').focus();
    t.render();
    t.h.currentTime.set(2.6);
    t.render();
    expect(t.tabStops()).toEqual(['having']);
    t.destroy();
  });
});

describe('WordTimeline clip state without color', () => {
  it('marks start and end edges, in-clip words and the spoken word', () => {
    const t = mount({ value: [1.2, 2.4], currentTime: 1.8 });
    expect(t.word('Thanks').dataset['edge']).toBe('start');
    expect(t.word('having').dataset['edge']).toBe('end');
    expect(t.word('for').dataset['edge']).toBe('none');
    expect(t.word('Good').dataset['edge']).toBe('none');
    expect(t.sr('Thanks')).toBe(', clip start');
    expect(t.sr('for')).toBe(', in clip');
    expect(t.sr('having')).toBe(', clip end');
    expect(t.sr('Good')).toBe('');
    expect(t.sr('me.')).toBe('');
    expect(t.word('for').getAttribute('aria-current')).toBe('true');
    expect(
      t
        .words()
        .filter((b) => b.hasAttribute('aria-current'))
        .map(t.wordText),
    ).toEqual(['for']);
    t.destroy();
  });

  it('a one-word clip is both start and end; labels are overridable', () => {
    const t = mount({
      value: [1.7, 1.9],
      labels: { clipStart: 'início', clipEnd: 'fim', inClip: 'no trecho' },
    });
    expect(t.word('for').dataset['edge']).toBe('both');
    expect(t.sr('for')).toBe(', início, fim');
    t.destroy();
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
        if (this.getAttribute('aria-label') === 'Transcript words')
          return rect(0, 100);
        const t = tops[this.firstChild?.textContent ?? ''] ?? 10;
        return rect(t, t + 20);
      });
    const t = mount({ currentTime: 0.2 });
    // The mode toggle group is also role="group" (the spartan brain sets it),
    // so target the word strip by its accessible name.
    const strip = t.root.querySelector<HTMLElement>(
      '[role="group"][aria-label="Transcript words"]',
    );
    if (!strip) throw new Error('strip not rendered');
    expect(strip.scrollTop).toBe(0);
    t.h.currentTime.set(2.6);
    t.render();
    expect(strip.scrollTop).toBe(220);

    strip.scrollTop = 0;
    t.word('Good').focus();
    t.h.currentTime.set(0.2);
    t.render();
    t.h.currentTime.set(2.6);
    t.render();
    expect(strip.scrollTop).toBe(0);

    (document.activeElement as HTMLElement).blur();
    t.h.followPlayhead.set(false);
    t.h.currentTime.set(0.2);
    t.render();
    t.h.currentTime.set(2.6);
    t.render();
    expect(strip.scrollTop).toBe(0);
    spy.mockRestore();
    t.destroy();
  });
});
