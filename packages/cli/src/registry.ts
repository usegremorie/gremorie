/**
 * The registry is the source of truth for what components Gremorie NG knows
 * about. For v0.1 it is hardcoded — entries map a friendly name to the
 * npm package consumers install via `gremorie add <name>`.
 *
 * v0.2+ the registry will be hosted (gremorie.com/registry/index.json) so
 * the CLI can pull updated entries without a re-release.
 */

export interface RegistryEntry {
  /** Friendly name used in `gremorie add <name>` */
  name: string;
  /** npm package that ships the component */
  pkg: string;
  /** Short description shown in `gremorie list` */
  description: string;
  /** Other Gremorie NG packages it depends on */
  depends?: readonly string[];
  /** Phase number — drives "Coming soon" hint */
  phase: number;
  /** Whether the component is shippable in v0.1.0 */
  available: boolean;
}

export const REGISTRY: readonly RegistryEntry[] = [
  {
    name: 'core',
    pkg: '@gremorie/ng-core',
    description: 'Shared utilities, design tokens, and the Button primitive.',
    phase: 1,
    available: true,
  },
  {
    name: 'attachments',
    pkg: '@gremorie/ng-attachments',
    description: 'Composable attachment list — grid / inline / list variants.',
    depends: ['@gremorie/ng-core'],
    phase: 1,
    available: true,
  },
  {
    name: 'prompt-input',
    pkg: '@gremorie/ng-prompt-input',
    description: 'Prompt input family with state machine, drag-drop, and submit.',
    depends: ['@gremorie/ng-core', '@gremorie/ng-attachments'],
    phase: 1,
    available: true,
  },
  {
    name: 'scroll-area',
    pkg: '@gremorie/ng-scroll-area',
    description: 'Design-system styled scrollbar — wrapper over ngx-scrollbar.',
    depends: ['ngx-scrollbar'],
    phase: 1,
    available: true,
  },
  {
    name: 'charts',
    pkg: '@gremorie/ng-charts',
    description: 'Dashboard charts on D3 — headless primitives + styled presets (Area first).',
    depends: ['@gremorie/ng-core'],
    phase: 1,
    available: true,
  },
  // Future:
  {
    name: 'response',
    pkg: '@gremorie/ng-response',
    description: 'Streaming response renderer with markdown support.',
    depends: ['@gremorie/ng-core'],
    phase: 2,
    available: false,
  },
  {
    name: 'conversation',
    pkg: '@gremorie/ng-conversation',
    description: 'Chat conversation timeline with virtualized message list.',
    depends: ['@gremorie/ng-core'],
    phase: 3,
    available: false,
  },
  {
    name: 'reasoning',
    pkg: '@gremorie/ng-reasoning',
    description: 'Collapsible chain-of-thought / reasoning block.',
    depends: ['@gremorie/ng-core'],
    phase: 4,
    available: false,
  },
  {
    name: 'tool-call',
    pkg: '@gremorie/ng-tool-call',
    description: 'Card for AI tool invocations with input/output state.',
    depends: ['@gremorie/ng-core'],
    phase: 4,
    available: false,
  },
] as const;

export function findEntry(name: string): RegistryEntry | undefined {
  return REGISTRY.find((entry) => entry.name === name);
}
