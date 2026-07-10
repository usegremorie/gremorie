/**
 * HTTP client for the Gremorie registry.
 *
 * The default base URL is the production site (https://www.gremorie.com/r —
 * the www host is canonical; the apex 307-redirects to it). For local
 * development, set `GREMORIE_REGISTRY_URL` to point at a local server
 * (e.g. `http://localhost:5020/r`).
 */
const DEFAULT_REGISTRY_URL = 'https://www.gremorie.com/r';

export type RegistryItemType =
  | 'registry:component'
  | 'registry:block'
  | 'registry:hook'
  | 'registry:lib'
  | 'registry:style'
  | 'registry:theme';

export type RegistryFileType =
  | 'registry:component'
  | 'registry:hook'
  | 'registry:lib'
  | 'registry:block'
  | 'registry:style';

export type RegistryFramework = 'ng' | 'rx' | 'vue' | 'sv';

export interface RegistryFile {
  path: string;
  content: string;
  type: RegistryFileType;
  target?: string;
}

export interface RegistryIndexEntry {
  name: string;
  type: RegistryItemType;
  framework: RegistryFramework;
  title: string;
  description: string;
  categories: string[];
  registryDependencies: string[];
}

export interface RegistryIndex {
  name: string;
  homepage: string;
  items: RegistryIndexEntry[];
}

export interface RegistryItem {
  $schema: string;
  name: string;
  type: RegistryItemType;
  framework: RegistryFramework;
  title: string;
  description: string;
  categories: string[];
  dependencies: string[];
  devDependencies?: string[];
  registryDependencies: string[];
  files: RegistryFile[];
  cssVars?: Record<string, string>;
  usage?: unknown;
}

export interface RegistryClient {
  baseUrl: string;
  fetchIndex(): Promise<RegistryIndex>;
  fetchItem(name: string, framework?: RegistryFramework): Promise<RegistryItem>;
}

export function getRegistryUrl(): string {
  return (
    process.env['GREMORIE_REGISTRY_URL']?.replace(/\/$/, '') ??
    DEFAULT_REGISTRY_URL
  );
}

export function createRegistryClient(baseUrl?: string): RegistryClient {
  const url = (baseUrl ?? getRegistryUrl()).replace(/\/$/, '');

  return {
    baseUrl: url,
    async fetchIndex(): Promise<RegistryIndex> {
      const target = `${url}/registry.json`;
      const res = await fetch(target);
      if (!res.ok) {
        throw new Error(
          `Failed to fetch registry index from ${target} (${res.status} ${res.statusText}).`,
        );
      }
      return (await res.json()) as RegistryIndex;
    },
    async fetchItem(
      name: string,
      framework: RegistryFramework = 'ng',
    ): Promise<RegistryItem> {
      const target = `${url}/${framework}/${name}.json`;
      const res = await fetch(target);
      if (!res.ok) {
        throw new Error(
          `Failed to fetch item "${name}" from ${target} (${res.status} ${res.statusText}).`,
        );
      }
      return (await res.json()) as RegistryItem;
    },
  };
}
