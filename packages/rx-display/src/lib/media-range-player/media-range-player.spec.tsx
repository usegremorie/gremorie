import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { MediaRangePlayer } from './media-range-player';
import {
  contextWindow,
  formatTime,
  shouldStop,
  toPercent,
} from './media-range-player.logic';

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

describe('MediaRangePlayer markup', () => {
  const html = renderToStaticMarkup(
    <MediaRangePlayer src="/v.mp4" range={[40, 70]} context={30} />,
  );

  it('renders a metadata-only video with the source', () => {
    expect(html).toContain('preload="metadata"');
    expect(html).toContain('src="/v.mp4"');
  });

  it('defers loading when preload is none', () => {
    expect(
      renderToStaticMarkup(
        <MediaRangePlayer src="/v.mp4" range={[40, 70]} preload="none" />,
      ),
    ).toContain('preload="none"');
  });

  it('places the clip at a third of the context window', () => {
    // window = [10, 100]; clip 40..70 -> left 33.3%, width 33.3%
    expect(html).toMatch(
      /data-slot="media-range-player-range"[^>]*left:33\.33\d*%/,
    );
    expect(html).toMatch(/width:33\.33\d*%/);
  });

  it('uses default English labels and accepts overrides', () => {
    expect(html).toContain('Play clip');
    const pt = renderToStaticMarkup(
      <MediaRangePlayer
        src="/v.mp4"
        range={[40, 70]}
        labels={{ playClip: 'Tocar trecho' }}
      />,
    );
    expect(pt).toContain('Tocar trecho');
    expect(pt).toContain('Play with context');
  });
});
