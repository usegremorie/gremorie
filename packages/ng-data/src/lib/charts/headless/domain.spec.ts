import { computeYDomain, type SeriesReg } from './domain';

describe('computeYDomain', () => {
  it('returns [0, max] across all registered series', () => {
    const regs: SeriesReg[] = [
      { key: 'sales', values: () => [10, 50, 30] },
      { key: 'profit', values: () => [5, 40, 20] },
    ];
    expect(computeYDomain(regs)).toEqual([0, 50]);
  });

  it('defaults to [0, 1] when there is no data', () => {
    expect(computeYDomain([])).toEqual([0, 1]);
    expect(computeYDomain([{ key: 'x', values: () => [] }])).toEqual([0, 1]);
  });

  it('guards against an all-zero / negative max', () => {
    expect(computeYDomain([{ key: 'x', values: () => [0, 0] }])).toEqual([
      0, 1,
    ]);
  });
});
