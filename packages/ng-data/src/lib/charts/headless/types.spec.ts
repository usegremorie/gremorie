import { paletteColor, titleCaseKey } from './types';

describe('paletteColor', () => {
  it('assigns the five categorical slots in fixed order', () => {
    expect([0, 1, 2, 3, 4].map(paletteColor)).toEqual([
      'var(--chart-1)',
      'var(--chart-2)',
      'var(--chart-3)',
      'var(--chart-4)',
      'var(--chart-5)',
    ]);
  });

  it('never reuses a hue past the fifth series', () => {
    // Cycling would hand series 6 the colour of series 1, painting two
    // different series identically with no way for the reader to tell them
    // apart. A muted neutral says instead: these are not individually
    // identifiable — fold them into "Other" or change the form.
    const overflow = [5, 6, 7, 12].map(paletteColor);
    expect(overflow).toEqual([
      'var(--muted-foreground)',
      'var(--muted-foreground)',
      'var(--muted-foreground)',
      'var(--muted-foreground)',
    ]);
    expect(overflow).not.toContain('var(--chart-1)');
  });
});

describe('titleCaseKey', () => {
  it('turns a data key into a readable label', () => {
    expect(titleCaseKey('total_revenue')).toBe('Total Revenue');
    expect(titleCaseKey('active-users')).toBe('Active Users');
  });
});
