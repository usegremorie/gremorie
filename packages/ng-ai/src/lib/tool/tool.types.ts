/**
 * Mirrors the AI SDK `ToolUIPart["state"]` values. Inlined so consumers do
 * not need to install `ai` just to render a tool card.
 */
export type ToolState =
  | 'input-streaming'
  | 'input-available'
  | 'approval-requested'
  | 'approval-responded'
  | 'output-available'
  | 'output-error'
  | 'output-denied';
