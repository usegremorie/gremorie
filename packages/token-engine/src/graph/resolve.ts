import type { TokenGraph, ColorMode, ThemeId, TokenValue } from './types.js';
import { tokenKey } from './types.js';

// Cycle guard: we record the reference target before recursing so a cycle
// A → B → A is caught when B → A re-enters resolveValue with A already in `visited`.
export function resolveValue(
  graph: TokenGraph,
  value: TokenValue,
  theme: ThemeId,
  mode: ColorMode,
  visited: Set<string> = new Set(),
): string | null {
  if (value.kind === 'literal') return value.raw;
  if (visited.has(value.targetName)) return null;
  visited.add(value.targetName);
  return resolveToColor(graph, value.targetName, theme, mode, visited);
}

export function resolveToColor(
  graph: TokenGraph,
  tokenName: string,
  theme: ThemeId,
  mode: ColorMode,
  visited: Set<string> = new Set(),
): string | null {
  const key = tokenKey({ theme, mode, name: tokenName });
  const prim = graph.primitives[key];
  if (prim) return prim.value;

  const sem = graph.semantics[key];
  if (sem) return resolveValue(graph, sem.value, theme, mode, visited);

  return null;
}
