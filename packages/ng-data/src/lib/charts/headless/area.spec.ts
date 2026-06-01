import { computeAreaPath } from './area';
import type { Datum } from './types';

describe('computeAreaPath', () => {
  const data: Datum[] = [
    { month: 'Jan', sales: 0 },
    { month: 'Feb', sales: 50 },
    { month: 'Mar', sales: 100 },
  ];
  const xScale = (v: string) =>
    (({ Jan: 0, Feb: 100, Mar: 200 }) as Record<string, number>)[v] ?? 0;
  const yScale = (v: number) => 200 - (v / 100) * 200;

  it('builds an area path from data through the scales to the baseline', () => {
    const d = computeAreaPath(data, 'month', 'sales', xScale, yScale, 200);
    expect(d.startsWith('M')).toBe(true);
    expect(d.endsWith('Z')).toBe(true);
    expect(d).toContain('0,200'); // Jan: x=0, y=200 (sales 0 -> bottom)
    expect(d).toContain('200,0'); // Mar: x=200, y=0   (sales 100 -> top)
  });

  it('returns empty string when data is empty', () => {
    expect(computeAreaPath([], 'month', 'sales', xScale, yScale, 200)).toBe('');
  });
});
