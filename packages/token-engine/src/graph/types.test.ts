import { describe, it, expect } from 'vitest';
import type {
  TokenGraph,
  PrimitiveToken,
  SemanticToken,
  TokenReference,
  ThemeId,
  ColorMode,
} from './types.js';

describe('token graph types', () => {
  it('can construct a minimal graph', () => {
    const primitive: PrimitiveToken = {
      kind: 'primitive',
      name: '--color-gray-50',
      value: 'oklch(0.98 0 0)',
      theme: 'default',
      mode: 'light',
      sourceFile: 'globals.css',
      sourceLine: 12,
    };

    const ref: TokenReference = {
      kind: 'reference',
      targetName: '--color-gray-50',
    };

    const semantic: SemanticToken = {
      kind: 'semantic',
      name: '--background',
      value: ref,
      theme: 'default',
      mode: 'light',
      sourceFile: 'globals.css',
      sourceLine: 40,
    };

    const graph: TokenGraph = {
      primitives: { [`default::light::${primitive.name}`]: primitive },
      semantics: { [`default::light::${semantic.name}`]: semantic },
      components: {},
      themes: ['default'],
    };

    expect(Object.keys(graph.primitives)).toHaveLength(1);
    expect(Object.keys(graph.semantics)).toHaveLength(1);
  });
});
