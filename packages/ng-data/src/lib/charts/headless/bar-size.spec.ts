import { barSize, fitBar } from './bar';

// recharts' grouped-bar sizing (combineAllBarPositions): BAR_GAP between the
// bars of one category, dropped when it does not fit, and whole pixels only
// when the bar is wider than 1px.
describe('barSize', () => {
  it('truncates a single bar to whole pixels, like recharts', () => {
    expect(barSize(40.4, 1)).toBe(40);
  });

  it('puts a 4px gap between grouped bars', () => {
    expect(barSize(100, 2)).toBe(48);
  });

  it('drops the gap instead of drawing nothing in a dense band', () => {
    expect(barSize(8, 3)).toBeGreaterThan(0);
  });

  it('keeps a sub-pixel bar instead of truncating it to 0', () => {
    expect(barSize(2, 3)).toBeCloseTo(2 / 3);
  });
});

// recharts' maxBarSize (getBarPositions): the bar takes min(slot, max) and is
// centred in its own slot, so a capped group keeps its spacing.
describe('fitBar', () => {
  it('leaves a bar narrower than the cap untouched', () => {
    expect(fitBar(20, 32)).toEqual({ size: 20, offset: 0 });
  });

  it('caps a wide bar and centres it in its slot', () => {
    expect(fitBar(100, 32)).toEqual({ size: 32, offset: 34 });
  });

  it('does nothing without a cap', () => {
    expect(fitBar(100)).toEqual({ size: 100, offset: 0 });
  });
});
