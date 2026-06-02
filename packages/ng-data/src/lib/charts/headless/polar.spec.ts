import { polarLayout, polarPoint, polygonPath } from './polar';

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
