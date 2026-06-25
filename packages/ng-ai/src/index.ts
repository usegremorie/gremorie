// Prompt Input
export * from './lib/prompt-input/prompt-input';
export * from './lib/prompt-input/prompt-input-textarea';
export * from './lib/prompt-input/prompt-input-submit';
export * from './lib/prompt-input/prompt-input-toolbar';
export * from './lib/prompt-input/prompt-input-tools';
export * from './lib/prompt-input/prompt-input-action-menu';
export * from './lib/prompt-input/prompt-input-model-select';
export type * from './lib/prompt-input/prompt-input.types';

// Attachments
export { AttachmentList } from './lib/attachments/attachment-list';
export { AttachmentItem } from './lib/attachments/attachment-item';
export { AttachmentPreview } from './lib/attachments/attachment-preview';
export { AttachmentInfo } from './lib/attachments/attachment-info';
export { AttachmentName } from './lib/attachments/attachment-name';
export { AttachmentSize } from './lib/attachments/attachment-size';
export { AttachmentRemove } from './lib/attachments/attachment-remove';
export { AttachmentEmpty } from './lib/attachments/attachment-empty';

export type {
  AttachmentData,
  AttachmentMediaCategory,
  AttachmentVariant,
} from './lib/attachments/attachment.types';

export {
  formatFileSize,
  getAttachmentLabel,
  getMediaCategory,
  toAttachmentData,
} from './lib/attachments/attachment.utils';

// Message (chatbot bubble)
export * from './lib/message';

// Conversation (auto-stick scroll log)
export * from './lib/conversation';

// Assistant (flagship composed chat surface — chat-surface block parity)
export * from './lib/assistant';

// Suggestion (clickable chips)
export * from './lib/suggestion';

// Shimmer (text gradient sweep directive)
export * from './lib/shimmer';

// Reasoning (collapsible thinking block)
export * from './lib/reasoning';

// ChainOfThought (step list)
export * from './lib/chain-of-thought';

// Sources (citation cards)
export * from './lib/sources';

// InlineCitation (footnote citation with hover-card)
export * from './lib/inline-citation';

// Task (collapsible file list card)
export * from './lib/task';

// Tool (AI SDK tool invocation card)
export * from './lib/tool';

// Toolbar (generic action row)
export * from './lib/toolbar';

// CodeBlock (Shiki syntax highlight) — canonical home is @gremorie/ng-artifacts
// (parity with React, where CodeBlock lives in @gremorie/rx-artifacts and rx-ai
// re-exports it). Re-exported here for backward compatibility.
export {
  CodeBlock,
  CODE_BLOCK,
  highlightCode,
  CodeBlockCopyButton,
  type CodeBlockState,
} from '@gremorie/ng-artifacts';

// Checkpoint (conversation save-point row)
export * from './lib/checkpoint';

// Confirmation (tool approval alert)
export * from './lib/confirmation';

// Context (token-usage hover card)
export * from './lib/context';

// Image (AI-generated image)
export * from './lib/image';

// ModelSelector (command-palette model picker)
export * from './lib/model-selector';

// OpenInChat (open-in-provider dropdown)
export * from './lib/open-in-chat';

// Plan (collapsible plan card)
export * from './lib/plan';

// Queue (queued messages / todos)
export * from './lib/queue';
