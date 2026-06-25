import { artifact } from './artifact.contract';
import { chartArtifact } from './chart-artifact.contract';
import { codeBlock } from './code-block.contract';
import { webPreview } from './web-preview.contract';

/** All `artifacts` category contracts (chart-artifact is the Chart preset). */
export const ARTIFACTS_CONTRACTS = [
  chartArtifact,
  artifact,
  codeBlock,
  webPreview,
];
