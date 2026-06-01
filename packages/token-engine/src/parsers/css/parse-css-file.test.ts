import { describe, it, expect } from 'vitest';
import { parseCssFile } from './parse-css-file.js';

const css = `
@theme {
  --color-gray-50: oklch(0.98 0 0);
  --color-gray-900: oklch(0.2 0 0);
}

:root {
  --background: var(--color-gray-50);
}

.dark {
  --background: var(--color-gray-900);
}
`;

describe('parseCssFile', () => {
  it('returns a graph with primitives, semantics, and themes', () => {
    const graph = parseCssFile(css, 'globals.css');
    expect(Object.keys(graph.primitives)).toHaveLength(2);
    expect(Object.keys(graph.semantics)).toHaveLength(2);
    expect(graph.themes).toEqual(['default']);
  });
});
