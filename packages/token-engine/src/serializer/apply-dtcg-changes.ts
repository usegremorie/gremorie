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
    if (typeof node !== 'object' || node === null) return undefined;
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
      // A file the source does not have yet (a new theme) starts empty.
      value = text === undefined ? {} : (JSON.parse(text) as Json);
      parsed.set(rel, value);
    }
    return value;
  };
  const touched = new Set<string>();
  const primitiveFiles = [...THEME_BLOCK_PRIMITIVES, ...ROOT_PRIMITIVES];
  const baseToken = (path: string[]) =>
    [...primitiveFiles, 'semantic/light.json']
      .map((rel) => getToken(doc(rel), path))
      .find((t) => t !== undefined);

  for (const change of changes) {
    const path = cssNameToPath(change.tokenName);
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
    const base = baseToken(path);
    if (!base) {
      throw new DtcgChangeError(`${change.tokenName} is not in the base layer`);
    }
    let value: unknown;
    if (change.newValue.kind === 'reference') {
      value = `{${cssNameToPath(change.newValue.targetName).join('.')}}`;
    } else if (base.$type === 'color') {
      value = color(change.newValue.raw);
    } else {
      throw new DtcgChangeError(
        `Only colour literals can be edited: ${change.tokenName}`,
      );
    }
    let rel: string;
    let group: Json;
    if (change.theme === 'default') {
      const shadow = ROOT_PRIMITIVES.find((f) => getToken(doc(f), path));
      rel =
        change.mode === 'dark'
          ? 'semantic/dark.json'
          : (shadow ?? 'semantic/light.json');
      group = doc(rel);
    } else {
      if (!/^[a-z0-9-]+$/.test(change.theme)) {
        throw new DtcgChangeError(`Not a theme name: ${change.theme}`);
      }
      rel = `themes/${change.theme}.json`;
      const theme = doc(rel);
      if (
        typeof theme[change.mode] !== 'object' ||
        theme[change.mode] === null
      ) {
        theme[change.mode] = {};
      }
      group = theme[change.mode] as Json;
    }
    const existing = getToken(group, path);
    if (existing) existing.$value = value;
    else setToken(group, path, { $type: base.$type, $value: value });
    touched.add(rel);
  }
  return Object.fromEntries(
    [...touched].map((rel) => [
      rel,
      JSON.stringify(parsed.get(rel), null, 2) + '\n',
    ]),
  );
}
