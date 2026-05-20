/**
 * The registry is the source of truth for what components ShadNG knows
 * about. For v0.1 it is hardcoded — entries map a friendly name to the
 * npm package consumers install via `shadng add <name>`.
 *
 * v0.2+ the registry will be hosted (shadng.dev/registry/index.json) so
 * the CLI can pull updated entries without a re-release.
 */

export interface RegistryEntry {
  /** Friendly name used in `shadng add <name>` */
  name: string;
  /** npm package that ships the component */
  pkg: string;
  /** Short description shown in `shadng list` */
  description: string;
  /** Other ShadNG packages it depends on */
  depends?: readonly string[];
  /** Phase number — drives "Coming soon" hint */
  phase: number;
  /** Whether the component is shippable in v0.1.0 */
  available: boolean;
}

export const REGISTRY: readonly RegistryEntry[] = [
  {
    name: 'core',
    pkg: '@shadng/core',
    description: 'Shared utilities, design tokens, and the Button primitive.',
    phase: 1,
    available: true,
  },
  {
    name: 'attachments',
    pkg: '@shadng/attachments',
    description: 'Composable attachment list — grid / inline / list variants.',
    depends: ['@shadng/core'],
    phase: 1,
    available: true,
  },
  {
    name: 'prompt-input',
    pkg: '@shadng/prompt-input',
    description: 'Prompt input family with state machine, drag-drop, and submit.',
    depends: ['@shadng/core', '@shadng/attachments'],
    phase: 1,
    available: true,
  },
  // Future:
  {
    name: 'response',
    pkg: '@shadng/response',
    description: 'Streaming response renderer with markdown support.',
    depends: ['@shadng/core'],
    phase: 2,
    available: false,
  },
  {
    name: 'conversation',
    pkg: '@shadng/conversation',
    description: 'Chat conversation timeline with virtualized message list.',
    depends: ['@shadng/core'],
    phase: 3,
    available: false,
  },
  {
    name: 'reasoning',
    pkg: '@shadng/reasoning',
    description: 'Collapsible chain-of-thought / reasoning block.',
    depends: ['@shadng/core'],
    phase: 4,
    available: false,
  },
  {
    name: 'tool-call',
    pkg: '@shadng/tool-call',
    description: 'Card for AI tool invocations with input/output state.',
    depends: ['@shadng/core'],
    phase: 4,
    available: false,
  },
] as const;

export function findEntry(name: string): RegistryEntry | undefined {
  return REGISTRY.find((entry) => entry.name === name);
}
