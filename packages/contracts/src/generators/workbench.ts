import type { ComponentContract, Guidance } from '../types';
import { toPropRows, type PropRow } from './props-table';

/** A control the workbench renders to drive both previews. */
export type ControlKind = 'select' | 'toggle' | 'number' | 'text';

export interface WorkbenchControl {
  name: string;
  kind: ControlKind;
  options?: string[];
  default?: string | number | boolean;
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
  forms: { rx: '@gremorie/rx-forms', ng: '@gremorie/ng-core' },
  containers: { rx: '@gremorie/rx-containers', ng: '@gremorie/ng-containers' },
};

/**
 * Derive the interactive controls from a contract's props: enum -> select,
 * boolean -> toggle, number -> number, plain string -> text. Complex props
 * (data arrays, config records, icons, callbacks) and `adapts` props are not
 * controls - they are data or per-framework deviations.
 */
function toControls(contract: ComponentContract): WorkbenchControl[] {
  const controls: WorkbenchControl[] = [];
  for (const p of contract.props) {
    if (p.adapts) continue;
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
  return controls;
}

function buildCommands(
  name: string,
  category: string,
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
  return {
    rx: { registry: `npx gremorie add rx-${name}`, npm: `npm i ${pkg.rx}` },
    ng: { registry: `npx gremorie add ng-${name}`, npm: `npm i ${pkg.ng}` },
  };
}

/** Build the workbench entry for one contract. */
export function toWorkbenchEntry(contract: ComponentContract): WorkbenchEntry {
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
    commands: buildCommands(contract.name, contract.category),
  };
}

/** Build the full workbench manifest from a list of contracts. */
export function workbenchManifest(
  contracts: ComponentContract[],
): WorkbenchEntry[] {
  return contracts.map(toWorkbenchEntry);
}
