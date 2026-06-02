import { describe, it, expect } from 'vitest';
import type { TokenGraph } from './types.js';
import { tokenKey } from './types.js';
import { resolveValue, resolveToColor } from './resolve.js';

const graph: TokenGraph = {
  primitives: {
    [tokenKey({ theme: 'default', mode: 'light', name: '--color-gray-50' })]: {
      kind: 'primitive',
      name: '--color-gray-50',
      value: 'oklch(0.98 0 0)',
      theme: 'default',
      mode: 'light',
      sourceFile: 'g.css',
      sourceLine: 1,
    },
  },
  semantics: {
    [tokenKey({ theme: 'default', mode: 'light', name: '--background' })]: {
      kind: 'semantic',
      name: '--background',
      value: { kind: 'reference', targetName: '--color-gray-50' },
      theme: 'default',
      mode: 'light',
      sourceFile: 'g.css',
      sourceLine: 10,
    },
    [tokenKey({ theme: 'default', mode: 'light', name: '--primary' })]: {
      kind: 'semantic',
      name: '--primary',
      value: { kind: 'literal', raw: 'oklch(0.5 0.2 30)' },
      theme: 'default',
      mode: 'light',
      sourceFile: 'g.css',
      sourceLine: 11,
    },
  },
  components: {},
  themes: ['default'],
};

describe('resolve', () => {
  it("resolves a reference semantic to a primitive's value", () => {
    expect(resolveToColor(graph, '--background', 'default', 'light')).toBe(
      'oklch(0.98 0 0)',
    );
  });
  it('returns literal directly', () => {
    expect(resolveToColor(graph, '--primary', 'default', 'light')).toBe(
      'oklch(0.5 0.2 30)',
    );
  });
  it('returns null for unknown', () => {
    expect(resolveToColor(graph, '--nope', 'default', 'light')).toBeNull();
  });
  it('returns null on a reference cycle', () => {
    const cyclic: TokenGraph = {
      primitives: {},
      semantics: {
        [tokenKey({ theme: 'default', mode: 'light', name: '--foo' })]: {
          kind: 'semantic',
          name: '--foo',
          value: { kind: 'reference', targetName: '--bar' },
          theme: 'default',
          mode: 'light',
          sourceFile: 'g.css',
          sourceLine: 1,
        },
        [tokenKey({ theme: 'default', mode: 'light', name: '--bar' })]: {
          kind: 'semantic',
          name: '--bar',
          value: { kind: 'reference', targetName: '--foo' },
          theme: 'default',
          mode: 'light',
          sourceFile: 'g.css',
          sourceLine: 2,
        },
      },
      components: {},
      themes: ['default'],
    };
    expect(resolveToColor(cyclic, '--foo', 'default', 'light')).toBeNull();
  });
});
