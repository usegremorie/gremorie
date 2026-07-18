import { describe, it, expect } from 'vitest';
import { kebab, checkSelectorParity } from './naming-parity';
import { CONTRACTS } from '../index';

describe('kebab', () => {
  it('PascalCase -> kebab', () => {
    expect(kebab('ScrollArea')).toBe('scroll-area');
    expect(kebab('Button')).toBe('button');
  });
});

describe('checkSelectorParity', () => {
  it('passa quando ng = gr- + kebab(rx)', () => {
    const c = {
      name: 'x',
      category: 'c',
      anatomy: '',
      props: [],
      guidance: { summary: 's', whenToUse: [] },
      tag: { rx: 'ScrollArea', ng: 'gr-scroll-area' },
    } as any;
    expect(checkSelectorParity(c).ok).toBe(true);
  });
  it('falha quando ng nao tem prefixo gr-', () => {
    const c = {
      name: 'x',
      category: 'c',
      anatomy: '',
      props: [],
      guidance: { summary: 's', whenToUse: [] },
      tag: { rx: 'ScrollArea', ng: 'scroll-area' },
    } as any;
    expect(checkSelectorParity(c).ok).toBe(false);
  });
});

describe('selector parity on real contracts (drift gate)', () => {
  for (const c of CONTRACTS) {
    it(`${c.name}: ng selector == gr- + kebab(rx)`, () => {
      const res = checkSelectorParity(c);
      if (!res.ok)
        console.warn(`${c.name}: expected ${res.expected}, got ${c.tag?.ng}`);
      expect(res.ok).toBe(true);
    });
  }
});
