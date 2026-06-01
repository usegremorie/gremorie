import { computeLinePath } from './line';
import type { Datum } from './types';

describe('computeLinePath', () => {
  const data: Datum[] = [
    { month: 'Jan', sales: 0 },
    { month: 'Feb', sales: 50 },
    { month: 'Mar', sales: 100 },
  ];
  const xScale = (v: string) =>
    (({ Jan: 0, Feb: 100, Mar: 200 }) as Record<string, number>)[v] ?? 0;
  const yScale = (v: number) => 200 - (v / 100) * 200;

  it('builds an open line path through the points (no Z close)', () => {
    const d = computeLinePath(data, 'month', 'sales', xScale, yScale);
    expect(d.startsWith('M')).toBe(true);
    expect(d).toContain('0,200');
    expect(d).toContain('200,0');
    expect(d.endsWith('Z')).toBe(false);
  });

  it('returns empty string when data is empty', () => {
    expect(computeLinePath([], 'month', 'sales', xScale, yScale)).toBe('');
  });
});
