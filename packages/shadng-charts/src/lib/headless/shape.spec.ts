import { areaPath, linePath, type XYPoint } from './shape';

const pts: XYPoint[] = [
  { x: 0, y: 100 },
  { x: 50, y: 0 },
  { x: 100, y: 60 },
];

describe('linePath', () => {
  it('produces an SVG path string through the points', () => {
    const d = linePath(pts);
    expect(d.startsWith('M')).toBe(true);
    expect(d).toContain('100');
  });

  it('returns empty string for no points', () => {
    expect(linePath([])).toBe('');
  });
});

describe('areaPath', () => {
  it('closes the shape down to the baseline', () => {
    const d = areaPath(pts, 200);
    expect(d.startsWith('M')).toBe(true);
    expect(d).toContain('200');
    expect(d.endsWith('Z')).toBe(true);
  });
});
