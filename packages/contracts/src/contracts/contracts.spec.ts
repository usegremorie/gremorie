import { describe, it, expect } from 'vitest';
import { CONTRACTS } from '../index';

describe('CONTRACTS', () => {
  it('includes chart-artifact with its known props and guidance', () => {
    const c = CONTRACTS.find((x) => x.name === 'chart-artifact');
    expect(c).toBeTruthy();
    const names = c!.props.map((p) => p.name);
    expect(names).toEqual(
      expect.arrayContaining([
        'title',
        'data',
        'type',
        'categoryKey',
        'valueKey',
      ]),
    );
    expect(c!.guidance.whenNotToUse?.length).toBeGreaterThan(0);
  });

  it('has unique contract names', () => {
    const names = CONTRACTS.map((c) => c.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
