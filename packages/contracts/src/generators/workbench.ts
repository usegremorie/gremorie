import type { ComponentContract, Guidance } from '../types';
import { toPropRows, type PropRow } from './props-table';

/** A control the workbench renders to drive both previews. */
export type ControlKind = 'select' | 'toggle' | 'number' | 'text';

export interface WorkbenchControl {
  name: string;
  kind: ControlKind;
  options?: string[];
  default?: string | number | boolean;
  /** One-line description (demo controls carry their spec's desc). */
  desc?: string;
  /**
   * True for story-level composition toggles (from `contract.demo`): they drive
   * the previews via Storybook args but are NOT component props, so they must
   * not appear in the generated usage code.
   */
  demo?: boolean;
}

export interface FrameworkCommands {
  /** Registry CLI command, e.g. `npx gremorie add rx-chart-artifact`. */
  registry: string;
  /** npm install of the bundle package, e.g. `npm i @gremorie/rx-artifacts`. */
  npm: string;
}

/** Everything the `/workbench` route needs for one component. */
export interface WorkbenchEntry {
  name: string;
  category: string;
  status?: string;
  anatomy: string;
  props: PropRow[];
  controls: WorkbenchControl[];
  guidance: Guidance;
  preview: { rx?: string; ng?: string };
  /** Component identifier per edition (rx PascalCase name, ng selector). */
  tag: { rx?: string; ng?: string };
  /** Canonical controllable-prop values: seed the controls, drive the live code. */
  example: Record<string, string | number | boolean>;
  commands: { rx: FrameworkCommands; ng: FrameworkCommands };
}

/** Maps a doc category to its React/Angular npm bundle packages. */
const NPM_PKG: Record<string, { rx: string; ng: string }> = {
  artifacts: { rx: '@gremorie/rx-artifacts', ng: '@gremorie/ng-artifacts' },
  data: { rx: '@gremorie/rx-data', ng: '@gremorie/ng-data' },
  chatbot: { rx: '@gremorie/rx-ai', ng: '@gremorie/ng-ai' },
  // Blocks are composed from the AI primitives; both editions live in the
  // AI bundle packages.
  blocks: { rx: '@gremorie/rx-ai', ng: '@gremorie/ng-ai' },
  display: { rx: '@gremorie/rx-display', ng: '@gremorie/ng-display' },
  feedback: { rx: '@gremorie/rx-feedback', ng: '@gremorie/ng-feedback' },
  forms: { rx: '@gremorie/rx-forms', ng: '@gremorie/ng-forms' },
  containers: { rx: '@gremorie/rx-containers', ng: '@gremorie/ng-containers' },
  overlays: { rx: '@gremorie/rx-overlays', ng: '@gremorie/ng-overlays' },
  navigation: {
    rx: '@gremorie/rx-navigation',
    ng: '@gremorie/ng-navigation',
  },
  // Utility components (Image, OpenInChat) ship inside the AI bundles.
  utilities: { rx: '@gremorie/rx-ai', ng: '@gremorie/ng-ai' },
};

/**
 * Derive the interactive controls from a contract's props: enum -> select,
 * boolean -> toggle, number -> number, plain string -> text. Complex props
 * (data arrays, config records, icons, callbacks) and `adapts` props are not
 * controls - they are data or per-framework deviations. `control: true` forces
 * a prop in despite `adapts`; `control: false` always excludes it. Story-level
 * `demo` composition toggles are appended after the prop controls.
 */
function toControls(contract: ComponentContract): WorkbenchControl[] {
  const controls: WorkbenchControl[] = [];
  for (const p of contract.props) {
    if (p.control === false) continue;
    if (p.adapts && p.control !== true) continue;
    if (p.options) {
      controls.push({
        name: p.name,
        kind: 'select',
        options: p.options,
        default: p.default,
      });
    } else if (p.type === 'boolean') {
      controls.push({ name: p.name, kind: 'toggle', default: p.default });
    } else if (p.type === 'number') {
      controls.push({ name: p.name, kind: 'number', default: p.default });
    } else if (p.type === 'string') {
      controls.push({ name: p.name, kind: 'text', default: p.default });
    }
  }
  for (const d of contract.demo ?? []) {
    if (d.options) {
      controls.push({
        name: d.name,
        kind: 'select',
        options: d.options,
        default: d.default,
        desc: d.desc,
        demo: true,
      });
    } else if (d.type === 'boolean') {
      controls.push({
        name: d.name,
        kind: 'toggle',
        default: d.default,
        desc: d.desc,
        demo: true,
      });
    } else {
      controls.push({
        name: d.name,
        kind: 'text',
        default: d.default,
        desc: d.desc,
        demo: true,
      });
    }
  }
  return controls;
}

/** Optional inputs that refine the generated commands. */
export interface WorkbenchOptions {
  /**
   * Names of the items that actually exist in the published registry index
   * (e.g. `apps/docs/public/r/registry.json` items). The Angular registry
   * covers only a subset of the contracts, so when this set is provided the
   * `npx gremorie add ng-<name>` command is emitted ONLY if `ng-<name>` is a
   * real registry item; otherwise the npm install command is used as the
   * registry-command replacement (the workbench UI collapses the two equal
   * lines into one). Undefined keeps the historical behavior: always emit
   * the registry command.
   */
  ngRegistryItems?: Set<string>;
}

function buildCommands(
  name: string,
  category: string,
  options?: WorkbenchOptions,
): { rx: FrameworkCommands; ng: FrameworkCommands } {
  const pkg = NPM_PKG[category] ?? {
    rx: '@gremorie/rx-core',
    ng: '@gremorie/ng-core',
  };
  // Blocks are distributed differently from primitives: React blocks are a
  // registry `block-<name>` (copy-paste); Angular blocks ship inside the package
  // (no per-block registry), consumed as the element from the bundle.
  if (category === 'blocks') {
    return {
      rx: {
        registry: `npx gremorie add block-${name}`,
        npm: `npm i ${pkg.rx}`,
      },
      ng: { registry: `npm i ${pkg.ng}`, npm: `npm i ${pkg.ng}` },
    };
  }
  // Gate the ng registry command on the item actually existing: an
  // unpublished `ng-<name>` degrades to the npm install of the bundle.
  const ngItems = options?.ngRegistryItems;
  const ngRegistry =
    ngItems === undefined || ngItems.has(`ng-${name}`)
      ? `npx gremorie add ng-${name}`
      : `npm i ${pkg.ng}`;
  return {
    rx: { registry: `npx gremorie add rx-${name}`, npm: `npm i ${pkg.rx}` },
    ng: { registry: ngRegistry, npm: `npm i ${pkg.ng}` },
  };
}

/** Build the workbench entry for one contract. */
export function toWorkbenchEntry(
  contract: ComponentContract,
  options?: WorkbenchOptions,
): WorkbenchEntry {
  return {
    name: contract.name,
    category: contract.category,
    status: contract.status,
    anatomy: contract.anatomy,
    props: toPropRows(contract),
    controls: toControls(contract),
    guidance: contract.guidance,
    preview: contract.preview ?? {},
    tag: contract.tag ?? {},
    example: contract.example ?? {},
    commands: buildCommands(contract.name, contract.category, options),
  };
}

/** Build the full workbench manifest from a list of contracts. */
export function workbenchManifest(
  contracts: ComponentContract[],
  options?: WorkbenchOptions,
): WorkbenchEntry[] {
  return contracts.map((contract) => toWorkbenchEntry(contract, options));
}
