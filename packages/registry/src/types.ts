/**
 * Gremorie registry item schema. Compatible with shadcn-registry-item, extended
 * with a `usage` block carrying the design knowledge (when to use, antipatterns,
 * API, examples) that the MCP server feeds to the AI client.
 *
 * The shadcn-compatible fields keep the door open for the Gremorie CLI to consume
 * shadcn registries (and vice-versa) without translation.
 */
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

export interface RegistryFile {
  /** Relative path the CLI should write to inside the target project. */
  path: string;
  /** Source file content (verbatim copy from the package). */
  content: string;
  /** Categorisation for the consumer (used by IDE hints / linters). */
  type: RegistryFileType;
  /** Optional override of where the file should land in the consumer project. */
  target?: string;
}

export interface UsageApiInput {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  default?: string;
}

export interface UsageApiOutput {
  name: string;
  payload: string;
  description?: string;
}

export interface UsageApi {
  inputs?: UsageApiInput[];
  outputs?: UsageApiOutput[];
}

export interface UsageExample {
  title: string;
  description?: string;
  code: string;
}

export interface RegistryUsage {
  /** One-liner answer to "what is this for?". */
  whenToUse: string;
  /** One-liner answer to "what should I reach for instead?". */
  whenNotToUse: string;
  /** Bullet list of best practices. */
  bestPractices: string[];
  /** Bullet list of common mistakes. */
  antipatterns: string[];
  /** Public API surface — inputs/outputs/etc. */
  api?: UsageApi;
  /** Hand-written examples. */
  examples?: UsageExample[];
}

export type RegistryFramework = 'ng' | 'rx' | 'vue' | 'sv';

export interface RegistryItem {
  $schema: string;
  /** Stable id used by `gremorie add <name>`. Kebab-case. */
  name: string;
  /** shadcn-compatible type. */
  type: RegistryItemType;
  /** Which UI framework this item targets. */
  framework: RegistryFramework;
  title: string;
  description: string;
  /** Free-form tags for search / grouping. */
  categories: string[];
  /** Runtime dependencies the consumer must install (npm names). */
  dependencies: string[];
  /** Dev-time dependencies. */
  devDependencies: string[];
  /** Other registry items the CLI must install first. */
  registryDependencies: string[];
  /** Files the CLI should copy into the consumer project. */
  files: RegistryFile[];
  /** CSS variables injected into the global stylesheet. */
  cssVars: Record<string, string>;
  /** Usage knowledge consumed by the MCP server. */
  usage: RegistryUsage;
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
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryIndexEntry[];
}

/**
 * Internal config describing one item the generator should emit. The generator
 * walks each entry, reads its source files + usage.md, and produces a
 * RegistryItem JSON.
 */
export interface ItemConfig {
  name: string;
  framework: RegistryFramework;
  title: string;
  description: string;
  categories: string[];
  /** Package root, relative to repo root (e.g. `packages/ng-core`). */
  packageRoot: string;
  /** Glob-free list of source files to bundle, relative to packageRoot. */
  sourceFiles: string[];
  /** Optional list of asset files (CSS, etc.), relative to packageRoot. */
  assetFiles?: string[];
  /** Target path prefix inside the consumer project. */
  targetPrefix: string;
  /**
   * Optional prefix to strip from each source file path before applying
   * `targetPrefix`. Defaults to `src/`.
   *
   * Useful for granular items that live deep inside the source tree but
   * should land at a clean, semantic location in the consumer project.
   * Example: with `srcStrip: 'src/lib/prompt-input/'` and `targetPrefix:
   * 'src/app/gremorie/ai/prompt-input'`, the source
   * `src/lib/prompt-input/prompt-input.ts` becomes
   * `src/app/gremorie/ai/prompt-input/prompt-input.ts`.
   */
  srcStrip?: string;
  /** npm runtime dependencies. */
  dependencies: string[];
  /** npm dev dependencies. */
  devDependencies?: string[];
  /** Other registry items this depends on. */
  registryDependencies: string[];
  /** CSS variables to inject. */
  cssVars?: Record<string, string>;
}
