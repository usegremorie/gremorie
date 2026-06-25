import type { ComponentContract } from './types';
import { chartArtifact } from './contracts/artifacts/chart-artifact.contract';
import { CHART_CONTRACTS } from './contracts/data/charts.contract';
import { DISPLAY_CONTRACTS } from './contracts/display';
import { FORMS_CONTRACTS } from './contracts/forms';
import { OVERLAYS_CONTRACTS } from './contracts/overlays';

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
  chartArtifact,
  ...CHART_CONTRACTS,
  ...FORMS_CONTRACTS,
  ...DISPLAY_CONTRACTS,
  ...OVERLAYS_CONTRACTS,
];
