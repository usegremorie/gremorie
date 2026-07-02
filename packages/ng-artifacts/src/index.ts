// Artifact shell
export * from './lib/artifact/artifact';
export * from './lib/artifact/icons';

// ChartArtifact preset
export * from './lib/chart-artifact/chart-artifact';

// CodeBlock (Shiki syntax highlight) — canonical home (parity with React's
// @gremorie/rx-artifacts). @gremorie/ng-ai re-exports these for back-compat.
export {
  CodeBlock,
  CODE_BLOCK,
  highlightCode,
  type CodeBlockState,
} from './lib/code-block/code-block';
export { CodeBlockCopyButton } from './lib/code-block/code-block-copy-button';

// WebPreview (sandboxed iframe preview card)
export * from './lib/web-preview/web-preview';
