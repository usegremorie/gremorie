import type { ComponentContract } from './types';
import { chartArtifact } from './contracts/artifacts/chart-artifact.contract';
import { ARTIFACTS_CONTRACTS } from './contracts/artifacts';
import { BLOCKS_CONTRACTS } from './contracts/blocks';
import { CHART_CONTRACTS } from './contracts/data/charts.contract';
import { chartTooltip } from './contracts/data/chart-tooltip.contract';
import { CHATBOT_CONTRACTS } from './contracts/chatbot';
import { CONTAINERS_CONTRACTS } from './contracts/containers';
import { DISPLAY_CONTRACTS } from './contracts/display';
import { FEEDBACK_CONTRACTS } from './contracts/feedback';
import { FORMS_CONTRACTS } from './contracts/forms';
import { NAVIGATION_CONTRACTS } from './contracts/navigation';
import { OVERLAYS_CONTRACTS } from './contracts/overlays';
import { UTILITIES_CONTRACTS } from './contracts/utilities';

export * from './types';
export * from './generators/props-table';
export * from './generators/workbench';
export { chartArtifact };
export * from './contracts/data/charts.contract';

// NOTE: the parity lint (./lint/*) is intentionally NOT re-exported here - it
// depends on ts-morph (node-only). Consumers that need it (tests, CI) import
// from './lint/parity' / './lint/introspect' directly, so the browser/docs
// barrel stays free of node-only deps.

/** Every registered component contract. Generators and the parity lint iterate this. */
export const CONTRACTS: ComponentContract[] = [
  ...ARTIFACTS_CONTRACTS,
  ...CHART_CONTRACTS,
  chartTooltip,
  ...FORMS_CONTRACTS,
  ...DISPLAY_CONTRACTS,
  ...OVERLAYS_CONTRACTS,
  ...CONTAINERS_CONTRACTS,
  ...FEEDBACK_CONTRACTS,
  ...NAVIGATION_CONTRACTS,
  ...UTILITIES_CONTRACTS,
  ...CHATBOT_CONTRACTS,
  ...BLOCKS_CONTRACTS,
];
