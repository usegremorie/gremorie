import { polarLayout, polarPoint, polygonPath, spokeIndexAt } from './polar';

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
