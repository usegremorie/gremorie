import { describe, it, expect } from 'vitest';
import { VERSION } from '../index.js';

describe('token-engine smoke', () => {
  it('exports VERSION', () => {
    expect(VERSION).toBe('0.0.0');
  });
});
