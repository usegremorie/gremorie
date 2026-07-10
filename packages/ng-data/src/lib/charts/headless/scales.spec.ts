import { bandScale, linearScale, pointScale, niceMax } from './scales';

describe('linearScale', () => {
  it('maps domain to range (inverted Y: 0 at bottom)', () => {
    const y = linearScale([0, 100], [200, 0]);
    expect(y(0)).toBe(200);
    expect(y(100)).toBe(0);
    expect(y(50)).toBe(100);
  });
});

describe('pointScale', () => {
  it('places categories evenly across the range', () => {
    const x = pointScale(['a', 'b', 'c'], [0, 100]);
    expect(x('a')).toBe(0);
    expect(x('c')).toBe(100);
    expect(x('b')).toBe(50);
  });
});

describe('bandScale', () => {
  it('splits the range into equal slots (no padding)', () => {
    const b = bandScale(['a', 'b'], [0, 100], 0);
    expect(b.bandwidth).toBe(50);
    expect(b('a')).toBe(0);
    expect(b('b')).toBe(50);
  });

  it('reserves padding between bands', () => {
    const b = bandScale(['a', 'b'], [0, 100], 0.5);
    // padding shrinks bandwidth below the no-padding slot size
    expect(b.bandwidth).toBeLessThan(50);
    expect(b.bandwidth).toBeGreaterThan(0);
    expect(b('b')).toBeGreaterThan(b('a'));
  });
});

describe('niceMax', () => {
  it('rounds a raw max up to the same bound recharts picks for the data', () => {
    // 305 / 4 intervals -> rough step 76.25 -> step 80 -> bound 320, matching
    // the React edition's axis (0 / 80 / 160 / 240 / 320) for the same data.
    expect(niceMax(305)).toBe(320);
    expect(niceMax(100)).toBe(100); // round maxes stay round (step 25)
    expect(niceMax(87)).toBe(100);
    expect(niceMax(12)).toBe(12);
    expect(niceMax(0)).toBe(1);
  });
});
