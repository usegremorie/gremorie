import { computeLinePath } from './line';
import type { Datum } from './types';

describe('computeLinePath', () => {
  const data: Datum[] = [
    { month: 'Jan', sales: 0 },
    { month: 'Feb', sales: 50 },
    { month: 'Mar', sales: 100 },
  ];
  const xScale = (i: number) => i * 100;
  const yScale = (v: number) => 200 - (v / 100) * 200;

  it('builds an open line path through the points (no Z close)', () => {
    const d = computeLinePath(data, 'sales', xScale, yScale);
    expect(d.startsWith('M')).toBe(true);
    expect(d).toContain('0,200');
    expect(d).toContain('200,0');
    expect(d.endsWith('Z')).toBe(false);
  });

  it('returns empty string when data is empty', () => {
    expect(computeLinePath([], 'sales', xScale, yScale)).toBe('');
  });

  it('draws one point per datum when x labels repeat', () => {
    const rep: Datum[] = ['J', 'F', 'J', 'F'].map((month, i) => ({
      month,
      sales: i * 10,
    }));
    const d = computeLinePath(rep, 'sales', xScale, yScale);
    expect(d).toContain('300,');
    expect(d).toContain('200,');
  });
});
