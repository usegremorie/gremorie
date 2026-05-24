import { DEFAULT_MARGIN } from './headless/types';

describe('test harness', () => {
  it('runs vitest with globals and resolves package imports', () => {
    expect(DEFAULT_MARGIN.left).toBe(40);
  });
});
