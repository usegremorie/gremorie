import { linearScale, pointScale, niceMax } from './scales';

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

describe('niceMax', () => {
  it('rounds a raw max up to a readable bound', () => {
    expect(niceMax(87)).toBe(100);
    expect(niceMax(12)).toBe(20);
    expect(niceMax(0)).toBe(1);
  });
});
