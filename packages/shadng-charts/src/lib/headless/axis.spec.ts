import { computeTicks } from './axis';

describe('computeTicks', () => {
  it('returns evenly spaced ticks from 0 to max inclusive', () => {
    expect(computeTicks(100, 4)).toEqual([0, 25, 50, 75, 100]);
  });

  it('honors the requested count', () => {
    expect(computeTicks(100, 2)).toEqual([0, 50, 100]);
  });

  it('handles a zero max as a single [0]', () => {
    expect(computeTicks(0, 5)).toEqual([0]);
  });

  it('guards against a non-positive count', () => {
    expect(computeTicks(100, 0)).toEqual([0]);
    expect(computeTicks(100, -2)).toEqual([0]);
  });
});
