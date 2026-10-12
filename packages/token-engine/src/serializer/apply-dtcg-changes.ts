import { cssNameToPath, parseOklch } from '../parsers/dtcg/values.js';
import {
  ROOT_PRIMITIVES,
  THEME_BLOCK_PRIMITIVES,
} from '../parsers/dtcg/load-dtcg.js';
import type { Change } from './apply-changes.js';

/** An edit the DTCG source cannot hold; the server answers 400. */
export class DtcgChangeError extends Error {}

type Json = Record<string, unknown>;
interface Token {
  $type: string;
  $value: unknown;
  [key: string]: unknown;
}

const getToken = (group: unknown, path: string[]): Token | undefined => {
  let node: unknown = group;
  for (const key of path) {
    // Own keys only: a path such as ['__proto__'] must not reach a prototype.
    if (
      typeof node !== 'object' ||
      node === null ||
      !Object.hasOwn(node, key)
    ) {
      return undefined;
    }
    node = (node as Json)[key];
  }
  return typeof node === 'object' && node !== null && '$value' in node
    ? (node as Token)
    : undefined;
};

/** parseOklch throws a plain Error; an editor typo must answer 400, not 500. */
const color = (raw: string) => {
  try {
    return parseOklch(raw);
  } catch (error) {
    throw new DtcgChangeError((error as Error).message);
  }
};

const setToken = (group: Json, path: string[], token: Token) => {
  const leaf = path[path.length - 1];
  if (leaf === undefined) throw new DtcgChangeError('Empty token path');
  let node = group;
  for (const key of path.slice(0, -1)) {
    if (typeof node[key] !== 'object' || node[key] === null) node[key] = {};
    node = node[key] as Json;
  }
  node[leaf] = token;
};

/**
 * Applies editor changes to the DTCG files (rel path → JSON text) and returns
 * only the files that changed, as `JSON.stringify(…, null, 2)` text. The
 * server formats them with Prettier and rebuilds the CSS.
 */
export function applyDtcgChanges(
  files: Record<string, string>,
  changes: Change[],
): Record<string, string> {
  const parsed = new Map<string, Json>();
  const doc = (rel: string): Json => {
    let value = parsed.get(rel);
    if (!value) {
      const text = files[rel];
      value = text === undefined ? {} : (JSON.parse(text) as Json);
      parsed.set(rel, value);
    }
    return value;
  };
  const touched = new Set<string>();
  const primitiveFiles = [...THEME_BLOCK_PRIMITIVES, ...ROOT_PRIMITIVES];
  /** The base-layer file that defines a path, and the token there. */
  const baseOf = (path: string[]) =>
    [...primitiveFiles, 'semantic/light.json']
      .map((rel) => ({ rel, token: getToken(doc(rel), path) }))
      .find((f) => f.token !== undefined);
  const pathOf = (name: string) => {
    try {
      return cssNameToPath(name);
    } catch (error) {
      throw new DtcgChangeError((error as Error).message);
    }
  };

  for (const change of changes) {
    const path = pathOf(change.tokenName);
    if (change.kind === 'primitive-value') {
      const found = primitiveFiles
        .map((rel) => ({ rel, token: getToken(doc(rel), path) }))
        .find((f) => f.token !== undefined);
      if (!found?.token) {
        throw new DtcgChangeError(`Unknown primitive ${change.tokenName}`);
      }
      if (found.token.$type !== 'color') {
        throw new DtcgChangeError(
          `Only colour primitives can be edited: ${change.tokenName}`,
        );
      }
      found.token.$value = color(change.newValue);
      touched.add(found.rel);
      continue;
    }
    if (change.mode !== 'light' && change.mode !== 'dark') {
      throw new DtcgChangeError(`Unknown mode ${String(change.mode)}`);
    }
    const base = baseOf(path);
    if (!base?.token) {
      throw new DtcgChangeError(`${change.tokenName} is not in the base layer`);
    }
    const baseType = base.token.$type;
    let value: unknown;
    if (change.newValue.kind === 'reference') {
      const target = pathOf(change.newValue.targetName);
      if (!baseOf(target)) {
        throw new DtcgChangeError(
          `Unknown reference target ${change.newValue.targetName}`,
        );
      }
      value = `{${target.join('.')}}`;
    } else if (baseType === 'color') {
      value = color(change.newValue.raw);
    } else {
      throw new DtcgChangeError(
        `Only colour literals can be edited: ${change.tokenName}`,
      );
    }
    let rel: string;
    let group: Json;
    if (change.theme === 'default') {
      if (change.mode === 'dark') {
        rel = 'semantic/dark.json';
      } else if (THEME_BLOCK_PRIMITIVES.includes(base.rel)) {
        // The light base of a primitive is the primitive itself.
        throw new DtcgChangeError(
          `${change.tokenName} is a primitive; edit it as a primitive`,
        );
      } else {
        rel = base.rel;
      }
      group = doc(rel);
    } else {
      rel = `themes/${change.theme}.json`;
      if (!/^[a-z0-9-]+$/.test(change.theme) || files[rel] === undefined) {
        throw new DtcgChangeError(`Unknown theme ${change.theme}`);
      }
      const theme = doc(rel);
      const existingGroup = Object.hasOwn(theme, change.mode)
        ? theme[change.mode]
        : undefined;
      if (typeof existingGroup !== 'object' || existingGroup === null) {
        theme[change.mode] = {};
      }
      group = theme[change.mode] as Json;
    }
    const existing = getToken(group, path);
    if (existing) existing.$value = value;
    else setToken(group, path, { $type: baseType, $value: value });
    touched.add(rel);
  }
  return Object.fromEntries(
    [...touched].map((rel) => [
      rel,
      JSON.stringify(parsed.get(rel), null, 2) + '\n',
    ]),
  );
}
