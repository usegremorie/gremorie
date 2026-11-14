import type { DtcgGroup } from './model.ts';

export function setPath(
  group: DtcgGroup,
  path: readonly string[],
  value: unknown,
): void {
  const last = path[path.length - 1];
  if (last === undefined) throw new Error('setPath needs a non-empty path');
  let node = group;
  for (const key of path.slice(0, -1)) {
    const next = node[key];
    if (typeof next !== 'object' || next === null) node[key] = {};
    node = node[key] as DtcgGroup;
  }
  node[last] = value;
}

export function getPath(group: DtcgGroup, path: readonly string[]): unknown {
  let node: unknown = group;
  for (const key of path) {
    if (typeof node !== 'object' || node === null) return undefined;
    node = (node as DtcgGroup)[key];
  }
  return node;
}
