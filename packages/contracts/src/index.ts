import type { ComponentContract } from './types';
import { chartArtifact } from './contracts/artifacts/chart-artifact.contract';

export * from './types';
export * from './generators/props-table';
export { chartArtifact };

// NOTE: the parity lint (./lint/*) is intentionally NOT re-exported here - it
// depends on ts-morph (node-only). Consumers that need it (tests, CI) import
// from './lint/parity' / './lint/introspect' directly, so the browser/docs
// barrel stays free of node-only deps.

/** Every registered component contract. Generators and the parity lint iterate this. */
export const CONTRACTS: ComponentContract[] = [chartArtifact];
