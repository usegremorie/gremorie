import { paletteColor, titleCaseKey } from './types';

describe('paletteColor', () => {
  it('assigns the five categorical slots in fixed order', () => {
    expect([0, 1, 2, 3, 4].map(paletteColor)).toEqual([
      'var(--chart-cat-1)',
      'var(--chart-cat-2)',
      'var(--chart-cat-3)',
      'var(--chart-cat-4)',
      'var(--chart-cat-5)',
    ]);
  });

  it('repeats the scale past the fifth series', () => {
    expect(paletteColor(5)).toBe('var(--chart-cat-1)');
    expect(paletteColor(6)).toBe('var(--chart-cat-2)');
    expect(paletteColor(12)).toBe('var(--chart-cat-3)');
  });

  it('never hands out a colour from outside the scale', () => {
    for (let i = 0; i < 40; i++) {
      expect(paletteColor(i)).toMatch(/^var\(--chart-cat-[1-5]\)$/);
    }
  });
});

describe('titleCaseKey', () => {
  it('turns a data key into a readable label', () => {
    expect(titleCaseKey('total_revenue')).toBe('Total Revenue');
    expect(titleCaseKey('active-users')).toBe('Active Users');
  });
});
