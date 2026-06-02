import type {
  TokenGraph,
  PrimitiveToken,
  SemanticToken,
  ComponentInfo,
} from '../../graph/types.js';
import { tokenKey } from '../../graph/types.js';

interface Inputs {
  primitives: PrimitiveToken[];
  semantics: SemanticToken[];
  components: ComponentInfo[];
}

export function buildGraph(inputs: Inputs): TokenGraph {
  const primitives: Record<string, PrimitiveToken> = {};
  const semantics: Record<string, SemanticToken> = {};
  const components: Record<string, ComponentInfo> = {};
  const themeSet = new Set<string>();

  for (const p of inputs.primitives) {
    primitives[tokenKey(p)] = p;
    themeSet.add(p.theme);
  }
  for (const s of inputs.semantics) {
    semantics[tokenKey(s)] = s;
    themeSet.add(s.theme);
  }
  for (const c of inputs.components) {
    components[c.name] = c;
  }

  return { primitives, semantics, components, themes: Array.from(themeSet) };
}
