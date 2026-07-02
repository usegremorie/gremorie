import { describe, it, expect } from 'vitest';
import { defineContract } from './types';

describe('defineContract', () => {
  it('returns the contract and rejects an empty name', () => {
    const c = defineContract({
      name: 'demo',
      category: 'test',
      anatomy: '<demo/>',
      props: [{ name: 'value', type: 'string' }],
      guidance: { summary: 's', whenToUse: ['x'] },
    });
    expect(c.name).toBe('demo');
    expect(() =>
      defineContract({
        name: '',
        category: 'test',
        anatomy: '',
        props: [],
        guidance: { summary: '', whenToUse: [] },
      }),
    ).toThrow();
  });
});
