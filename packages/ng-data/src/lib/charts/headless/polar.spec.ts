import {
  placeBeside,
  wrapLabel,
  polarLayout,
  polarPoint,
  polygonPath,
  spokeIndexAt,
} from './polar';

describe('polarLayout', () => {
  it('centers and fits the radius inside the smaller dimension', () => {
    const l = polarLayout(200, 120, 10);
    expect(l.cx).toBe(100);
    expect(l.cy).toBe(60);
    expect(l.radius).toBe(50); // min(200,120)/2 - 10
  });
});

describe('polarPoint', () => {
  it("places angle 0 at the top (12 o'clock)", () => {
    const p = polarPoint(0, 0, 10, 0);
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(-10);
  });

  it('places a quarter turn to the right', () => {
    const p = polarPoint(0, 0, 10, Math.PI / 2);
    expect(p.x).toBeCloseTo(10);
    expect(p.y).toBeCloseTo(0);
  });
});

describe('polygonPath', () => {
  it('builds a closed path', () => {
    const d = polygonPath([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 5, y: 10 },
    ]);
    expect(d).toBe('M0,0L10,0L5,10Z');
  });

  it('returns empty for fewer than two points', () => {
    expect(polygonPath([{ x: 1, y: 1 }])).toBe('');
  });
});

describe('spokeIndexAt', () => {
  // 6 spokes, 60 degrees apart, radius 100 centred at the origin — the same
  // geometry the radar chart builds. Mirrors recharts' axis-mode hit testing:
  // a spoke owns the wedge bounded by the midpoints to its neighbours.
  const centre = { cx: 0, cy: 0, radius: 100 };
  const at = (deg: number, r = 50) => {
    const rad = (deg * Math.PI) / 180;
    return spokeIndexAt(polarPoint(0, 0, r, rad), centre, 6);
  };

  it('resolves a pointer sitting exactly on a spoke', () => {
    expect(at(0)).toBe(0);
    expect(at(60)).toBe(1);
    expect(at(180)).toBe(3);
  });

  it('owns the whole wedge, not just the vertex', () => {
    // anywhere within 30 degrees of a spoke belongs to it
    expect(at(29)).toBe(0);
    expect(at(-29)).toBe(0);
    expect(at(31)).toBe(1);
  });

  it('claims the wedge at any radius inside the outer circle', () => {
    expect(at(20, 5)).toBe(0);
    expect(at(20, 99)).toBe(0);
  });

  it('wraps past a full turn', () => {
    expect(at(350)).toBe(0);
    expect(at(370)).toBe(0);
  });

  it('returns null outside the outer radius', () => {
    expect(at(0, 101)).toBeNull();
  });

  it('returns null at the exact centre, where there is no angle', () => {
    expect(spokeIndexAt({ x: 0, y: 0 }, centre, 6)).toBeNull();
  });
});

describe('placeBeside', () => {
  // A 100-wide box starting at 0, and a card 40 long. Offset defaults to 10,
  // the same as recharts' Tooltip.
  const BOX_START = 0;
  const BOX_EXTENT = 100;
  const CARD = 40;
  const at = (coordinate: number) =>
    placeBeside(coordinate, CARD, BOX_START, BOX_EXTENT);

  it('sits after the anchor when there is room', () => {
    expect(at(10)).toBe(20); // 10 + offset
  });

  it('flips to the near side rather than crossing the far edge', () => {
    // 60 + 10 + 40 = 110, past the box end of 100 — so flip to 60 - 40 - 10.
    expect(at(60)).toBe(10);
  });

  it('never starts before the box does', () => {
    // Flipping would land at -45, which is outside; clamp to the box start.
    expect(at(5)).toBe(15); // still room after, so no flip
    expect(placeBeside(95, 200, 0, 100)).toBe(0);
  });

  it('respects a box that does not start at the origin', () => {
    // Anchor at 210 in a box [200, 300): 220 + 40 fits, so no flip.
    expect(placeBeside(210, CARD, 200, 100)).toBe(220);
    // Anchor at 270: 280 + 40 = 320 overflows, flip to 270 - 40 - 10.
    expect(placeBeside(270, CARD, 200, 100)).toBe(220);
  });

  it('takes a custom offset', () => {
    expect(placeBeside(10, CARD, 0, 100, 0)).toBe(10);
  });
});

describe('wrapLabel', () => {
  const LONG = 'Organização e priorização de problemas: Designer UI/UX - Pleno';

  it('leaves a label that already fits alone', () => {
    expect(wrapLabel('Speed', 20)).toEqual(['Speed']);
  });

  it('breaks on word boundaries, never mid-word', () => {
    const lines = wrapLabel(LONG, 24);
    expect(lines.length).toBeGreaterThan(1);
    for (const line of lines) expect(line).not.toMatch(/^\s|\s$/);
    // nothing was lost or invented
    expect(lines.join(' ')).toBe(LONG);
  });

  it('respects the limit except for a word that cannot fit', () => {
    const lines = wrapLabel(LONG, 24);
    for (const line of lines) {
      if (!line.includes(' ')) continue; // a lone oversized word is allowed
      expect(line.length).toBeLessThanOrEqual(24);
    }
  });

  it('keeps an oversized word whole rather than cutting it', () => {
    expect(wrapLabel('Internationalization', 5)).toEqual([
      'Internationalization',
    ]);
  });

  it('is a no-op when no limit is given', () => {
    expect(wrapLabel(LONG, 0)).toEqual([LONG]);
  });
});
