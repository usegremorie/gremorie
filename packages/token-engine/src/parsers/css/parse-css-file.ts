import { parsePrimitives } from './primitives.js';
import { parseSemantics } from './semantics.js';
import { buildGraph } from './build-graph.js';
import type { TokenGraph } from '../../graph/types.js';

export function parseCssFile(css: string, sourceFile: string): TokenGraph {
  const primitives = parsePrimitives(css, sourceFile);
  const semantics = parseSemantics(css, sourceFile);
  return buildGraph({ primitives, semantics, components: [] });
}
